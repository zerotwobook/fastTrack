# Final UAT results for the Cloud preview

Pawarit Wongdaeng reported that he personally completed UAT-FINAL-01 through UAT-FINAL-08 and that all eight passed. His confirmation was recorded on 23 November 2026 at 22:14:53 Asia/Bangkok (UTC+07:00). This is the confirmation time. [Final QA checkpoint](https://github.com/zerotwobook/fastTrack/issues/36)

The Cloud Run preview served `staging/sprint-3` at `046310d288859ee42745a043369498d5d646d6c9` on revision `fasttrack-uat-046310d-candidate`. Health and readiness each returned HTTP 200 and the full SHA. Readiness reported that the database was connected. [Preview setup and source identity](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7103065175) · [Passing staging CI](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)

The supporting Playwright run used Microsoft Edge with synthetic accounts on 23 November 2026. The observations and captures below come from that run, which also passed all eight cases.

| Case | Independent tester result | Supporting Playwright observation | Evidence |
| --- | --- | --- | --- |
| UAT-FINAL-01 | PASS | The supervisor created a Team A milestone. The student saw the same title, description and Bangkok deadline after reload. | [Saved milestone](evidence/cloud-uat-046310d/01-milestone-reload.png) |
| UAT-FINAL-02 | PASS | The student reopened v1 after creating v2. v1 retained its original work link and feedback. v2 retained its own link and had zero feedback. | [Version history and feedback](evidence/cloud-uat-046310d/02-version-history.png) |
| UAT-FINAL-03 | PASS | The server rejected a stale form submitted after the deadline with HTTP 409 `DEADLINE_PASSED`. Reload showed zero saved submissions. | [Late submission rejection](evidence/cloud-uat-046310d/03-deadline-rejection.png) |
| UAT-FINAL-04 | PASS | Planning edits and membership changes persisted. Submission history locked membership changes and milestone editing and cancellation on the submitted team. | [Submitted milestone lock](evidence/cloud-uat-046310d/04-submitted-milestone-lock.png) |
| UAT-FINAL-05 | PASS | After switching accounts in the same browser, Supervisor B could open Team B's milestone. The Team A link returned HTTP 404. | [Cross-team denial](evidence/cloud-uat-046310d/05-cross-team-denial.png) |
| UAT-FINAL-06 | PASS | Weighted Summary showed 1/10 (10.0%). Returning from out-of-range page 10 restored page 1 with Pending and page size 1 intact. | [Summary recovery](evidence/cloud-uat-046310d/06-summary-recovery.png) |
| UAT-FINAL-07 | PASS | The app saved feedback of 5,999 and 6,000 trimmed code points and rejected 6,001. The student could still read both saved entries on v1. | [Feedback length rejection](evidence/cloud-uat-046310d/07-feedback-length-rejection.png) |
| UAT-FINAL-08 | PASS | The student and supervisor read the same submission IDs, versions, work links and v1 feedback before and after a new tagged Cloud Run revision started using the same image and database. Default preview traffic stayed on the original revision. | [Before capture](evidence/cloud-uat-046310d/persistence/before-a1-v1.png) · [After capture](evidence/cloud-uat-046310d/persistence/after-a1-v1.png) · [Recorded result](evidence/cloud-uat-046310d/persistence/result.json) |

The B-side Local UAT return is recorded separately. The joint G4 decision remains pending A and B review. [Local UAT return](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7127873421)
