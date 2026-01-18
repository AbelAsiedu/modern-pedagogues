# The Modern Pedagogues

Production-ready Node.js/Express + EJS application for home tutoring and creator marketplace. Includes PostgreSQL for production, SQLite for local development, Stripe (optional), and a minimal optional Next.js frontend.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app defaults to SQLite when `DATABASE_URL` is not set.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (production) |
| `SQLITE_PATH` | Local SQLite path (default `./data/dev.sqlite`) |
| `SESSION_SECRET` | Session cookie signing secret |
| `STRIPE_SECRET` | Stripe secret key (optional) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (optional) |
| `SMTP_*` | SMTP settings for Nodemailer |
| `SMTP_FROM` | From address for emails |
| `FORCE_HTTPS` | Redirect HTTP to HTTPS when true |
| `TRUST_PROXY` | Set `true` on Heroku |
| `COOKIE_DOMAIN` | Optional cookie domain |
| `SEED_ADMIN` | Seed dev admin user (default true in dev) |

## Scripts

- `npm run dev` — start with nodemon
- `npm start` — start production server
- `npm test` — run Jest tests
- `npm run heroku-postbuild` — build optional frontend

## Optional Next.js frontend

The `frontend/` folder is a minimal Next.js app. Build it via:

```bash
cd frontend
npm install
npm run build
```

The Express server will serve `frontend/out` if present.

## Heroku deployment

- Use Node 18/20/24
- Add `DATABASE_URL` (Postgres)
- Set `TRUST_PROXY=true`
- Configure Stripe/SMTP env vars as needed

## Tests

```bash
npm test
```
