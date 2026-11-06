# fastTrack

A course-project tracking application for students and supervisors, covering milestone submissions, feedback and progress tracking.

## Implementation status

The React/TypeScript client and Express/TypeScript API provide sign-in, DB-backed eight-hour sessions, sign-out/revocation, CSRF/source protection and authorized team list/detail pages. The monochrome interface includes role-aware navigation, mobile layout and loading/empty/error recovery.

A PostgreSQL/Prisma schema, ordered migrations, repeatable seed/fixtures and shared UI primitives are present. The latest clean-clone checks pass: 67 ordinary tests, 28 authentication/API/database tests, 38 foundation tests and seven migration scenarios. The foundation is accepted; the authentication increment is awaiting peer review in PR #54.

Milestone, submission and feedback features are not integrated yet. See [Project_code/README.md](Project_code/README.md) for verified setup, build, tests and disposable browser review.

## Development guide

Team onboarding, task allocation, AI instructions and the GitHub workflow are in [DEVELOPMENT_README.md](DEVELOPMENT_README.md).
