# Nexture Education

Monorepo for the Nexture Education website and admin panel.

```
nexture/
  backend/        Django 5 + DRF + PostgreSQL
  frontend/       Next.js (App Router) — public site + admin panel
  docker-compose.yml
```

Design system: **"The Passage"** — see `frontend/components/ui/BoardingPass.tsx`.

## Local development (without Docker)

**Backend**

```
cd backend
python -m venv venv
venv\Scripts\activate        # Windows; use `source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

No `.env` is required for local dev — settings fall back to SQLite and a console
email backend automatically. Copy `.env.example` to `.env` to point at Postgres
or configure R2/email.

**Frontend**

```
cd frontend
npm install
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env` and set `NEXT_PUBLIC_API_URL`
if the backend isn't on `http://localhost:8000`.

## Local development (Docker)

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Backend: http://localhost:8000 (admin at `/admin`, API docs at `/api/docs`)
- Frontend: http://localhost:3000

Run migrations and create an admin user inside the backend container:

```
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## Status

- **Phase 1 (done):** monorepo scaffold, Docker setup, Django+DRF skeleton,
  Next.js+Tailwind skeleton, design tokens, `<BoardingPass>` design system,
  static hero rendering.
- **Phase 2:** full domain models, public/admin API, JWT auth, R2 storage, seed data.
- **Phase 3:** full public site (SSR/ISR), SEO, inquiry forms.
- **Phase 4:** admin panel (leads inbox, CRUD, uploads).
- **Phase 5:** accessibility/performance pass, tests, deploy docs for the
  Hostinger VPS + Cloudflare + R2 target.
