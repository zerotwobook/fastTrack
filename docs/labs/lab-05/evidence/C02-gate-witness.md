# C-02 required-check proof: assisted witness

Task R2-B01 / [Issue #15](https://github.com/zerotwobook/fastTrack/issues/15). Owner B (`Atip-Infa`); assisted witness performed for A (`zerotwobook`) on 12 November 2026. The user requested teammate review and continuation. This record describes automated inspection and reproduction; it does not claim separate manual human testing or approve intentionally broken code.

## Exact candidate and checks

| Item | Observed result |
|---|---|
| Proof | [PR #95](https://github.com/zerotwobook/fastTrack/pull/95), head `2d90a186927adcc3ede482d9b3e8beeeccefe5e0` |
| Base | Accepted main `16ec6d268ac087f3834be7da55dda29e589847ce` |
| Full diff | One assertion changed from expected call count 4 to 5 in `deploy/tests/test_smoke.py:33`; no app, DB or deployment change. |
| Named test | `SmokeTests.test_public_checks_pass_and_skip_optional_login`; actual failure `AssertionError: 4 != 5`. |
| Original CI | [Run 43144813896](https://github.com/zerotwobook/fastTrack/actions/runs/43144813896), failed required `test-and-docker`; failed log was independently read. |
| Reopen CI | [Run 43148021746](https://github.com/zerotwobook/fastTrack/actions/runs/43148021746), same head and failed check. Its signed-log download timed out; its API conclusion and producer were read. |
| Check producer | GitHub Actions app ID `15368`, matching the required context's configured integration ID. |
| Rules | Active [ruleset 26666182](https://github.com/zerotwobook/fastTrack/rules/26666182), effective on main, no bypass actors, strict up-to-date required `test-and-docker`; one peer approval also required. |
| Pre-closure live state | Non-Draft, conflict-free (`MERGEABLE`), `BLOCKED`, auto-merge null, required check FAILURE. No merge attempt was made. |

The failed named required check is an unsatisfied prerequisite independently of the also-missing approval. A Draft restriction or `BLOCKED` alone would not establish that conclusion; the effective required-check policy, observed producer/context and failed assertion are the evidence together.

## Independent local reproduction

Extracted only `deploy/smoke_test.py` and `deploy/tests/test_smoke.py` from each exact commit into separate temporary directories. Ran the same command in each directory:

```powershell
python -B -m unittest discover -s deploy/tests -p test_smoke.py
```

| Source | Actual result |
|---|---|
| Main `16ec6d2` | Exit 0; 10 tests, all PASS. |
| Proof `2d90a18` | Exit 1; 10 tests, exactly one deliberate failure and nine PASS. |

Network calls are mocked by the existing suite. Neither extracted copy was merged into the workspace or deployed. This is a passing proof experiment with deliberately failing candidate tests; it is not a passing implementation build.

## Disposition and metadata correction

The timeline confirms B initially closed the proof at `2026-11-12T03:16:57Z` and reopened it at `03:24:39Z`. The original closed-unmerged description was therefore historical when A inspected it. Reopening also moved its Project card to Backlog.

After the requested [COMMENT review](https://github.com/zerotwobook/fastTrack/pull/95#pullrequestreview-5868601890), A closed PR #95 again at `2026-11-12T03:35:17Z`. Readback: **CLOSED**, `mergedAt: null`, `mergeCommit: null`, unchanged head. The branch/commit and both failed runs remain preserved. The close event moved the card to Done; it was reconciled to **PR Review / FAILED / PENDING** so broken, unmerged implementation is not counted as completed code. This observation is narrower than the repository's documented merged-PR-only automation assumption; the automation configuration itself was not changed.

B's prior record attributes the controlled non-Draft exception to its user decision. This review reports that provenance without claiming access to the other session's human conversation. No Draft lift, approval, bypass, source modification or protected merge was performed by this witness.

## Historical checkpoint and later acceptance

At the original witness checkpoint, C-02's technical proof and final never-merge disposition were verified, while Issue #15 remained OPEN / Acceptance PENDING for live WIF/deployer and the later repeatable release. The initial manual bootstrap and this proof alone did not establish C-06 or authenticated C-04/C-05.

The later [C-06 delivery](C06-release-traceability.md), A's [post-redeploy checks](C05-redeploy.md) and B's accepted [post-release witness](B-post-release-readback.md) now provide those separately dated observations. A reconciled [Issue #15](https://github.com/zerotwobook/fastTrack/issues/15) to CLOSED / Done / PASSED / ACCEPTED for its CI/release scope on 12 November 2026 after reading the actual successful WIF run and B environment approval. This does not rewrite the original checkpoint or turn the deliberate failing proof into accepted code.

The original historical blocked-control image remains absent. The later, separately authorized [PR #105 native visual experiment](C02-visual-proof.md) now supplies actual C-02 visual evidence with its own source/time and was closed without merging. No closed page was relabelled as an earlier blocked state and no TA acceptance was invented. Final package review/submission remain tracked in [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16) and the [submission handoff](../submission-handoff.md).
