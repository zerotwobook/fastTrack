# fastTrack

A course-project tracking application for students and supervisors, covering milestone submissions, feedback and progress tracking.

## Implementation status

The React/TypeScript client and Express/TypeScript API scaffold include a minimal application page, a liveness endpoint, validated environment configuration, safe JSON errors and a local same-origin API proxy.

A PostgreSQL/Prisma schema, ordered migrations, repeatable seed/fixtures and shared UI primitives are present. The latest isolated foundation checks pass: 51 unit tests, 38 database/regression tests and seven migration scenarios. Peer review and foundation acceptance are pending.

Sign-in, team workspaces, milestone endpoints, submissions and feedback features are not implemented. See [Project_code/README.md](Project_code/README.md) for verified setup/build/test commands and the current foundation-check results.

## Development guide

Team onboarding, task allocation, AI instructions and the GitHub workflow are in [DEVELOPMENT_README.md](DEVELOPMENT_README.md).
