# Sprint 1 acceptance coverage

Tested verification source: e1ada71; accepted application base: 514f34c. All named automation is from the finalized current 310-case run. Browser/user provenance and joint-gate limits are in [the system record](R1-J03-system-verification.md).

| Acceptance target | Planned test IDs | Actual result | Named case references | Additional current evidence |
| --- | --- | --- | ---: | --- |
| AC-01.1 | T-01 | PASSED | 3 |  |
| AC-01.2 | T-02 | PASSED | 6 |  |
| AC-01.3 | T-03 | PASSED | 5 |  |
| AC-01.4 | T-04 | PASSED | 2 |  |
| AC-01.5 | T-05 | PASSED | 4 |  |
| AC-02.1 | T-06 | PASSED | 9 |  |
| AC-02.2 | T-07 | PASSED | 9 |  |
| AC-02.3 | T-08 | PASSED | 27 |  |
| AC-03.1 | T-09 | PASSED | 1 |  |
| AC-03.2 | T-10/T-11/T-12 | PASSED | 5 |  |
| AC-03.3 | T-13 | PASSED | 2 |  |
| AC-03.4 | T-15 | PASSED | 23 |  |
| AC-03.5 | T-14 | PASSED | 4 |  |
| AC-03.6 | T-16/T-31 local | PASSED | 2 | current-j03-compiled-journey, student-after-final-process-restart |
| AC-04.1 | T-17/T-20 | PASSED | 15 | supervisor-ui-feedback-and-persisted-readback, student-before-final-process-restart |
| AC-04.2 | T-18/T-19/T-20 | PASSED | 19 | T-27-late-feedback-after-account-switch |
| AC-04.3 | T-17/T-19 | PASSED | 17 |  |
| AC-04.4 | T-20/T-31 local | PASSED | 15 | current-j03-compiled-journey, student-after-final-process-restart |
| S1-AC-EXT-01 | T-23 | PASSED | 8 |  |
| S1-AC-EXT-02 | T-24 | PASSED | 17 |  |
| S1-AC-EXT-03 | T-25 | PASSED | 8 | current-j03-compiled-journey |
| S1-AC-EXT-04 | T-26 | PASSED | 7 |  |
| S1-AC-EXT-05 | T-27 | PASSED | 7 | T-27-late-feedback-after-account-switch, T-27-external-returnTo-stays-local |
| Shared-T21 | T-21 | PASSED | 0 | current-j03-compiled-journey, supervisor-ui-created-milestone-readback, student-ui-submit-and-empty-feedback, supervisor-ui-feedback-and-persisted-readback, student-before-final-process-restart |
| Shared-T22 | T-22 | PASSED | 0 | fresh-clean-clone-stage-output |
| Shared-T31-local | T-31 local | PASSED | 3 | current-j03-compiled-journey, student-after-final-process-restart |
| Shared-UI-acceptance | Responsive/keyboard/states/contrast/native 200% | PASSED - mixed automated/manual evidence | 0 | load-recovery-layout-keyboard-and-timezone, post-contrast-real-controls, native-200-manual-user-result |

The [JSON map](R1-J03-verification-map.json) resolves every named reference to a source file, exact report pointer, full-name hash and test-source hash. The [current report](R1-J03-results.json) contains the underlying results. Scope notes in the map distinguish API, browser and local-only checks. Native 200% is user A manual confirmation without instrumental corroboration; no 200% screenshot is claimed. G3/G4 peer decisions and G5/main/PDF remain pending.
