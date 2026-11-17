# CoursePMS corrected-deployment independent retest plan

R2-A04 / finding L6-OUT-EXP-001 / CoursePMS Issue #71. Plan prepared 17 November 2026. This is not an execution ledger. **Current state: BLOCKED** because the fresh public source remains the original defective 9c227359 and no fixed serving metadata is supplied.

## Entry gate

Record the actual reviewed/integrated correction and release references, exact source, URL, digest, traffic-serving revision(s)/percentage(s), dated owner metadata and matching health/readiness. Recheck for a changed candidate; original PR #73 head 316abac is not automatically the main release or deployed source. Agree actual tester/witness roles, appointment, private credentials and eligible account aliases. No passwords or raw authentication responses enter evidence.

Keep team 5 / proposal 3 at APPROVED revision 2 unchanged. S1-S3 were assigned, S4 unassigned and R1-R4 unused in the old run; none of that establishes current eligibility. Use local/synthetic fixtures for destructive/racy automated cases. Do not create teams, add members, save/edit/submit/review historical proposals, change traffic or reset/seed/delete data for this targeted independent browser retest.

## Cases to execute after entry passes

| ID | Procedure | Expected / evidence |
| --- | --- | --- |
| RT-01 original no-refresh switch | Load A's existing four-field draft; record fields privately. Logout, then login as eligible B with no saved proposal in the same tab without reload. | B identity/team correct; all four editor fields empty before use; no A private banner/review/form data. Capture sanitized before/after. Never save leaked values. |
| RT-02 reverse and own-proposal | Switch back without reload; use an agreed destination with its own saved draft. | Only authorized current-user fields load; source values preserved; no cross-account data. |
| RT-03 no-team/instructor destinations | Switch to agreed eligible no-team and instructor identities without reload. | Appropriate empty/role workspace; no prior draft/editor/private review/banner content. Mark BLOCKED for unavailable fixtures. |
| RT-04 reload/relogin persistence | Reload and relogin to the saved-draft owner without editing historical data. | Canonical own saved fields persist; no false claim about unsaved input persistence. |
| RT-05 logout replay | Using the agreed isolated authenticated procedure, logout and replay only that temporary session against /api/auth/me. | Logout/rejection and actual status/code recorded without credentials/tokens; no reusable session retained. |
| RT-06 foreign/role denials | Foreign private proposal GET and student review denial with separately agreed synthetic target/procedure. | Expected rejection, no protected content/change. A write-denial check requires an explicit safe target/precondition; otherwise record BLOCKED, not PASS. |
| RT-07 delayed responses and same-session edits | Review partner's exact-head automated evidence for late login/dashboard/mutation callbacks and unsaved roster refresh. If independently replayed locally, use isolated synthetic fixtures only. | Record evidence review separately from a deployed UI test. CI does not prove independent deployed execution. |

Record each case's actual executor/team/date/time/source/revision/preconditions/actions/expected/actual/status/evidence and deviations. BLOCKED/NOT RUN are not passing cases. Preserve original failure, candidate tests and later retest as distinct records. AI execution is supporting evidence and cannot sign the students' participation/acceptance.

## Exit and decision

Reconcile all findings and affected results. Critical/Major must be fixed and independently retested; minor limitations must be fixed or explicitly accepted by the independent UAT team. Only actual fastTrack human decision-makers record the exact-version CoursePMS decision: Accepted, Accepted with documented minor limitations, or Not Accepted, with rationale and conditions. Keep PENDING before that decision. CoursePMS separately decides about fastTrack; no decision transfers between products.
