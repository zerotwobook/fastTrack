# R1-B00 Verification Evidence

**Task:** R1-B00 — Prisma schema, migrations, seed and shared UI foundation
**Branch:** `feature/s1-b-foundation`
**Commit:** `43b458e`
**PR:** [#48](https://github.com/zerotwobook/fastTrack/pull/48) (Draft — pending G1)
**Date:** 2026-11-06
**Owner:** B — Atip Infa-udom (Atip-Infa)

---

## Environment

| Item | Value |
|---|---|
| OS | Windows 10/11 |
| Node.js | v24.14.0 (local; project requires v26 — engine warning acknowledged) |
| npm | 11.9.0 |
| PostgreSQL | 14.23 (port **5433**, not default 5432) |
| Prisma CLI / client | 7.10.1 |
| @prisma/adapter-pg | installed via npm |

> [!NOTE]
> PostgreSQL 14 on this machine listens on port **5433**. The `.env.example` documents this.
> A must use the correct port when reproducing the setup for G1.

---

## Files created / modified

| File | Purpose |
|---|---|
| `server/prisma/schema.prisma` | 7-table schema with all constraints and indexes |
| `server/prisma/migrations/20261106094006_init_sprint1_schema/migration.sql` | Full initial schema migration |
| `server/prisma/migrations/20261106094101_add_version_check_constraint/migration.sql` | `CHECK (version >= 1)` on submissions |
| `Project_code/prisma.config.ts` | Prisma 7 datasource config |
| `server/src/db/client.ts` | PrismaClient singleton with PrismaPg adapter |
| `server/prisma/seed.ts` | Idempotent seed — users, teams, members |
| `server/src/testing/fixtures.ts` | Test fixture helpers with deadline boundary milestones |
| `client/src/design/tokens.ts` | Design tokens (colours, typography, spacing) |
| `client/src/design/global.css` | Global CSS reset and custom properties |
| `client/src/design/components.tsx` | Shared UI components |
| `client/src/design/components.module.css` | Component styles (monochrome) |

---

## Migration verification

Command run:
```powershell
# From Project_code/
$env:DATABASE_URL="postgresql://fasttrack_dev:fasttrack_dev_local@127.0.0.1:5433/fasttrack_dev"
node_modules\.bin\prisma.cmd migrate deploy --config prisma.config.ts
```

Result:
```
Prisma schema loaded from server\prisma\schema.prisma.
Datasource "db": PostgreSQL database "fasttrack_dev", schema "public" at "127.0.0.1:5433"

2 migrations found in prisma/migrations

Applying migration `20261106094101_add_version_check_constraint`

All migrations have been successfully applied.
```

Status: **PASSED** — both migrations applied to `fasttrack_dev`

---

## Seed idempotency verification

Command run:
```powershell
# From Project_code/server/
$env:DATABASE_URL="postgresql://fasttrack_dev:fasttrack_dev_local@127.0.0.1:5433/fasttrack_dev"
$env:DEMO_SEED_PASSWORD="DemoSeed2026!"
node --import tsx prisma/seed.ts
```

**Run 1 output:**
```
Seeding demo users and teams (idempotent)…
Seed complete. Teams: Team A (supervisor supervisor.a@fasttrack.local), Team B (supervisor supervisor.b@fasttrack.local).
Students: student.a1@fasttrack.local, student.a2@fasttrack.local in Team A; student.b1@fasttrack.local in Team B.
```

**Run 2 output (idempotency check):**
```
Seeding demo users and teams (idempotent)…
Seed complete. Teams: Team A (supervisor supervisor.a@fasttrack.local), Team B (supervisor supervisor.b@fasttrack.local).
Students: student.a1@fasttrack.local, student.a2@fasttrack.local in Team A; student.b1@fasttrack.local in Team B.
```

Status: **PASSED** — identical output on second run; no duplicates, no errors

---

## Existing test suite

Command:
```powershell
cd Project_code
npm test
```

Output:
```
 ✓ server/src/db/test-database.test.ts (16 tests) 17ms
 ✓ server/src/config.test.ts (25 tests) 21ms
 ✓ server/src/app.test.ts (10 tests) 219ms

 Test Files  3 passed (3)
      Tests  51 passed (51)
   Start at  16:48:08
   Duration  1.01s
```

Status: **PASSED** — 51/51 tests pass; no regressions from B00 changes

---

## TypeScript typecheck

Command:
```powershell
cd Project_code
npm run typecheck
```

Output: (no errors)

Status: **PASSED**

---

## Schema constraints summary

| Table | Key constraints |
|---|---|
| `users` | `UNIQUE(email)`, `UNIQUE(student_id)` |
| `sessions` | `UNIQUE(token_hash)`, INDEX(user_id), INDEX(expires_at) |
| `teams` | `UNIQUE(supervisor_id)` — one supervisor per team |
| `team_members` | `UNIQUE(student_id)` — one team per student |
| `milestones` | INDEX(team_id) |
| `submissions` | `UNIQUE(milestone_id, version)`, INDEX(milestone_id), `CHECK(version >= 1)` |
| `feedback` | `UNIQUE(supervisor_id, client_request_id)`, INDEX(submission_id) |

---

## Integration tests (NOT RUN)

The following tests require a running application with authentication (G1):

| Test | Status | Reason |
|---|---|---|
| T-06 Supervisor creates milestone | NOT RUN | Requires F-01 auth (G1) |
| T-07 Student attempts milestone creation | NOT RUN | Requires F-01 auth (G1) |
| T-08 Unassigned supervisor denied | NOT RUN | Requires F-01 auth (G1) |
| T-17 Feedback association | NOT RUN | Requires G2 |
| T-18 Access restriction | NOT RUN | Requires G2 |
| T-19 Retry safety | NOT RUN | Requires G2 |
| T-20 Cross-team denial | NOT RUN | Requires G2 |

These will be run after G1 acceptance when A reproduces migration/seed on clean setup.

---

## Acceptance

**Verification:** NOT RUN (integration tests pending G1)
**Acceptance:** PENDING — awaiting A's review and G1 joint check

A must reproduce on a clean setup:
1. `npm ci` from `Project_code/`
2. `npm run db:generate` (from `Project_code/`) — generates Prisma client
3. Apply migrations: `$env:DATABASE_URL=<url>; node_modules\.bin\prisma.cmd migrate deploy --config prisma.config.ts`
4. Run seed: `$env:DATABASE_URL=<url>; $env:DEMO_SEED_PASSWORD=<pw>; node --import tsx server/prisma/seed.ts`
5. Confirm no errors, record result in Issue #4 comment
