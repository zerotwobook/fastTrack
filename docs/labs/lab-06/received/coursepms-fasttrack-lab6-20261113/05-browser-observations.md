# Actual browser observations

Operator: Codex AI, requested by the user acting as CoursePMS. These are narrow actual UI observations, not student signatures or completion of all numbered actions in every supplied case. Native Chrome/Windows was used; exact browser version was not recorded. Screenshots are original captured files without edits. File timestamps and accessibility snapshots retain observation context; source identity is correlated with the live API checks before, after, and in the state-control supplement.

| Evidence | Case | Actual action | Observed outcome | Screenshot |
| --- | --- | --- | --- | --- |
| UI-01-supervisor-saved-work | UAT-02 / UAT-08 | Supervisor A opens API-created version-1 work | Saved ID/title/description/link/author/time/version match API ledger; feedback rail visible | [PNG](evidence/UI-01-supervisor-saved-work.png) |
| UI-02-supervisor-feedback | UAT-02 | Scroll to exact-version feedback | Both saved messages are visible once in order | [PNG](evidence/UI-02-supervisor-feedback.png) |
| UI-03-blank-feedback-rejected | UAT-06 | Submit whitespace-only feedback as SA | Field error: Feedback content cannot be empty; both original messages remain | [PNG](evidence/UI-03-blank-feedback-rejected.png) |
| UI-04-signed-out-private-page | UAT-07 | Sign out SA while viewing private work | Sign-in form replaces private work; no work or feedback is visible | [PNG](evidence/UI-04-signed-out-private-page.png) |
| UI-05-student-saved-work | UAT-02 / UAT-08 | Sign in as A1 and read same saved URL | Same persisted version/author/time/content; API evidence separately confirms feedback equality | [PNG](evidence/UI-05-student-saved-work.png) |
| UI-06-duplicate-work-prevented | UAT-03 | A1 opens direct first-submission form for NORMAL | Existing shared work notice and saved link; submit disabled; API duplicate rejection separately recorded | [PNG](evidence/UI-06-duplicate-work-prevented.png) |
| UI-07-student-create-denied | UAT-06 | A1 opens supervisor milestone-create URL | Only the assigned supervisor can create milestones; no creation form | [PNG](evidence/UI-07-student-create-denied.png) |
| UI-08-deadline-passed | UAT-04 | A1 opens DEADLINE first-submission form after recorded real deadline | The deadline has passed. Work cannot be submitted; submit disabled | [PNG](evidence/UI-08-deadline-passed.png) |
| UI-09-empty-title-rejected | UAT-06 | A1 submits whitespace-only title with valid description/link | Check the highlighted fields; Enter between 1 and 120 characters | [PNG](evidence/UI-09-empty-title-rejected.png) |
| UI-10-ftp-link-rejected | UAT-06 | A1 submits valid title/description and ftp://example.com/work | Use a complete http:// or https:// link without embedded credentials | [PNG](evidence/UI-10-ftp-link-rejected.png) |
| UI-11-foreign-work-hidden | UAT-05 / UAT-07 | After A1 logout, SB opens exact saved Team A submission URL | Supervisor B identity; Submission unavailable; generic requested resource not found; no protected work/feedback | [PNG](evidence/UI-11-foreign-work-hidden.png) |

The [browser ledger](evidence/browser-session.json) records precise limits and the observed signed-out final state. The [post-UI state-control ledger](evidence/post-ui-state-controls.json) adds seven actual passing assertions: serving source, successful supervisor control login, no work after the browser invalid-title/FTP attempts, unchanged saved normal work, unchanged original feedback after the blank-feedback attempt, no late work, and successful control-session logout. These are separate from the primary 97-assertion/74-request denominator.

No screenshot of a filled credential form or save-password prompt is exported. Captures include application and ordinary browser chrome; share the package through the team's agreed evidence channel. No password was saved. Existing historical Lab 5 data was preserved.
