# Findings and next actions

## This session: CoursePMS testing fastTrack

Consult the current assertion ledger and execution report for the completed-run totals. No product defect is inferred merely from a rejected operation: duplicate, deadline, forbidden-role, foreign-resource and invalid-input requests are intended negative tests. The stopped first attempt was a runner timestamp error, preserved separately. Browser automation did not complete the native date picker; this is an execution limitation, not an observed application defect.

The absence of a confirmed defect in these bounded checks does not establish complete UAT or justify a fabricated defect. If complete independent UAT finds no legitimate defect, the instructor handout requires a separate TA-approved controlled exercise on an isolated version of the Product Team's own application. No such exercise was requested, approved or run here.

## Existing fastTrack observations about CoursePMS

These are imported from exact PR #110 head baae1398cefc6120bc7249776f9b2e631ca58c70, against CoursePMS source 150dc5db3de5c829a7d9ef1adb545191cc37542d. This is repository retrieval, not evidence of an external delivery/acknowledgement. The original author explicitly labels the observations AI-operated and full reciprocal UAT incomplete. No new reproduction against CoursePMS was performed in this export session.

| ID | Reported observation | Current disposition and action |
| --- | --- | --- |
| L6-OUT-EXP-001 | After Pawarit logout followed by Suda login in the same tab, Team Alpha's private draft fields remain visible in Suda's NO_DRAFT editor until reload. | Proposed Major; UNTRIAGED. CoursePMS should personally reproduce the exact steps, confirm source/version and classify against its contract. A/B participation, substantive peer review and actual independent retest remain unrecorded. Reload is a workaround, not a fix. |
| L6-OUT-EXP-002 | Anonymous GET /api/proposals returned HTTP 200 HTML fallback, while the literal auth contract suggests 401 for that path. Actual implemented protected resource paths reject access. | NEEDS CLARIFICATION; proposed Minor contract/routing discrepancy. Clarify whether bare GET collection is an agreed endpoint. No private body disclosure was observed in this check. |
| Directory title-summary policy | Two assertions treated another team's title summary as private content. No foreign problem/stack/repository/feedback was observed by those requests. | Two policy questions; not confirmed security defects. Clarify the agreed summary visibility before triage. |

The original CoursePMS HTTP ledger contains 37 assertions: 25 mechanical PASS and 12 mechanical FAIL. The retained source-informed assessment is 34 PASS, two policy clarifications and one contract discrepancy. Nine mechanical failures expected only UNAUTHORIZED although the correct rejection was HTTP 401 TOKEN_REVOKED. Do not count these as nine additional product defects. The original browser checks total 11 narrow observations: 10 PASS and one FAIL, with stated limits.

For every accepted defect, the owning Product Team must retain Issue/case/requirement, original version and reproducible evidence, meaningful failing regression test (RED), same test after correction (GREEN), broader regression, actual non-author review, CI, reviewed release/deployment source/revision, independent retest and final disposition. A Critical/Major unresolved defect blocks acceptance. Minor limitations require explicit acceptance by the independent UAT Team.

Source: [Original reciprocal report](from-fasttrack/reciprocal-testing/2026-11-13-coursepms-live.md), [raw HTTP evidence](from-fasttrack/reciprocal-testing/2026-11-13-coursepms-api.json), [reviewed assessment](from-fasttrack/reciprocal-testing/2026-11-13-coursepms-api-assessment.json), and [PR #110](https://github.com/zerotwobook/fastTrack/pull/110). The PR was OPEN, ready for B review and not merged when checked during this session.
