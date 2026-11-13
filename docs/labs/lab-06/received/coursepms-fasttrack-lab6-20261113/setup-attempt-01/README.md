# Preserved setup attempt 01

This is an actual stopped runner attempt, not a product defect or completed UAT. The runner supplied six fractional second digits in the NORMAL milestone's dueAt. The existing contract permits at most three. The server correctly returned HTTP 400 INVALID_INPUT with an explicit field message. The runner was corrected to emit milliseconds and rerun with a fresh prefix; the original ledgers remain here unchanged.

The attempt recorded 22 passing assertions and one incorrect runner expectation (expected 201 for its invalid date). All five temporary API sessions were signed out. Its one successfully created DEADLINE milestone is retained: 111b7369-53f6-44e4-a0a6-5cb64ad2d52a, due 2026-11-13T12:52:00Z. No NORMAL submission or feedback was created in this attempt. Do not add these repeated assertions to the completed-run denominator or report the 400 as an accepted product defect.
