
# Student demonstration script

A presents the fastTrack goal, student submission, revision history and a deadline rejection. B provides the supervisor setup and feedback handoff. The script below documents the recording plan for the [verified Final deployment](production-release.md). The [Part E video record](demonstration-video.md) identifies the uploaded cut and its reviewed timestamps.

## Fixture and recording setup

- Confirm that the deployed app reports the agreed commit. Record the tag, full SHA and serving revision before capture.
- Use a synthetic student and an assigned supervisor in separate browser profiles. Arrange two run-specific milestones in the student's assigned team. One stays open long enough for the first submission, feedback and revision. The other starts unsubmitted and reaches its deadline during the recording.
- Keep the open milestone's original submission title, work link and supervisor feedback distinct from version 2 so the audience can see which record is selected. Use synthetic HTTPS links such as https://example.com/fasttrack-demo-v1 and https://example.com/fasttrack-demo-v2.
- Coordinate the supervisor feedback entry with B. Rehearse the deadline wait off-camera and capture only the relevant transition. Show the assessed app and synthetic records with sign-in details outside the frame.

| Segment | What to show | Suggested narration |
| --- | --- | --- |
| A opening, 0:10 | Student Overview and the open milestone from the assigned team. Show the due time as the app displays it. | “fastTrack gives each student a single place to see team deadlines, submit a work link, and read feedback on the exact version.” |
| First submission, 0:17 | Open the milestone, choose **Submit work**, enter title, description and work link, then save. Show version 1 and its saved link. | “This submission belongs to the whole team. The saved page shows version one and the submitted work link.” |
| B handoff | B uses the assigned supervisor account to add one message on version 1. Return to the student saved-work page. | B supplies the supervisor narration and gives the recording back to A after the message is visible. |
| Revision and history, 0:20 | Choose **Submit new revision** on the saved work, enter the revised details and save before deadline. Show version 2 and open version 1 from **Version history**. Show its original link and feedback. | “The revision becomes version two. Version one remains readable with its original link and feedback, so the team can tell which work the supervisor reviewed.” |
| Late rejection, 0:20 | Open the second milestone's **Submit work** form before its due time. After the deadline passes, submit from the still-open form and capture the rejection. Reload and verify that the milestone still has no saved submission. If the page already reflects the new time, show its disabled action and deadline notice, and pair the clip with the actual tested late rejection evidence. | “The deadline is checked by the server. Once this milestone is overdue, the team cannot create a submission. Refreshing confirms that the late attempt saved nothing.” |
| Transition, 0:08 | Return to the student team. Hand off to B for supervisor Summary and release evidence. | “The team can still read its existing work and version history. B will show how a supervisor follows progress across teams.” |

## Capture log

| Field | Value |
| --- | --- |
| Assessed tag, full SHA and serving revision | `v1.0.0-final`, `d0f3f9f8455e5e9c3d2047a2b1b41920d1af`, `fasttrack-app-00006-wzh`. [Production identity](production-release.md) |
| Milestone and saved versions shown | Design Review \| Final Demo, versions 1 and 2. |
| Actual behavior and timestamps of the retained clips | [Part E timestamp index](demonstration-video.md#timestamp-index). |
| Video URL and viewer access | [YouTube demonstration](https://youtu.be/yTT1OpPIbqo). The signed-out player started, and full playback review remains open. |
| Official duration clarification | Pending course confirmation |

The [traceability draft](requirements-traceability.md) maps the scenes to FR-02/04/05/08, BR-04/05/06 and T-26. The [independent worksheet](independent-uat-worksheet.md) supplies a separate verification record for the same domain behavior.
