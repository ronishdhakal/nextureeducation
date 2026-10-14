# Nexture Education: deployment runbook (for Claude on the server)

You are helping the owner deploy the Nexture Education site on their shared Linux server.
Work through the phases below **in order**, one step at a time. After each step, run its
**Check**, show the owner the result in plain words, and only continue when it passes.
If a check fails, use the **Troubleshooting** section before changing anything else.

## Ground rules

1. **This server hosts other live projects** (see "What is already running"). Never stop,
   restart, remove or reconfigure any container, volume, network, nginx site or database
   that does not start with `nexture`. Never run `docker system prune`, `docker volume prune`,
   `docker compose down -v`, or anything with `rm -rf` outside `/var/www/nexture`.
2. **Ask before** anything destructive or hard to reverse: editing nginx for other sites,
   changing firewall rules, deleting volumes, restarting the host, running `certbot` for
   domains that already have certificates.
3. **Never print secrets** (`DJANGO_SECRET_KEY`, `DB_PASSWORD`, R2 keys, JWTs) back into the
   chat. When showing `.env`, mask the values.
4. Explain each command in one plain sentence before running it. The owner is not a
   sysadmin.
5. Do not edit application code on the server. If code needs to change, tell the owner to
   change it locally and push to GitHub, then `git pull` here.

## What this project is

- Repo: `https://github.com/ronishdhakal/nextureeducation` (branch `main`)
- Clone location: `/var/www/nexture`
- Stack, all defined in `docker-compose.prod.yml` (compose project name `nexture`):
  - `db`: Postgres 16, private (no published port)
  - `backend`: Django API on `127.0.0.1:8082` (container port 8000). Runs migrations on start.
  - `frontend`: Next.js on `127.0.0.1:3082` (container port 3000)
- Two public hostnames, both proxied by the host's nginx:
  - `https://<SITE_DOMAIN>` (default `nexture.edu.np`) goes to port 3082 (website and admin panel)
  - `https://<API_DOMAIN>` (default `api.nexture.edu.np`) goes to port 8082 (API and `/media/` uploads)
- Docker volumes: `nexture_postgres_data` (database), `nexture_media_data` (uploaded images and files)
- The database starts **empty**. There is no seed data. All content is added in the admin panel.
- Login is by **email** and password. Roles: admin, counsellor, telecaller, content manager.

## What is already running on the server

From the owner's `docker ps` (do not touch any of these):

| Container(s) | Host ports |
|---|---|
| byi-green-frontend / backend / shared-db | 127.0.0.1:3072, 127.0.0.1:8072 |
| sin_frontend_green / sin_backend_green | 3101, 8011 |
| nebexam-* (frontend, backend, db-backup, nginx) | 8056, 8090, 8443 |
| entrance_frontend_green / backend / db | 3003, 8031 |
| abroad_frontend_green / backend_blue, pgbouncer, db | 3002, 8000 |
| schoolinfonepal-db, abroadadvise-db | none |

Nexture needs ports **3082** and **8082** on 127.0.0.1. They were free when this was written;
confirm in Phase 0.

---

## Phase 0: Pre-flight (read-only, safe)

**0.1 Who am I, and is Docker usable?**
```
whoami; docker --version; docker compose version
```
Check: Docker 24+ and the compose plugin (`docker compose`, not `docker-compose`) both print versions.

**0.2 Are the ports free?**
```
ss -ltnp | grep -E ':(3082|8082)\b' || echo "3082 and 8082 are free"
```
Check: prints "3082 and 8082 are free". If not, pick two other free ports and note them for the
`.env` step (`FRONTEND_PORT`, `BACKEND_PORT`) and for the nginx file.

**0.3 Disk and memory headroom** (the two Docker builds need roughly 2 GB free and some RAM):
```
df -h / | tail -1; free -h | head -2
```

**0.4 Who owns ports 80/443, and which nginx is it?**
```
ss -ltnp | grep -E ':(80|443)\b'
nginx -v 2>&1; ls /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null
systemctl is-active nginx
```
Decide:
- **Host nginx owns 80/443** (normal case): follow Phase 5 as written.
- **A container (Traefik, Nginx Proxy Manager, the nebexam nginx...) owns 80/443**: stop and ask the
  owner how the other sites are routed. Do not start a second web server on 80/443. The two
  hostnames would need to be added to that proxy instead, pointing at `127.0.0.1:3082` and
  `127.0.0.1:8082`.

**0.5 DNS: do the three names point at this server?**
```
for h in nexture.edu.np www.nexture.edu.np api.nexture.edu.np; do echo -n "$h -> "; dig +short $h | tr '\n' ' '; echo; done
curl -s https://ifconfig.me; echo
```
Check: all three print this server's IP (`77.37.47.54`). If not, tell the owner to create the A
records at their domain registrar and wait (usually 5 to 30 minutes). Do not request
certificates until DNS resolves, or certbot will fail and may hit rate limits.

---

## Phase 1: Get the code

**1.1**
```
cd /var/www && git clone https://github.com/ronishdhakal/nextureeducation.git nexture
cd nexture && git log --oneline -1
```
If the repo is private and git asks for a username/password, GitHub no longer accepts account
passwords. Ask the owner for a personal access token (fine-grained, read-only, this repo) or set up
a read-only deploy key. Do not store the token in a file in the repo.

Check: `git log` prints the latest commit; `ls` shows `backend frontend docker-compose.prod.yml DEPLOY.md deploy`.

---

## Phase 2: Configure `.env`

**2.1 Create the file from the template**
```
cd /var/www/nexture
cp deploy/.env.example .env
chmod 600 .env
```

**2.2 Generate two secrets** (show the owner you generated them, but do not echo them into chat):
```
python3 -c "import secrets; print(secrets.token_urlsafe(60))"   # DJANGO_SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(24))"   # DB_PASSWORD
```
Use `nano .env` (or write with `sed`) to set these values:

| Variable | Value |
|---|---|
| `SITE_DOMAIN` | `nexture.edu.np` (no `https://`, no trailing slash) |
| `API_DOMAIN` | `api.nexture.edu.np` |
| `FRONTEND_PORT` / `BACKEND_PORT` | `3082` / `8082` (or the ports chosen in 0.2) |
| `DJANGO_SECRET_KEY` | generated secret |
| `DJANGO_HSTS_SECONDS` | `0` for now (raised in Phase 7) |
| `DB_NAME` / `DB_USER` | `nexture` / `nexture` |
| `DB_PASSWORD` | generated password |
| `USE_R2_STORAGE` | `False` (uploads on the docker volume). Set `True` only if the owner gives R2 keys, then fill the `R2_*` values |
| `EMAIL_*`, `LEAD_NOTIFICATION_EMAIL` | optional. Without them new-inquiry emails only go to the console log. Ask the owner whether they want inquiry emails and, if so, for SMTP details |

Check (secrets masked):
```
grep -vE '^\s*#|^\s*$' .env | sed -E 's/(SECRET_KEY|PASSWORD|SECRET_ACCESS_KEY|ACCESS_KEY_ID)=.+/\1=********/'
```
No required value may be empty (`DJANGO_SECRET_KEY`, `DB_PASSWORD`, `SITE_DOMAIN`, `API_DOMAIN`).

Do **not** commit `.env`. It is git-ignored, and `git status` must not list it.

---

## Phase 3: Build and start

**3.1 Build the images** (the first build takes several minutes; the frontend build bakes the domains in):
```
cd /var/www/nexture
docker compose -f docker-compose.prod.yml build
```
Check: ends without errors. If it fails, read the last 40 lines and see Troubleshooting.

**3.2 Start the stack**
```
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```
Check: three services (`db`, `backend`, `frontend`). `db` and `backend` become `healthy` within about a
minute (backend applies migrations first). `frontend` is `Up`.

**3.3 Confirm the backend applied its migrations**
```
docker compose -f docker-compose.prod.yml logs --tail=40 backend
```
Check: you can see `Applying ... OK` lines (first run) and gunicorn `Listening at: http://0.0.0.0:8000`.

---

## Phase 4: Local smoke test (before nginx)

```
curl -s http://127.0.0.1:8082/api/health/                     # {"status": "ok"}
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3082/   # 200
curl -s http://127.0.0.1:8082/api/destinations/ | head -c 200     # {"count":0,...} is correct: no content yet
```
Check: health is `ok`, the homepage returns `200`, the API returns an empty list (not an error).
A homepage `200` also proves the frontend can reach the backend over the docker network
(it renders on the server using `http://backend:8000/api`).

---

## Phase 5: nginx

**5.1 Install the site config** (host nginx case from 0.4)
```
sudo cp /var/www/nexture/deploy/nginx-nexture.conf /etc/nginx/sites-available/nexture.conf
sudo ln -s /etc/nginx/sites-available/nexture.conf /etc/nginx/sites-enabled/nexture.conf
```
If the server keeps vhosts in `/etc/nginx/conf.d/` instead, copy it there as `nexture.conf` and skip the symlink.
If you chose different ports or domains, edit the copy first (`proxy_pass` ports, `server_name`).

**5.2 Test and reload.** This only reloads, so other sites keep serving:
```
sudo nginx -t && sudo systemctl reload nginx
```
Check: `nginx -t` says `syntax is ok` and `test is successful`. If it reports a problem, fix only
the nexture file. Do not edit other sites' files.

**5.3 Check through nginx, over plain HTTP**
```
curl -sI -H "Host: nexture.edu.np" http://127.0.0.1/ | head -1
curl -s  -H "Host: api.nexture.edu.np" http://127.0.0.1/api/health/
```
Check: `HTTP/1.1 200 OK` and `{"status": "ok"}`.

---

## Phase 6: HTTPS (required before anyone logs in)

The admin login cookies are marked `Secure` in production, so **logging in over plain HTTP will not
work**. Do this before testing the admin panel.

```
sudo apt-get install -y certbot python3-certbot-nginx     # skip if certbot already exists: certbot --version
sudo certbot --nginx -d nexture.edu.np -d www.nexture.edu.np -d api.nexture.edu.np
```
Answer yes to redirecting HTTP to HTTPS. Check:
```
curl -sI https://nexture.edu.np/ | head -1
curl -s https://api.nexture.edu.np/api/health/
curl -sI http://nexture.edu.np/ | head -3          # should redirect (301) to https
sudo certbot certificates | grep -E "Domains|Expiry"
```
Certbot installs an automatic renewal timer; confirm with `systemctl list-timers | grep certbot`.

---

## Phase 7: First admin and first content

**7.1 Create the first admin.** The **email is the login**. Use the owner's real email and a strong password
the owner chooses (do not invent one for them):
```
cd /var/www/nexture
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```
Check: "Superuser created successfully."

**7.2 Sign in** at `https://nexture.edu.np/admin/login` with that email and password. Check:
the dashboard loads, the sidebar shows every section, and the bell appears at the top right.

**7.3 Turn on HSTS** now that HTTPS works. In `.env` set `DJANGO_HSTS_SECONDS=31536000`, then:
```
docker compose -f docker-compose.prod.yml up -d
```

**7.4 Walk the owner through first content** (the site is empty until this is done), in this order:
1. **Site Settings:** phone, email, address, social links, and the hero stat numbers (cards hide until filled).
2. **Destinations:** name, short summary, flag/logo image, background image, and the content sections.
3. **Universities** (linked to a destination), **Services**, **Classes (Test Prep)**, **Testimonials**, **Events**, **Blog**, **Branches**.
4. **Pages** with the slugs `legal-notice`, `privacy-policy`, `terms-of-use` (the footer links to them).
5. **Users & Roles:** add counsellors, telecallers and content managers (each signs in with their own email).
6. Optionally a **Popup** (square image).

**7.5 End-to-end check**
1. Upload an image in the admin, for example a destination background. Open it on the public site.
   Check: the image URL starts with `https://<API_DOMAIN>/media/` and loads. If it points at `backend:8000` or
   `localhost`, see Troubleshooting.
2. Submit the consultation form on the public site. Check: it appears in the admin under **Inquiries**,
   and the bell shows a notification.
3. Open `https://nexture.edu.np/sitemap.xml` and `https://nexture.edu.np/robots.txt`. Both load.

---

## Phase 8: Backups (set up before real data arrives)

```
mkdir -p /var/backups/nexture && cd /var/www/nexture
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U nexture nexture | gzip > /var/backups/nexture/db-$(date +%F).sql.gz
docker run --rm -v nexture_media_data:/media -v /var/backups/nexture:/out alpine tar czf /out/media-$(date +%F).tgz -C /media .
ls -lh /var/backups/nexture
```
Offer to add a daily cron entry (`crontab -e`) for both commands and a cleanup of files older than 14 days
(`find /var/backups/nexture -mtime +14 -delete`). Remind the owner to also copy backups off this server.
Test a restore at least once on a scratch database before trusting it.

---

## Updating later

```
cd /var/www/nexture
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
curl -s https://api.nexture.edu.np/api/health/
```
Take a database backup (Phase 8) before any update that includes new migrations (check with
`git diff HEAD@{1} --stat -- backend/*/migrations`).

**Rollback** if an update misbehaves:
```
git log --oneline -5                       # pick the last good commit
git checkout <good-commit>
docker compose -f docker-compose.prod.yml up -d --build
```
Database migrations are not automatically reversed. If a bad migration ran, restore the database backup.
Return to the latest code later with `git checkout main && git pull`.

---

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `docker compose ... up` says a variable is required | `.env` is missing or misses `DJANGO_SECRET_KEY`, `DB_PASSWORD` or `API_DOMAIN`. Run the compose command from `/var/www/nexture` where `.env` lives. |
| Backend keeps restarting; logs mention `DJANGO_SECRET_KEY` | The key is empty or still starts with `django-insecure`. Set a real one and `up -d`. |
| `port is already allocated` | Another service uses 3082 or 8082. Change `FRONTEND_PORT` / `BACKEND_PORT` in `.env`, update `proxy_pass` in the nginx file, reload nginx. |
| Homepage is a Next.js error, logs show `fetch failed` | Backend is not healthy, or `API_URL_INTERNAL` is wrong. `docker compose ps` and `logs backend`. It must be `http://backend:8000/api` (set by the compose file). |
| API returns `400 Bad Request` (DisallowedHost) | The host name is not in `DJANGO_ALLOWED_HOSTS`. The compose file adds `API_DOMAIN`, `backend` and `localhost`. Check `API_DOMAIN` spelling in `.env`. |
| Browser console shows CORS errors on forms | `SITE_DOMAIN` in `.env` does not match the address in the browser (`www.` is allowed, other subdomains are not). Fix `.env` and `up -d`. |
| Admin login fails or loops back to login | Not on HTTPS (cookies are `Secure`), or the email/password is wrong. Finish Phase 6. Confirm the user exists: `docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c "from django.contrib.auth import get_user_model as g; print([u.email for u in g().objects.all()])"`. |
| Images are broken; URLs contain `backend:8000` or `localhost` | `MEDIA_PUBLIC_URL` is not applied. It is derived from `API_DOMAIN`. Recheck `.env`, then `up -d --build backend frontend`. |
| `413 Request Entity Too Large` when uploading | nginx `client_max_body_size` is missing in the `api.` server block (the provided file sets 20m). |
| Uploads vanish after an update | The uploads volume was removed. Never run `down -v`. Volumes survive normal `up -d --build`. |
| Site still shows the old domain or API address | `NEXT_PUBLIC_*` values are baked in at build time. Rebuild: `docker compose -f docker-compose.prod.yml build --no-cache frontend && docker compose -f docker-compose.prod.yml up -d`. |
| Lead form says "too many requests" for everyone | The proxy IP is being counted. nginx must send `X-Forwarded-For` (the provided file does) and the stack runs with one proxy hop. Recheck the nginx file. |
| certbot fails | DNS is not pointing here yet (Phase 0.5), or port 80 is not reaching nginx. Fix that and retry. Do not loop retries (rate limits). |
| 502 Bad Gateway | The container behind that hostname is down or on a different port than `proxy_pass`. `docker compose ps`, then `curl -s http://127.0.0.1:8082/api/health/`. |

Useful commands:
```
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend frontend
docker compose -f docker-compose.prod.yml restart backend        # restarts only this project's backend
docker compose -f docker-compose.prod.yml exec backend python manage.py check
```

---

## Final report to give the owner

When everything passes, summarize in plain language:
- the two live URLs and that HTTPS works,
- that the first admin exists (give the email, never the password),
- where backups go and how often,
- the exact update command,
- anything left undone (email settings, R2, cron backups), and any assumption you made.

Also remind them: uploaded files, including student documents, can be opened by anyone with the exact link;
if they handle passports, consider private storage.
