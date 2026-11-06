# G1 foundation verification and remediation

## Current result: technical checks pass; peer acceptance pending

Date: 6 November 2026 (Asia/Bangkok). Owner A / zerotwobook. [Issue #49](https://github.com/zerotwobook/fastTrack/issues/49) tracks the audit, [Issue #51](https://github.com/zerotwobook/fastTrack/issues/51) tracks the correction, and [PR #50](https://github.com/zerotwobook/fastTrack/pull/50) contains the combined source for B / Atip-Infa to review. The integration target remains `staging/sprint-1`.

**Verification: PASSED. Acceptance: PENDING.** A has corrected the remaining review findings under the user's explicit ownership transfer. The final run used a separate clean clone at executable commit `6f3601ec1af3f0b7039bce175251642d1920c40c`; subsequent handoff changes update documentation/evidence only. No self-approval, accepted G1 decision, merge into staging/main or domain-feature acceptance is claimed.

### Changes under review

- B's PR #53 candidate at `633a9fe348edb2976aa96a53d3d520f87e481813` fixed the original eight failures. Its commits are preserved through merge `f415dd7` into A's existing task branch; B's branch was not rewritten.
- A's [changes-requested review](https://github.com/zerotwobook/fastTrack/pull/53#pullrequestreview-5800790251) found three remaining blocking groups. PR #50 now fixes all three: canonical text constraints; fixture cleanup tied to the actual factory-created test client; and atomic, data-preserving migrations with explicit preflight failures.
- Canonical required fields use code-point bounds: team name and milestone/submission titles 1-120; milestone/submission descriptions and feedback 1-4000; submission URL 1-2048. Empty and Unicode-whitespace-only values are rejected. Identity/hash fields retain the accepted unrestricted TEXT types.
- The two accepted B00 migrations remain unchanged. The unaccepted third proposal is corrected before integration, and a fourth forward migration also aligns a database that applied the old proposal. Read [the adoption decision](../decisions/0002-g1-migration-adoption.md) before using an existing candidate database; the tests do not establish conflict-free `migrate dev` history adoption.
- `createTestPrisma()` privately binds the concrete client to a validated target. Setup/cleanup rechecks that binding and current environment before queries; arbitrary clients and changed targets are rejected. Cleanup is transactional. All fixture milestones have valid required descriptions.
- The isolated runner adds 26 safety cases to the original 12, plus seven historical-schema upgrade scenarios. This is foundation regression evidence, not the future F-03 deadline TDD or domain AC evidence.

### Verified reproduction

From `Project_code/`, with Linux Docker Engine available:

```powershell
npm ci
npm run test:g1:isolated
```

The final clean clone was `fasttrack-g1-remediation-verify-6f3601e` under the OS temporary directory. Node/npm were 26.13.0/11.20.0 on Windows x64. The run started at 2026-11-06T14:32:36.426Z and finished at 14:33:15.108Z. The JSON records the pinned PostgreSQL 16.8 image digest. Only newly created loopback-bound Docker databases were used; no persistent developer database was changed.

| Check | Actual final result |
|---|---|
| Clean-clone `npm ci` | PASS, 316 packages; no copied environment/generated client |
| Prisma generation and fresh dev/test migration deploy | PASS, four ordered migrations |
| Repeat migration deploy | PASS, no pending migrations |
| Typecheck | PASS, both workspaces |
| Ordinary unit/API tests | PASS, 3 files / 51 tests |
| Production build and compiled Prisma DB import/query | PASS |
| Dedicated G1 tests | **38 passed / 0 failed**, no failed suites |
| Historical-schema upgrade scenarios | **7 passed / 0 failed** |
| Overall isolated runner | Exit 0, `passed: true` |
| Cleanup and clean clone Git status | PASS; new audit container removed; no tracked/untracked changes |

Structured evidence: [final clean-clone result](R1-G1-A-remediation-results.json) and [valid regression RED result](R1-G1-A-regression-red.json). Before the corrections, commit `372612a` produced 24 passed / 14 failed G1 cases and 2/7 passing upgrade scenarios. Initial test-harness API/catalog compatibility errors were corrected before that RED run and are not counted as business failures. Commit `13e0d50` first passed 38/38 and 7/7; `6f3601e` then preserved atomic rejection while exposing the original PostgreSQL error rather than a masked aborted-transaction error. The final clean-clone run verifies that source.

| Upgrade scenario | Expected/observed outcome | Data, schema and history evidence |
|---|---|---|
| `control` | Upgrade succeeds | Records and completed migration checksums preserved; matches fresh schema; FK 9 -> 10 |
| `canonical_boundary` | Exact accepted maxima succeed, including a 130-character legacy user name | Records and completed checksums preserved; matches fresh schema; FK 9 -> 10 |
| `invalid_uuid` | Reject, SQLSTATE 22P02 | Records and full schema preserved; completed checksums preserved; FK 9 -> 9 |
| `invalid_required` | Reject Unicode-whitespace-only required text, SQLSTATE 23514 | Same preservation checks; FK 9 -> 9 |
| `invalid_overlength` | Reject overlength required text, SQLSTATE 23514 | Same preservation checks; FK 9 -> 9 |
| `invalid_author` | Reject orphan submission author, SQLSTATE 23503 | Same preservation checks; FK 9 -> 9 |
| `candidate_applied` | Forward-align original PR #53 schema | Records and its recorded applied checksums preserved; matches fresh schema; FK 10 -> 10 |

Negative scenarios intentionally get migration exit 1; the wrapper counts them as passing only when the exact rejection cause and preservation assertions pass. A failed Prisma attempt adds a failed ledger entry; the claim is that previously completed entries/checksums are preserved, not that the entire migration ledger is identical. Snapshots compare all seven domain tables, and schema fingerprints compare columns, constraints and indexes.

### Peer handoff

At the verified handoff, #49/#50 move Started -> PR Review and #51 moves Fixing -> PR Review. Verification becomes PASSED; Acceptance remains PENDING. B must review the current PR #50 head, rerun the commands above, inspect the three corrected groups and the migration adoption limitation, then record the actual acceptance decision and accepted integration. Keep #49/#51 open until that happens. A01/B01 remain blocked by the joint G1 gate. PR #53 is superseded by this combined candidate; its old head does not contain A's corrections.

## Historical initial audit: before B and A corrections

The remainder of this file preserves the original B00 audit as historical evidence. Its failure counts, ownership and draft state describe that earlier source only; use the current result above for the review handoff.

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
