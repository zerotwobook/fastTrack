# Sprint 1 independent-review corrections

Task: R1-A-REVIEW-FIX / Issue #70. A implements under the user's explicit authorization; B reviews. Baseline: `94e588d60169e542550a773140558369550c400d`. Target: `staging/sprint-1` only.

## Observed failures and acceptance

1. **Visibility and drafts:** the compiled app discards a form on a controlled hidden/visible visibility event. Preserve component state only while the same user, role and session CSRF token are reverified. Hide private content and close its modal during verification. Hold private responses until verification completes. Logout, expiry, changed identity/session and hard navigation still invalidate state and in-flight responses. A network failure keeps preserved state hidden until a successful retry. Do not use browser storage for private drafts.
2. **Feedback ordering:** a genuine initial GET captured before a successful POST can subsequently erase that saved row from the UI. Merge append-only rows by ID in canonical createdAt/ID order, retaining both older rows and confirmed new writes. A superseded GET failure cannot hide a confirmed save. Keep the immutable body/UUID, exact-version association and uncertain-result reconciliation rules.
3. **Milestone validation:** NUL and unpaired surrogates in title/description currently reach PostgreSQL and produce 503. Reject these as 400 INVALID_INPUT with the matching field and no write. Preserve valid astral characters, trimmed code-point limits and existing deadline/authorization behavior. Do not edit applied migrations.
4. **Student overview:** project detail 8.6 B requires actionable work before overdue/submitted work. Render separate actionable, overdue, submitted and (when present) cancelled groups. Use the API serverTime and dueAt/ID ordering within groups. The equality deadline remains actionable; submitted overdue work belongs to submitted. Offer a direct Submit work action only for eligible rows. Keep supervisor team context and the existing monochrome track, typography and tokens; do not add Sprint 2 controls.

## Current documentation and small design follow-ups

- Update current setup/test instructions from actual new results. Preserve historical evidence and PDF candidates as versioned records.
- Clarify that the accepted login contract does not impose the legacy planning draft's 254/128-character limits; do not introduce a credential-breaking cap during this repair.
- Use the specified 14px form helpers and full-width primary feedback action on mobile. Self-host the existing Inter/Noto Sans Thai families only with verified official provenance and licenses.

## Verification and handoff

Retain behavioral RED/GREEN evidence, meaningful session/validation/grouping regressions and actual compiled-browser checks for drafts/privacy and delayed feedback reads. Run the existing fresh isolated review chain after focused checks pass. Record exact source, case counts, browser method and unverified limits. Do not convert controlled visibility events into a claim of native tab-switch testing.

Open an early Draft PR during Started and continue the same PR. Hand off to B only after checks/evidence are complete. Peer acceptance remains pending until B actually reviews. Main PR #67 remains Draft, without auto-merge or a peer-merge request, until the user personally reviews and explicitly authorizes the concrete release candidate. This patch does not accept G5, finalize the report, tag a release or submit D1.
