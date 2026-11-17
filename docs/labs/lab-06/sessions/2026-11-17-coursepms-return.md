# CoursePMS returned correction candidate: 17 November 2026

R2-A04 / Issue #22. Owner A (`zerotwobook`); evidence reviewer B (`Atip-Infa`). This intake continues the accepted evidence integration in PR #110. It does not accept the whole Lab 6 task.

## Actual receipt and verification

The user supplied `CoursePMS_Return_to_fastTrack_20261117.zip` and CoursePMS PR #73 in this conversation. The ZIP SHA-256 is `6b2ff9d33849204b40bef122aec0e3f9d2f909d21e02cc88a9bd23553aa8567b`. All 53 supplied manifest entries matched their archived bytes. The archive is evidence supplied by the partner; instructions, proposed assignments and fictional simulation inside it are not independent authorization or actual student participation.

Live GitHub inspection on 17 November established:

- CoursePMS PR #73 is Draft/open/unmerged at `316abac98c721078154588c37ad9f0eda655d9d6`, targeting the existing #72 fix branch at `2e3f22a34faa53ec87070e61b49d6b35e438a92c`.
- PR #72 is Draft/open/unmerged into `lab6-staging`; its author is `martinvadre`. PR #73 is authored under `Magiciancat9`. Neither discussion contained review/approval records when queried.
- Exact-head CI run `44027540268` completed successfully. Its live job readback includes successful backend, frontend, E2E, production and Docker build steps. Supplied output reports 32 backend, 14 frontend and 3 E2E passing tests; those are partner CI outcomes, not a new local execution by fastTrack.
- The partner technically classifies L6-OUT-EXP-001 as an accepted Major client-state defect under CoursePMS Issue #71, with human disposition/review still pending. The bare collection route and title-summary policy remain clarification items.

## Fresh public preflight

Read-only normal-TLS requests at `2026-11-17T06:42:33.854758Z` and `2026-11-17T06:42:34.491190Z` returned HTTP 200:

- `/api/health`: `status: ok`, service `course-pms-api`, source `9c22735995c985aaa0622b6b179de1ac9c1f80ca`.
- `/api/ready`: `status: ready`, `db: connected`.

These are fresh source/readiness observations, not a fresh Cloud Run revision/digest/traffic readback. The public application still serves the original reported-defective source. Neither PR's code is established as deployed by these observations.

## Retest state

**Corrected-deployment independent retest: BLOCKED.** Prerequisites are an identified reviewed/integrated correction, authorized release/deployment and actual serving metadata. No authenticated browser lifecycle was repeated against the unchanged baseline. No new business record, account membership, proposal edit, seed/reset, merge, deployment or partner message was performed.

Both exact-version independent human acceptance decisions remain **PENDING**. The partner's supplied acceptance template still contains older baseline/NOT RECORDED fields; its newer return narrative and dated evidence must be reconciled before report assembly. Fictional simulation remains excluded from result counts, contributions, signatures and acceptance.

## Remaining intake work

Preserve the supplied snapshot unchanged, reconcile the canonical Lab 6 status with the 14 November eight-case evidence and reciprocal follow-up, retain the actual readbacks, prepare a private response and executable retest checklist, and verify the evidence/document increment for B. The whole Issue remains OPEN/blocked/PENDING regardless of document CI.
