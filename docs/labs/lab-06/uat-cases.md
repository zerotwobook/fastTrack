# Executable Sprint 1 UAT cases

This is the executable specification, not a result ledger. The [received fastTrack session](sessions/2026-11-13-fasttrack-received.md) contains API and selected browser evidence for all eight groups, with explicit unexecuted UI steps. Full student execution and independent acceptance remain incomplete/unrecorded; see [current-status.md](current-status.md). Independent testers copy [execution-results.md](execution-results.md) into a dated record and enter their actual results. Read [partner-handoff.md](partner-handoff.md) for account aliases, exact versions, run IDs, dates, private access, setup and cleanup.

## Scope and traceability

Requirements/AC refer to the [project requirements](../../../Project_doc/project_detail.md) and [accepted D1 Part E](../../../deliverable%20_file/submit/project_deliverable_1.md). The accepted [auth](../../../Project_code/docs/contracts/sprint-1-auth.md), [milestone](../../../Project_code/docs/contracts/sprint-1-milestones.md), [submission](../../../Project_code/docs/contracts/sprint-1-submissions.md) and [feedback](../../../Project_code/docs/contracts/sprint-1-feedback.md) contracts specify exact API semantics. Feature/AC references below select relevant manual observations; a case does not claim to exhaust every automated boundary/security assertion in an AC family.

| Case | Required category | Requirement / AC references | Dependency |
| --- | --- | --- | --- |
| UAT-01 | Normal journey | FR-01/02/03; AC-01.1/01.5, AC-02.1 | Session readiness and SA/A1 access |
| UAT-02 | Normal journey and exact-version feedback | FR-04/05; BR-07; AC-03.1, AC-04.1/04.4 | UAT-01 NORMAL milestone |
| UAT-03 | Business rule: one shared submission | BR-05; AC-03.3 | UAT-02 saved work |
| UAT-04 | Business rule: deadline | BR-04; AC-03.2 (late case) | New DEADLINE milestone, no submission |
| UAT-05 | Forbidden ownership / disclosure | BR-02; AC-01.5/02.2/03.5/04.2 | UAT-02 exact URLs; SB access |
| UAT-06 | Forbidden role and input validation | BR-03/08; AC-02.2/02.3, AC-03.4, AC-04.3 | Separate VALIDATION milestone; SA/A1 access |
| UAT-07 | Session and account-switch state | FR-01; AC-01.1/01.2/01.3/01.4/01.5 | UAT-02 saved submission and SB access |
| UAT-08 | State / persistence / feedback association | FR-04/05; BR-07; AC-03.1/04.1/04.4; NFR-03 | UAT-02 saved record ledger |

## Common recording rules

Use the agreed source/revision throughout. For each case record tester, role, date/time with time zone, preconditions/inputs, actual result, PASS/FAIL/BLOCKED and evidence IDs. A failed precondition is BLOCKED; do not silently skip it. The UI is the main observation surface. A precise HTTP assertion requires a recorded actual response, rather than inferring an HTTP code from UI text. For rejected writes, compare authorized saved state before/after as well as recording the rejection.

### UAT-01: Create and read a milestone

**Purpose:** An assigned supervisor creates a real milestone that the team student can read. **Roles:** SA, A1. **Preconditions:** Confirmed Team A, isolated role profiles, no existing milestone with this run's NORMAL title. **Inputs:** NORMAL title/description/future Bangkok deadline from the handoff.

1. In SA's profile open the application, choose **Sign in**, enter the privately supplied account, and confirm the header shows the intended supervisor.
2. From **Your teams**, choose Team A / **Open team**, then **Create milestone**.
3. Fill **Title**, **Description** and **Deadline in Asia/Bangkok** with the agreed NORMAL values. Record the full displayed deadline including seconds/time zone. Select **Create milestone** once.
4. Copy the resulting `/milestones/<id>` URL, record its ID/team/title/description/deadline, and reload. Return to Team A and check the new milestone appears exactly once.
5. In A1's separate profile sign in, open Team A, choose **Refresh milestones** if needed and open this exact NORMAL milestone.

**Expected:** SA/A1 see their own role/team, the same newly saved milestone fields and future deadline. Reload reads the saved record; there is exactly one run-specific NORMAL milestone. **Evidence:** Saved milestone and team list in SA plus A1's matching view. **Postcondition:** Record `NORMAL_MILESTONE_ID` and URL for UAT-02.

### UAT-02: Submit work and read append-only feedback

**Purpose:** Complete the student-to-supervisor-to-student business journey. **Roles:** A1, SA. **Preconditions:** UAT-01 NORMAL is active, unsubmitted and before deadline. **Inputs:** WORK title/description/HTTP(S) link and first/second feedback in the handoff.

1. As A1 open the NORMAL milestone and select **Submit work**. Enter **Title**, **Description** and **Work link**. Select **Submit work** once.
2. On the saved `/submissions/<id>` page, record ID/URL, version, author, submitted time and all three input values. Reload and compare. Record the initial feedback list/count before SA writes.
3. As SA open this exact submission URL. In **Feedback for version 1**, enter the first message under **Your feedback** and select **Save feedback** once. Wait for the saved message, not only a loading indicator.
4. Append the second, distinct message through the same form. Reload and record both exact messages and their displayed ordering/association.
5. As A1 reload the same submission. Compare saved work and both messages against SA's observations. Open the milestone and its saved-submission link to verify it leads back to the same submission/version.

**Expected:** One saved shared version-1 submission with actual A1 author/time and unchanged work content after reload. The two new feedback messages are appended once each and belong to this exact submission/version in both roles. The first message remains after the second is saved; feedback does not create a new work version or grade/approval. **Evidence:** A1 saved work, SA two-message view and A1 matching feedback. **Postcondition:** Preserve `NORMAL_SUBMISSION_ID`, URL and exact content/message ledger.

### UAT-03: Reject a second first submission

**Purpose:** Verify the shared one-submission rule. **Role:** A1 (optional A2 repeat only if privately supplied). **Preconditions:** UAT-02 completed; record the existing work ID/version/content.

1. As A1 open `/milestones/<NORMAL_MILESTONE_ID>/submissions/new` directly. Do not assume the UI exposes a revision or edit control.
2. Observe the existing-team-submission notice, saved author/time and **Open saved submission**. Confirm a second save is unavailable; open the saved link and compare ID/content.
3. To verify server rejection as well as UI prevention, use the bounded **duplicate** request recipe below in the A1 profile. Record its sanitized status/code.
4. Reload the milestone and existing submission. Confirm version 1 and content/ID are unchanged, with one work entry rather than a new version.

**Expected:** No second first submission is saved or silently overwrites the team record. The direct request is HTTP 409 / `ALREADY_SUBMITTED`; the existing saved work remains intact. **Evidence:** Existing-submission notice, sanitized response and saved before/after comparison. If the request recipe cannot be executed, record the server subcheck BLOCKED rather than infer 409 from a disabled control.

### UAT-04: Reject work after the deadline

**Purpose:** Exercise the late boundary with real time. **Roles:** SA setup; A1 test. **Preconditions:** Create a distinct DEADLINE milestone using the handoff values, deadline at least five whole minutes in the future and no work saved. Record the exact deadline and ID. **Inputs:** WORK text with title suffix `-LATE` and the synthetic link.

1. As A1 open the new milestone before its deadline, confirm there is no saved work and open **Submit work**. Fill the fields without submitting.
2. Wait until at least 60 seconds after the displayed deadline. In another tab in the same A1 profile open `/api/milestones/<DEADLINE_MILESTONE_ID>`. Record the sanitized `meta.serverTime` and `dueAt`; proceed only when the server time is strictly later.
3. Return to the form. If still enabled, select **Submit work** once. If current UI state prevents the action, record that prevention. In either case use the bounded **late** request recipe below to observe the server rule.
4. Reload the milestone and the authorized `/api/milestones/<id>/submissions` list. Confirm an empty list and no saved-submission link for this milestone.

**Expected:** A late request is HTTP 409 / `DEADLINE_PASSED`, with no saved work. UI explains the deadline state and does not show a false success. **Evidence:** Exact due/server times, sanitized rejection and empty saved list. This manual case does not prove equal-time or +/-1 ms behavior; reference the original automated evidence separately. Never change clocks or claim the old form's clock is authoritative.

### UAT-05: Deny another team's reads

**Purpose:** Confirm actual server denial and no disclosure. **Roles:** SB; SA/A1 for control. **Preconditions:** UAT-02's exact Team A/milestone/submission URLs and unchanged record ledger; SB belongs to Team B.

1. As SA/A1 open the saved submission once and confirm it remains available. Then use SB's separate profile and verify the displayed role/account is SB.
2. Paste Team A's `/teams/<id>`, `/milestones/<NORMAL_MILESTONE_ID>` and `/submissions/<NORMAL_SUBMISSION_ID>` URLs one by one into SB's profile.
3. In that SB profile open `/api/submissions/<NORMAL_SUBMISSION_ID>` and `/api/submissions/<NORMAL_SUBMISSION_ID>/feedback`. Record only sanitized status/error output.
4. Return to SB's overview; verify its team list does not disclose Team A. As SA/A1 reread the NORMAL record and compare ID/content/messages.

**Expected:** Foreign detail/list reads return generic HTTP 404 / `NOT_FOUND`; pages show unavailable/not-found recovery without Team A work, feedback or member details. SB's list contains only assigned scope. No protected state changes. **Evidence:** SB generic denial and role context; authorized before/after control. A hidden navigation link alone is insufficient.

### UAT-06: Reject a forbidden role write and invalid inputs

**Purpose:** Verify server role rejection and usable validation/no-write behavior. **Roles:** A1 and SA. **Preconditions:** New VALIDATION milestone created by SA with no submission; note Team A milestone count and existing NORMAL feedback count. **Inputs:** Whitespace-only titles/feedback and `ftp://example.com/work` as an invalid work link.

1. As A1 open `/teams/<TEAM_A_ID>/milestones/new`. Observe **Only the assigned supervisor can create milestones.** Then run the bounded **role** request recipe below; it intentionally attempts only the new FORBIDDEN synthetic milestone.
2. As SA refresh Team A's list. Confirm no FORBIDDEN milestone and unchanged milestone count from step 1. If one exists, record FAIL and preserve the unexpected record/evidence rather than deleting it.
3. As SA open **Create milestone**, use a whitespace-only title with otherwise valid description/future deadline, and try to save. Record the field error and verify no new milestone. Return without replacing an existing record.
4. As A1 open the VALIDATION milestone's **Submit work** form. First attempt a whitespace-only title with valid description/link. Then enter a valid title/description and the `ftp://` link and attempt again. Record each field error; reload the milestone to confirm no submission.
5. As SA open the NORMAL saved submission, attempt whitespace-only **Your feedback** and **Save feedback**. Record the error and confirm the two prior messages are unchanged with no additional message. As A1 open that same submission and confirm the supervisor feedback form is unavailable.
6. To verify the feedback server guard, run the bounded **feedback-role** request recipe as A1; record 403 and compare the saved feedback list again as SA.

**Expected:** Student create/feedback writes return HTTP 403 / `FORBIDDEN`, with no new milestone/message. Invalid input has clear field feedback and creates no record. Valid saved work and feedback remain unchanged. **Evidence:** Actual role-rejection responses, selected field errors and authorized before/after counts/content. Client validation observations are not labelled as observed HTTP 400 responses.

### UAT-07: Sign out, deny anonymous access and switch accounts

**Purpose:** Verify session-dependent private state. **Roles:** A1 then SB in the same profile for the switch subcase. **Preconditions:** Saved NORMAL URL, working private credentials and access to a genuinely signed-out separate profile.

1. In the signed-out profile open the saved submission URL and `/api/submissions/<NORMAL_SUBMISSION_ID>`. Record sign-in recovery and HTTP 401, with no saved private content.
2. On the sign-in form try a clearly incorrect password for a supplied test account once. Record the generic sign-in failure and absence of private workspace; do not repeatedly guess passwords. Then sign in correctly as A1.
3. Open NORMAL and select **Sign out**. Use Back and reload the old private URL. Verify sign-in is required. Open the private API URL again and record 401 without private data.
4. In that same profile sign in as SB. Open the old Team A submission URL and use Back/reload. Verify the current SB account cannot see A1/Team A private state. Check the corresponding detail API returns generic 404.
5. Sign out SB and sign in as A1 before UAT-08. Confirm the intended account in the header.

**Expected:** Unknown credentials create no usable session; signed-out reads return 401; current SB scope receives generic 404; stale account content does not reappear. **Evidence:** Anonymous/signed-out API status, generic failed sign-in, SB foreign denial with actual role context. Do not capture password entry or `/api/auth/me` token fields. Absolute eight-hour expiry and raw-cookie replay are not newly tested by this session.

### UAT-08: Preserve saved work and exact-version feedback

**Purpose:** Independently read the same records after reload and relogin. **Roles:** A1 and SA. **Preconditions:** UAT-02's saved ID/content/time/version/two-message ledger, no owner data edits during comparison.

1. As A1 open the NORMAL submission, record its exact URL/ID, version, title, description, link, author/time and both feedback messages. Reload and compare all values.
2. Select **Sign out**, sign in again as A1, navigate from Team A through the NORMAL milestone to saved work and compare the same ledger.
3. As SA independently open the exact saved URL, reload and compare the same work/messages. Verify there is one submission and each of the two new messages appears once.
4. Record before/after evidence and any mismatch. Sign out temporary sessions when the full session ends.

**Expected:** Same IDs/content/version/associations after reload/relogin, no lost work or duplicate message. **Evidence:** The paired record ledger and screenshots in both roles. This case is not a fresh restart/redeploy or eight-hour-session test. If the partner reviews historical Lab 5 persistence evidence, cite its actual actor/time/version separately; do not relabel it as today's execution.

## Bounded browser request recipe for UAT-03/UAT-04/UAT-06

This small manual API subcheck supplements user-facing steps. Run only on the exact fastTrack origin in the signed-in **A1** profile, against the new synthetic run records. A/B may explain the written procedure; the independent tester chooses/runs it and records the actual result. If browser policy or skills prevent execution, use BLOCKED and arrange an agreed tester-assisted session rather than inventing a response or bypassing browser protections.

Open browser Developer Tools, choose Console, inspect the code and set `mode` to one of `duplicate`, `late`, `role`, `feedback-role`. Replace the two new milestone IDs and the new submission ID from the session ledger. Do not use the historical Lab 5 record IDs. The function verifies origin, current student identity and all required UUIDs, keeps CSRF only in local function memory and prints status/domain code plus a newly created synthetic ID if a supposed denied write unexpectedly succeeds. It does not print authentication data. Do not export Console history/HAR or authentication responses.

```javascript
(async () => {
  const mode = 'duplicate'; // Select duplicate, late, role or feedback-role.
  const normalMilestoneId = 'REPLACE_NORMAL_MILESTONE_UUID';
  const deadlineMilestoneId = 'REPLACE_DEADLINE_MILESTONE_UUID';
  const normalSubmissionId = 'REPLACE_NORMAL_SUBMISSION_UUID';
  const teamId = '7c600ee0-a595-4c52-a093-f0ed5e08fded';
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (location.origin !== 'https://fasttrack-app-kpx7au3w2a-as.a.run.app') throw new Error('Wrong origin.');
  const selected = mode === 'duplicate' ? normalMilestoneId : mode === 'late' ? deadlineMilestoneId
    : mode === 'feedback-role' ? normalSubmissionId : mode === 'role' ? teamId : null;
  if (!selected || !uuid.test(selected)) throw new Error('Select a valid mode and the new fixture UUID.');
  const identity = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
  if (!identity.ok) throw new Error('Sign in as the agreed Team A student.');
  const { data: auth } = await identity.json();
  if (auth.user.role !== 'student') throw new Error('This denial check requires a student session.');
  const team = await fetch(`/api/teams/${teamId}`, { credentials: 'same-origin', cache: 'no-store' });
  if (!team.ok) throw new Error('The agreed Team A scope is unavailable.');
  if (mode === 'duplicate' || mode === 'late') {
    const detail = await fetch(`/api/milestones/${selected}`, { credentials: 'same-origin', cache: 'no-store' });
    if (!detail.ok) throw new Error('The new milestone cannot be read.');
    const milestone = await detail.json();
    const expectedTitle = mode === 'duplicate' ? 'L6-20261113-1730-NORMAL' : 'L6-20261113-1730-DEADLINE';
    if (milestone.data.teamId !== teamId || milestone.data.title !== expectedTitle) throw new Error('Wrong synthetic milestone.');
    const list = await fetch(`/api/milestones/${selected}/submissions`, { credentials: 'same-origin', cache: 'no-store' });
    if (!list.ok) throw new Error('Saved submissions cannot be checked.');
    const saved = await list.json();
    if (mode === 'duplicate' && (saved.data.length !== 1 || saved.data[0].title !== 'L6-20261113-1730-WORK')) {
      throw new Error('Complete and verify the NORMAL submission first.');
    }
    const serverTime = Date.parse(milestone.meta.serverTime), dueAt = Date.parse(milestone.data.dueAt);
    if (mode === 'late' && (saved.data.length !== 0 || !Number.isFinite(serverTime) || !Number.isFinite(dueAt) || serverTime <= dueAt)) {
      throw new Error('The new DEADLINE milestone must be unsubmitted and past its server-confirmed deadline.');
    }
  } else if (mode === 'feedback-role') {
    const detail = await fetch(`/api/submissions/${selected}`, { credentials: 'same-origin', cache: 'no-store' });
    if (!detail.ok) throw new Error('The new submission cannot be checked.');
    const saved = await detail.json();
    if (saved.data.title !== 'L6-20261113-1730-WORK') throw new Error('Use only the new NORMAL work record.');
  }
  let path, payload;
  if (mode === 'role') {
    path = `/api/teams/${teamId}/milestones`;
    payload = { title: 'L6-20261113-1730-FORBIDDEN', description: 'Synthetic denied student write.',
      dueAt: new Date(Date.now() + 86400000).toISOString() };
  } else if (mode === 'feedback-role') {
    path = `/api/submissions/${selected}/feedback`;
    payload = { content: 'L6-20261113-1730: forbidden student feedback.', clientRequestId: crypto.randomUUID() };
  } else {
    path = `/api/milestones/${selected}/submissions`;
    payload = { title: 'L6-20261113-1730-REJECTED', description: 'Synthetic rejected request.',
      url: 'https://example.com/?run=L6-20261113-1730' };
  }
  const response = await fetch(path, { method: 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': auth.csrfToken }, body: JSON.stringify(payload) });
  const result = await response.json();
  console.log({ mode, status: response.status, code: result.error?.code ?? null,
    unexpectedCreatedId: response.ok ? result.data?.id ?? null : null });
})();
```

Before running `late`, confirm fresh server time is beyond the recorded deadline. Before `duplicate`, confirm the NORMAL submission already exists. For each denied write, an authorized SA/A1 read must confirm no protected change. For a different rerun, change the run prefix consistently in both this recipe and the fixture sheet. This recipe has source/syntax validation only during document preparation; no live authenticated request is claimed.
