#!/usr/bin/env bash
# Nexture deploy step. Run on the server from /var/www/nexture by a wrapper that has
# already done `git merge --ff-only origin/main` and exported PREV_COMMIT (the commit that
# was checked out before the pull).
#
# Only the "nexture" compose project is touched (backend + frontend; the database is left
# running). Nothing here prunes images/volumes or reads/prints .env.
set -euo pipefail

: "${PREV_COMMIT:?PREV_COMMIT must be exported by the wrapper}"

cd "$(dirname "${BASH_SOURCE[0]}")/.."

COMPOSE=(docker compose -f docker-compose.prod.yml)
BACKUP_DIR=/var/backups/nexture
LOCK_FILE=/var/lock/nexture-deploy.lock
HEALTH_TIMEOUT=120
KEEP_BACKUPS=10
BACKUP_FILE=""

log() { printf '[deploy %s] %s\n' "$(date +%H:%M:%S)" "$*"; }

# --- 1. one deploy at a time --------------------------------------------------
exec 9>"$LOCK_FILE"
if ! flock -w 600 9; then
  log "Another deploy has held the lock for 10 minutes; giving up."
  exit 1
fi

NEW_COMMIT="$(git rev-parse --short HEAD)"
log "Deploying ${NEW_COMMIT} (previous: ${PREV_COMMIT:0:7})"

# --- helpers -----------------------------------------------------------------
backend_healthy() {
  local cid status
  cid="$("${COMPOSE[@]}" ps -q backend 2>/dev/null || true)"
  [ -n "$cid" ] || return 1
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$cid" 2>/dev/null || true)"
  [ "$status" = "healthy" ]
}

all_healthy() {
  backend_healthy \
    && curl -fs --max-time 5 http://127.0.0.1:8082/api/health/ >/dev/null \
    && [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1:3082/)" = "200" ]
}

wait_until_healthy() {
  local waited=0
  while [ "$waited" -lt "$HEALTH_TIMEOUT" ]; do
    if all_healthy; then
      log "Backend healthy, API answering, site returning 200 (after ${waited}s)."
      return 0
    fi
    sleep 3
    waited=$((waited + 3))
  done
  return 1
}

rollback() {
  log "Deploy failed. Last 40 backend log lines:"
  "${COMPOSE[@]}" logs --no-color --tail=40 backend || true

  log "Rolling the code back to ${PREV_COMMIT:0:7} and rebuilding backend + frontend."
  git reset --hard "$PREV_COMMIT"
  if "${COMPOSE[@]}" up -d --build backend frontend; then
    log "Previous version is starting again."
  else
    log "Rebuilding the previous version also failed; check the stack by hand."
  fi

  log "WARNING: database migrations are NOT reverted by this rollback."
  if [ -n "$BACKUP_FILE" ]; then
    log "A database backup taken just before this deploy exists: $BACKUP_FILE"
    log "Restore it only if the new migrations broke the data."
  fi
  exit 1
}

# --- 2. pre-deploy database backup when migrations changed ---------------------
if git diff --name-only "$PREV_COMMIT" HEAD | grep -Eq '^backend/[^/]+/migrations/'; then
  log "Migrations changed; taking a database backup first."
  mkdir -p "$BACKUP_DIR"
  BACKUP_FILE="$BACKUP_DIR/pre-deploy-$(date +%F-%H%M)-${NEW_COMMIT}.sql.gz"
  if ! "${COMPOSE[@]}" exec -T db pg_dump -U nexture nexture | gzip > "$BACKUP_FILE.part"; then
    rm -f "$BACKUP_FILE.part"
    log "Database backup failed; not deploying. Restoring the previous checkout."
    git reset --hard "$PREV_COMMIT"
    exit 1
  fi
  mv "$BACKUP_FILE.part" "$BACKUP_FILE"
  log "Backup written: $BACKUP_FILE"

  # keep only the newest $KEEP_BACKUPS pre-deploy backups
  # shellcheck disable=SC2012
  ls -1t "$BACKUP_DIR"/pre-deploy-*.sql.gz 2>/dev/null | tail -n +"$((KEEP_BACKUPS + 1))" | xargs -r rm -f --
else
  log "No migration changes; skipping the database backup."
fi

# --- 3. build + start backend and frontend -----------------------------------
log "Building and starting backend and frontend."
if ! "${COMPOSE[@]}" up -d --build backend frontend; then
  rollback
fi

# --- 4. wait for health -------------------------------------------------------
log "Waiting up to ${HEALTH_TIMEOUT}s for the new version to become healthy."
if ! wait_until_healthy; then
  log "Health check did not pass within ${HEALTH_TIMEOUT}s."
  rollback
fi

"${COMPOSE[@]}" ps
log "Deploy of ${NEW_COMMIT} finished."
