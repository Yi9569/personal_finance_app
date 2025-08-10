# Personal Finance MVP (One-Day Hackathon)

Production-ish starter you can deploy same-day. Local uses SQLite via Prisma for speed; switch to Postgres later.

## Stack
- Next.js 14 (App Router) + TS + Tailwind
- Prisma ORM
- SQLite (local) → Postgres (prod)
- Recharts for charts

## Quick Start (Local)
```bash
# 1) Clone & install
npm install

# 2) Configure env
cp .env.local.example .env.local

# 3) Create DB & seed demo data
npm run db:migrate
npm run db:seed

# 4) Dev
npm run dev  # http://localhost:3000
```

Demo mode (`DEMO=true`) auto-creates a demo user and skips real auth.

## Deploy
- Vercel for web/API
- For Postgres: set `DATABASE_PROVIDER=postgresql` and `DATABASE_URL`.
- Run `npm run build` and `npm run db:deploy` in CI.

## Repo Workflow (2 devs)
- Branch from `main` → `feat/*`
- Small PRs with screenshots/GIFs
- Optional GitHub Action: lint/typecheck/build

## Example Flow
- Add an expense (e.g., `-18.20 Uber`) on /transactions
- Set a monthly budget for Groceries on /budgets
- Watch Dashboard update (income/expense/net, category bars, line over time)
```

## Notes
- This starter uses a simple HTML form for budgets and a client fetch for transactions to keep it hackathon-simple.
- Replace demo auth with Supabase/Clerk when ready.
- For Postgres, remember to create initial categories/accounts per user (seed script shows how).
