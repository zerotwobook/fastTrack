# R1-A02 first-submission contract and verification plan

Owner A / zerotwobook; reviewer B / Atip-Infa. Issue #7, branch `feature/s1-a-submissions`, based on accepted staging `78d0cca`. [G2 is accepted](../evidence/R1-G2-acceptance.md) under the user's recorded delegation. This document defines the current implementation task; it does not claim F-03 is implemented or verified yet.

Sources: project detail 4/5/7.4/8.6 D-F/9.2/9.4/9.5; D1 E.3; AC-03.1-03.6; T-09-T-16/T-25/T-26/T-31 local. Keep existing schema/migrations/seed/fixtures/shared design primitives and dependency lockfile unchanged. B owns feedback; no feedback endpoint is implemented by this task.

## API, scope and persistence

- POST `/api/milestones/:id/submissions`: mandatory real session -> student role -> source/CSRF -> JSON -> strict input -> scoped record -> domain rule -> write; 201 `{data:Submission}`. No authority or test-clock request fields/headers are accepted.
- GET `/api/milestones/:id/submissions`: scoped list, descending version; S1 creates at most one record. GET `/api/submissions/:id`: scoped detail. Domain reads return `{data,meta:{serverTime}}`; missing and foreign records share the same generic 404. All private responses are no-store.
- Submission DTO: `{id,milestoneId,submittedBy:{id,displayName},version,title,description,url,submittedAt}`. The server determines author, version 1 and accepted time. No raw ORM/user/session fields escape.
- Shared pure browser/API validation trims strings and counts Unicode code points: title 1-120, description 1-4,000, URL 1-2,048. Allow only title/description/url keys with string values. Require an explicit absolute HTTP(S) URL with hostname and no credentials; never fetch it on the server. Preserve the validated trimmed URL rather than silently replacing work content.
- Export `scopedSubmissionWhere(auth)` and `requireSubmissionAccess(db,auth,id)` for B. The latter returns authorized `{id,milestoneId,teamId}` and receives the explicit operation/transaction client. B must still enforce its supervisor mutation guard and recheck scope; never use a stale client-selected latest submission ID.

## Transaction and errors

1. Within one transaction/client, scope the milestone, lock its team, lock the milestone, then recheck membership/scope. Use team -> milestone ordering across future services.
2. Enforce cancelled -> existing submission -> deadline -> insert. Use `MILESTONE_CANCELLED`, `ALREADY_SUBMITTED` and `DEADLINE_PASSED` 409 errors. Foreign scope is resolved before these business details.
3. Read `date_trunc('milliseconds',clock_timestamp())` once after locks/rule checks. Accept `acceptedAt <= dueAt`, persist that exact value as submittedAt and never replace it with browser, transaction-start or commit time.
4. Insert version 1 with existing unique(milestone_id,version) protection. A known conflict for that constraint maps to ALREADY_SUBMITTED; rollback leaves the first record unchanged.
5. Retry only confirmed rolled-back deadlock/serialization failures, at most three attempts, repeating scope/locks/rules/clock. Unknown commit outcomes, timeouts and business rejections are not automatically retried; exhausted technical failures return safe 503 without SQL details.

An internal server-only test clock may be injected only in NODE_ENV=test; production composition never supplies one and the HTTP contract exposes no override. Deterministic boundary tests assert before/equal/after by 1ms and exact stored time; an additional real DB-clock lock-barrier case verifies clock placement.

## UI and B integration

Preserve the established palette (#FFFFFF canvas, #000000 ink/actions, #F7F7F7 surfaces, #E5E5E5 separators, #6B6B6B secondary text, #BDBDBD disabled) and Inter/Noto Sans Thai system; reuse Field/Input/Textarea/Button, existing feature CSS and 2px visible focus. Align with project detail 8.6 D-F, not a new dashboard theme.

- Milestone detail keeps the 280px desktop deadline rail and mobile stack. Students get Submit work only for an active, unsubmitted milestone; submitted records link to their real detail for both roles. Explain cancelled/overdue states.
- `/milestones/:id/submissions/new`: left-aligned form <=680px, team/milestone/deadline context, visible title/description/work-link labels, code-point counts and permission helper. Preserve entered values and focus errors after validation/domain/network failure.
- `/submissions/:id`: GET-backed saved detail with author, version, Bangkok submittedAt, plain-text description and a safe external work link. Do not manufacture a success from form state. B can supply a version-specific feedback-rendering slot; omit it while no implementation is composed.
- On an uncertain POST, read the milestone's submissions before offering retry. Show actual author/time; a teammate's submission is described as an existing team submission, not the caller's success. Never auto-retry POST. Stale/account-changed results use the accepted session generation checks.

## Verification and handoff

Retain real deadline RED before adding its rule, then GREEN/regression commits. Verify strict payload/Unicode/URL boundaries, spoofing, parser/guard order, no-write failures, privacy/equal 404s, cancellation/duplicate/deadline precedence, two-student concurrency, offsets/precision, exact stored clock, lock waits and bounded contention mapping. Test app recreation with the same DB, compiled server packaging and the real student submit -> saved GET/reload -> supervisor read journey. Preserve prior auth/milestone/G1/upgrade checks.

Open the early Draft PR/card Started after this first coherent commit. Keep Verification NOT RUN until actual checks; PR Review only after implementation/evidence and peer handoff are ready. B reviews the actual A-authored head before staging integration; G3 also needs B's real feedback flow.
