# CoursePMS eight-case evidence summary: 14 November 2026

This is a newly authored public summary of private AI-operated evidence, not the original report or a human participation statement. Full original report, ledgers and 32 screenshots remain in the private original archive. No private proposal fields, account details, raw HTTP payloads or image payloads are reproduced here.

Run CPMS-L6-20261114-155049 exercised CPMS-UAT-01 through CPMS-UAT-08 on source 9c22735995c985aaa0622b6b179de1ac9c1f80ca. The actual machine ledger has 56 PASS / 1 FAIL / 57 assertions; 36 core assertions pass across the eight official IDs. Other retained counts are 70 HTTP observations, 26 UI observations and 32 original PNGs. The original narrative incorrectly says 57 PASS / 1 FAIL / 58 and lists CPMS-A-058 without a corresponding JSON record. Originals are preserved; no missing assertion is invented.

| Case | Retained core PASS assertions | Scope |
| --- | --- | --- |
| CPMS-UAT-01 | 7 | Authentication/session; browser Back reached about:blank, then return/reload required sign-in. Literal history path is a documented deviation. |
| CPMS-UAT-02 | 2 | Team creation and cross-profile membership persistence. |
| CPMS-UAT-03 | 3 | Duplicate membership and capacity rejections, saved-state checks. |
| CPMS-UAT-04 | 2 | Incomplete draft persistence and rejected submission. |
| CPMS-UAT-05 | 2 | Submission and saved-state locks. |
| CPMS-UAT-06 | 6 | Foreign access/student-role denial and protected-state checks. |
| CPMS-UAT-07 | 8 | Review lifecycle, revision and terminal-state rejection. |
| CPMS-UAT-08 | 6 | Reload/relogin and canonical persistence comparisons. |

The separate FAIL is L6-OUT-EXP-001: private editor fields from one authenticated identity remain visible after logout/login as another identity without reload; reload clears them. It establishes client-state exposure, not an API authorization bypass or saved copying. The partner's returned correction is not established as deployed. Both human decisions remain pending. Counts describe retained observations, not exhaustive acceptance or personal student execution.
