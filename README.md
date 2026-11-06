# fastTrack

A course-project tracking application for students and supervisors, covering milestone submissions, feedback and progress tracking.

## Implementation status

The React/TypeScript client and Express/TypeScript API provide sign-in, DB-backed eight-hour sessions, sign-out/revocation, CSRF/source protection and authorized team list/detail, milestone create/list/detail and first-submission form/saved-detail pages. The monochrome interface includes role-aware navigation, mobile layout and loading/empty/error recovery.

A PostgreSQL/Prisma schema, ordered migrations, repeatable seed/fixtures and shared UI primitives are present. The latest clean-clone checks pass: 111 ordinary tests, 48 first-submission API/DB/service cases, 33 milestone DB cases, 28 authentication/API/database tests, 38 foundation tests and seven migration scenarios. The foundation and authentication increment are accepted; the milestone correction was accepted through B review/merge of PR #56. First submissions are verified and awaiting peer acceptance in PR #57.

Submission and feedback features are not integrated yet. See [Project_code/README.md](Project_code/README.md) for verified setup, build, tests and disposable browser review.

## Development guide

Team onboarding, task allocation, AI instructions and the GitHub workflow are in [DEVELOPMENT_README.md](DEVELOPMENT_README.md).
