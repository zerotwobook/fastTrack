# Compiled browser regressions

Use these Playwright CLI `run-code` functions on the disposable server started by `npm run review:j03`, with synthetic accounts and an explicit `?disposableReview=1` URL. They create append-only review data and revoke their own synthetic session; never use a persistent development/production database. Credentials are supplied interactively, not embedded in tests or browser storage. The CLI package runs through npm exec and is not an application dependency.

From `Project_code`, open a named browser session and sign in with the runner's synthetic password:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=s1fix open <AUTH_REVIEW_URL>
npx --yes --package @playwright/cli playwright-cli -s=s1fix snapshot
# Use current snapshot references to fill the synthetic email/password and sign in.
```

| Function file | Required starting page and fixtures | Assertions |
|---|---|---|
| `s1-feedback-ordering.js` | Assigned supervisor on `/submissions/<id>?disposableReview=1`; real synthetic saved submission | Hold a genuine initial GET across a successful POST, retain old/new rows, delay a read failure after a save, verify persistence and 320/390/768/1200/1440px layouts. |
| `s1-draft-visibility.js` | Supervisor on `/teams/<id>/milestones/new?disposableReview=1` | Preserve all form fields for the same session; mask private UI, handle verification outage/retry, close modal, discard drafts on actual session revocation. Ends signed out. |
| `s1-student-overview.js` | Student overview `/?disposableReview=1`; seed at least one actionable, overdue, submitted and cancelled milestone in its dedicated review DB | Compare real API membership/order with sections and eligible submit links, then inspect five viewport widths. Cancelled fixtures use the isolated DB fixture mechanism; there is no Sprint 1 cancellation endpoint. |

Run the matching function after navigating/authenticating as required:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=s1fix run-code --filename e2e/s1-feedback-ordering.js
```

The functions throw on failure and return their actual checks on success. Capture the CLI output; a returned object is not peer acceptance. Visibility checks deliberately control `document.visibilityState` and dispatch real application events: report this method, not a native tab-switch result. The feedback success response is captured from the real server; its failure scenario intentionally injects a delayed 503. Session unit tests additionally cover changed user/role/CSRF, queued private operations and stale responses. Existing system/DB suites cover authorization, deadlines, transaction/retry and clean setup.

Close only the named browser (`-s=s1fix close`) and stop the matching review runner with `npm run review:auth:stop`. The runner removes only its newly created PostgreSQL container.
