# fastTrack

A course-project tracking application for students and supervisors, covering milestones, submitted work and version-specific feedback.

## Application

Students sign in, view their team's milestones, submit one immutable version of work before the deadline, and read the saved work and supervisor feedback. Assigned supervisors create milestones, read submissions and append feedback to the exact submission version. Other teams' records remain outside the caller's scope.

The React/TypeScript client and Express/TypeScript API use PostgreSQL/Prisma, DB-backed eight-hour sessions and source/CSRF protection. The monochrome interface includes role-aware navigation, mobile layouts, validation and recovery for uncertain feedback saves. Submission and feedback records persist across application restarts.

See [the technical guide](Project_code/README.md) for verified installation, configuration, build, tests and local browser review. Revisions, progress calculations and summary screens belong to later increments.

## Development guide

Team onboarding, task allocation, AI instructions and the GitHub workflow are in [DEVELOPMENT_README.md](DEVELOPMENT_README.md).
