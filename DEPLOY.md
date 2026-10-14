# Deploying Nexture Education

Two domains, one small Docker stack (Postgres, Django API, Next.js site), bound to
`127.0.0.1` and fronted by the server's existing nginx. Nothing here touches the other
projects running on the server (they use other ports and their own databases).

| What | Where | Default port (127.0.0.1) |
|---|---|---|
| Public site and admin panel | `https://nexture.edu.np` | 3082 |
| API and uploaded media | `https://api.nexture.edu.np` | 8082 |
| Postgres | private to the stack | none |

Ports 3082 and 8082 are free on the current server (taken: 3000-3003, 3072, 3101, 8000,
8011, 8031, 8056, 8072, 8090, 8443). Change `FRONTEND_PORT` / `BACKEND_PORT` in `.env` if needed.

## One-time setup

1. **DNS**: point `nexture.edu.np`, `www.nexture.edu.np` and `api.nexture.edu.np` (A records) at `77.37.47.54`.
2. **Get the code** on the server:
   ```
   cd /var/www && git clone https://github.com/ronishdhakal/nextureeducation.git nexture
   cd nexture
   ```
3. **Configure**:
   ```
   cp deploy/.env.example .env
   nano .env      # set DJANGO_SECRET_KEY, DB_PASSWORD, domains; keep USE_R2_STORAGE=False unless using R2
   ```
   Generate the secret with `python3 -c "import secrets; print(secrets.token_urlsafe(60))"`.
4. **Start**:
   ```
   docker compose -f docker-compose.prod.yml up -d --build
   docker compose -f docker-compose.prod.yml ps        # backend should become "healthy"
   ```
   The backend applies database migrations on every start.
5. **nginx + HTTPS**: check how nginx is installed (`nginx -v`, `ls /etc/nginx/sites-enabled`),
   then copy `deploy/nginx-nexture.conf` into place, enable it, `nginx -t && systemctl reload nginx`,
   and run certbot (command at the top of that file).
6. **Create the first admin** (the email is the login):
   ```
   docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
   ```
   Then sign in at `https://nexture.edu.np/admin` and add staff under **Users & Roles**.
7. **After HTTPS works**, set `DJANGO_HSTS_SECONDS=31536000` in `.env` and run step 4 again.

The database starts empty. Nothing is seeded: add destinations, universities, services,
classes, testimonials, branches and site settings (phone, email, stats) in the admin panel.

## Updating

```
cd /var/www/nexture && git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Backups

```
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U nexture nexture | gzip > nexture-$(date +%F).sql.gz
docker run --rm -v nexture_media_data:/media -v "$PWD":/out alpine tar czf /out/nexture-media-$(date +%F).tgz -C /media .
```

Run both on a schedule (cron) and copy the results off the server.

## Things to know

- **Uploaded files** (including student documents) are stored under random file names but are
  reachable by anyone who has the exact link. If you handle passports and similar, consider
  Cloudflare R2 with private access, or ask for sign-in protected downloads.
- **`NEXT_PUBLIC_*` values** are baked into the site at build time. Changing a domain means rebuilding
  (`up -d --build`), not just restarting.
- **Logs**: `docker compose -f docker-compose.prod.yml logs -f backend frontend`.
- The Django admin at `https://api.nexture.edu.np/admin/` is a fallback; day-to-day work happens in the
  site's own admin panel.
