# G1 foundation reproduction by A

Date: 6 November 2026 (Asia/Bangkok). Owner: A / zerotwobook. Audit [Issue #49](https://github.com/zerotwobook/fastTrack/issues/49), [Draft PR #50](https://github.com/zerotwobook/fastTrack/pull/50), branch `test/s1-a-g1-foundation`.

**Gate outcome: NOT ACCEPTED.** Ordinary unit tests pass, but the independent real-database foundation audit still has eight reproduced failures. No auth/domain acceptance or G1 approval is claimed. The draft remains Started / Verification FAILED / Acceptance PENDING; it is not ready to merge.

## Source and existing human review

- B00 source: PR #48 head `8112468883dfd7bf51063b8d075f3e3657960ddf`, integrated into Sprint 1 as `5f2ac0b53c03742ed0c95a0f080ec75ae4e17455`.
- A (zerotwobook) approved that actual B00 head and merged it; the review explicitly left remaining integration reproduction for G1. That approval does not mean this gate passed.
- B reproduced/approved A00 in PR #45, satisfying the scaffold-review half of the foundation check.
- Audit code tested from a separate clean clone at `3d9bd2f21afecc44a9a3e1683dc136a1e2e32e11`. Later changes in this audit update documentation/evidence only.
- Accepted requirements: project detail sections 5, 7.3, 7.5, 8.5 and 9; D1 C.2/E; Sprint 1 B00/G1. The checks test those existing contracts; no weaker replacement contract is introduced.

## Reproduce

From Project_code on the audit branch:

```powershell
npm ci
npm run test:g1:isolated
```

Requirements: verified Node 26.13.0/npm 11.20.0 and working Linux Docker Engine. The runner uses the pinned PostgreSQL 16.8 image digest recorded in [the JSON result](R1-G1-A-results.json). It creates only a newly named audit container, binds PostgreSQL to a random loopback port, uses a temporary data mount and creates distinct dev/test databases. Random credentials are process/temp-file-only and redacted from output.

It generates the Prisma client, applies fresh migrations to both new databases, repeats migration deploy, runs typecheck/unit tests, performs a production-mode build and runs the dedicated G1 cases. It removes only its newly created container and temporary credential file in finally. No existing local database/container/volume is reset or removed. The final clean-clone run ended with a clean Git tree; container cleanup succeeded.

The first runner attempt detected PostgreSQL's temporary initialization socket before the final server was ready. The runner now waits for TCP readiness; that setup failure is not domain TDD or passing evidence.

## Actual results

| Check | Result |
|---|---|
| Clean-clone npm ci | PASS, 316 packages; no copied .env or generated client |
| Prisma generation | PASS, CLI/client 7.10.1 |
| Fresh dev and test migrations | PASS, both ordered migrations applied |
| Repeat migration deploy | PASS, no pending migrations |
| Typecheck | PASS, both workspaces |
| Ordinary unit/API tests | PASS, 3 files / 51 tests |
| Production-mode client/API build | PASS after A's runtime packaging correction |
| G1 real-DB checks before packaging correction | 3 passed / 9 failed |
| Final G1 real-DB checks from clean clone | **4 passed / 8 failed**, command exits 1 |
| Compiled DB client after A correction | PASS, compiled module imports and executes SELECT 1 against the isolated PostgreSQL instance |
| Container/credential cleanup | PASS; no audit container remained |

The four passing G1 cases cover version >= 1, one-team-per-student/FK history restriction, repeat seed without duplicate/password/membership changes, and the compiled generated-client DB read. Existing synthetic seed password hashes remain unchanged when a different seed password is supplied. Domain endpoint tests, auth/session behavior, browser journeys and shared UI acceptance remain NOT RUN here.

## Corrected A-owned packaging defect

The original tsc-only build emitted `server/dist/db/client.js` but omitted the generated JavaScript/runtime files it imports, producing ERR_MODULE_NOT_FOUND. Server build now generates the client, compiles TypeScript and copies the generated runtime tree to `server/dist/db/generated/client`. The real compiled-module DB check changed from FAIL to PASS. A standalone build without a real DATABASE_URL also passed; generation/build do not connect to PostgreSQL.

These source changes do not modify B's schema, seed, fixtures, DB client or shared UI implementation. They remain unmerged in the audit draft while the combined gate is red.

## Eight remaining B-owned failures

| ID | Reproduced observation | Required contract |
|---|---|---|
| G1-01 | Creating a second team for the same supervisor fails teams_supervisor_id_key | Supervisor has a one-to-many team relation; no unique supervisor restriction |
| G1-02 | sessions.revoked_at and milestones.cancelled_at are absent | Both nullable fields exist before dependent auth/domain work |
| G1-03 | Six inspected domain ID columns use text | Native UUID PK/FK types from the accepted model |
| G1-04 | A submission with a nonexistent author is inserted | submitted_by references users with FK/history restriction |
| G1-05 | A 121-code-point milestone title is stored | Migration-level accepted text bounds |
| G1-06 | Fixture offsets contain -1, 0 and +3600000ms, with no +1ms | Exact one-millisecond-before/equal/after cases; an ordinary future fixture may also remain |
| G1-07 | createTestPrisma accepts the protected runtime URL after the module was imported | Recheck the guard at every DB client/fixture entry; no unsafe query was executed in the test |
| G1-08 | Repeat seed resets an edited team name to Team A | Add-only seed preserves existing names/passwords/membership/history |

## Handoff and next work

B's corrective task is [Issue #51](https://github.com/zerotwobook/fastTrack/issues/51), initially Backlog / NOT RUN / PENDING. Use a new B fix branch from current staging and a forward migration; do not rewrite the two already-applied migrations or discard data. The issue contains expected/actual behavior and coordination steps for testing B fixes with the unmerged A audit harness in an isolated verification branch.

A's Draft PR #50 stays Started / FAILED / PENDING, with the dependency documented. After B's fixes are reviewed, A reproduces the combined source and reruns the audit. Both members must record actual G1 acceptance before A01/B01. No failing audit is merged into protected staging/main, and no F-01 production code is implemented while this gate fails.
