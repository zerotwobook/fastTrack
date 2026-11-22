# Lab 7 peer review request for B

Hi Atip, please review the updated Lab 7 report for fastTrack using the Markdown and `evidence` folder I’m sharing. This is the final evidence review for R2-A05/R2-B05 ([#24](https://github.com/zerotwobook/fastTrack/issues/24), [#25](https://github.com/zerotwobook/fastTrack/issues/25)).

1. Check Part A against the team’s original approval screenshot. A confirmed TA Tik and 20 November 2026. The screenshot shows 10:48 AM and requests the 5,999/6,000/6,001 tests with emoji and whitespace.
2. Compare L7-B05 with the screenshot set, `production-results.json`, and [the accepted release record](https://github.com/zerotwobook/fastTrack/issues/26). Confirm the two HTTP 201 saves, the separate HTTP 400 result and unchanged count, the v1/v2 split, C04 persistence, and the foreign supervisor’s 404. The production execution was AI-assisted. Record any observations you independently verify as your own.
3. Check that Part D’s READY decision matches the verified scope, `v1.0.0-sprint-2` / `f3ff8d9`, and revision `fasttrack-app-00004-jr2`. Spot-check the five dated metrics and their source counts. Flag any evidence mismatch with the section and evidence ID.
4. Review [PR #132](https://github.com/zerotwobook/fastTrack/pull/132) at `024fa15ae59ef1469d1609cd85ee3f3ee6281c5b` and confirm its [required CI](https://github.com/zerotwobook/fastTrack/actions/runs/44739335829). If the head has moved, review the new diff and its own required checks. If you approve that head, record your review from your GitHub account and merge it into `staging/sprint-2` under the repository workflow. Please send A the reviewed SHA, your decision, and the merge SHA if it merges. A will assemble and submit the Lab 7 PDF through LEB2 and record the receipt afterward.

Run these read-only checks from your own checkout:

```powershell
gh auth status
gh pr view 132 --repo zerotwobook/fastTrack --json headRefOid,baseRefName,reviewDecision,statusCheckRollup
gh pr checks 132 --repo zerotwobook/fastTrack --required
```
