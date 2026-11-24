# fastTrack

A full-stack course-project management application for students and supervisors covering team planning, milestone deadlines, versioned submissions, exact-version feedback, progress tracking, and supervisor summary reporting.

## Application

fastTrack serves two authenticated roles (**Student** and **Supervisor**) over one origin with database-backed eight-hour sessions (`HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS origins), `Origin`/`Referer` and CSRF protection, PostgreSQL-backed login rate limiting (`429`), and strict team-scope isolation:

- **Team planning & milestones:** Supervisors create teams, rename teams they own, and add unassigned students or remove current members while the team has no submission history. They create milestones with `Asia/Bangkok` deadlines and can edit or cancel eligible unsubmitted milestones. A submission locks membership changes for the team and edit or cancellation for that milestone.
- **Submissions, revisions & exact-version feedback:** Students view prioritized milestones and submit versioned work links (`v1`, `v2`, ...) at or before the post-lock database deadline (`409 DEADLINE_PASSED` after expiry). Supervisors append private feedback (up to `6,000` trimmed Unicode code points) bound strictly to the reviewed submission version so earlier feedback stays on `v1` when `v2` is submitted, with client-side recovery checks after uncertain writes.
- **Team progress & supervisor summary:** Authorized students and supervisors inspect per-team progress derived from a repeatable-read PostgreSQL snapshot (counting completed active non-cancelled milestones and latest-version feedback status). Supervisors additionally open `/summary` across assigned teams with team/status filters, weighted totals, deterministic paging, out-of-range page recovery (`Page N (M pages total)` / `Go to page 1`), and state-preserving `returnTo` milestone navigation.
- **Runtime & UI foundation:** Built with a React/TypeScript/Vite client and Express/TypeScript API backed by PostgreSQL/Prisma, locally bundled `Inter` and `Noto Sans Thai` fonts, monochrome accessible states (`320–1440px` and `200%` zoom), persistent storage across restarts, `GET /api/health` process liveness, and bounded DB-backed `GET /api/ready` checks.

See [the technical guide](Project_code/README.md) for verified toolchain requirements, installation, configuration, run/build commands, and isolated PostgreSQL test suites, and [the deployment guide](docs/labs/lab-05/deployment.md) for container, Compose, CI/CD, and Cloud Run operations.

## Development guide

Team onboarding, task allocation, AI instructions, and GitHub workflow rules are in [DEVELOPMENT_README.md](DEVELOPMENT_README.md).
