# Final Delivery Assembly Skeleton & One-Page Release Summary (Markdown Draft)

Assembly scaffold prepared by B (`@Atip-Infa`) under [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38) in Markdown (`.md`) format per repository policy. **Do NOT generate or export PDFs (`G6`) until G4 (`#36`), G5 (`main` release freeze), and joint video recording (`Part E`) finish.** This file defines the master front matter, one-page release summary (`G p.13`), rubric navigation map (`Parts A–E = 100 points`), and G6 assembly verification checklist without modifying A's parallel drafts in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148).

---

## Cover & release header template

- **Assessment:** CPE 334 Final Project Delivery — Complete Integrated and Verified Product Release (`100 points` | Semester 1/2026 | Due `13 December 2026, 23:59 Asia/Bangkok`)
- **Theme & Product:** Theme 6 — **fastTrack** (Course Project Management System)
- **Team Identity:** Group `EN-028` (`InfaCompany`), Section 31
  - **Member A:** Supapanya Yathip (`67070503443`, GitHub `@zerotwobook`)
  - **Member B:** Atip Infa-udom (`67070503446`, GitHub `@Atip-Infa`)
- **Repository:** <https://github.com/zerotwobook/fastTrack>
- **Submitted Immutable Tag & Commit SHA:** `[PENDING G5 Final main freeze]` *(Current UAT staging candidate: `staging/sprint-3@046310d288859ee42745a043369498d5d646d6c9`)*
- **Deployed Final Application URL & Serving Version:** `[PENDING G5 Final deploy]` *(Current UAT Cloud Preview: <https://fasttrack-uat-046310d-970128017651.asia-southeast1.run.app> -> `fasttrack-uat-046310d-candidate`; D2 production baseline: <https://fasttrack-app-kpx7au3w2a-as.a.run.app> -> `7872a739`)*

---

## One-page release summary template (`project_final_delivery` / `summary §17.5`)

*(Keep to <= 1 rendered PDF page upon assembly; report only detailed rubric totals `100 points` where video = `10` per `summary_final_deliverable.md §17.5` without inventing an extra +2 points.)*

| Summary Field | Content to Populate at `G5/G6` Freeze |
| --- | --- |
| **Product Scope** | Full 3-sprint baseline `F-01`–`F-08` plus approved change `CR-L7-01` (`6,000`-code-point exact-version feedback) and post-D2 Summary pager wording fix (`d3b07ba`). |
| **Team & Ownership** | `@zerotwobook` (`Supapanya Yathip`, `67070503443`) & `@Atip-Infa` (`Atip Infa-udom`, `67070503446`) — see [Part B contributions](engineering-and-chains.md#team-contributions-and-ai-use-accounting). |
| **Final Version & Tag** | `[PENDING G5 Final tag & 40-char main SHA]` · Serving Cloud Run revision `[PENDING G5]` |
| **Core Links** | Repository: <https://github.com/zerotwobook/fastTrack> · Deployed App: `[PENDING G5]` · Demo Video (YouTube): `[PENDING G5/Part E]` |
| **Completion & Verification State** | Staging pre-UAT regressions (`#34` `R3-A03`, `#35` `R3-B03`) complete (`483/483` isolated + `7/7` upgrades + `17/17` socket + `54/54` viewport/zoom). **`[PENDING]`:** `#36` independent UAT outcomes, `main` release CI/deploy readback, and Final PDF/video checks. |
| **Known Limitations & Clarifications** | See [Defect, Limitation & Debt Register](qa-dod-readiness-draft.md#known-defects-limitations-and-technical-debt-register) (including provisional `<= 4:00` vs `10:00` course video-duration conflict pending instructor clarification, and CLI-only `effect@3.20.0` devOptional advisory `GHSA-7589-6fvf-x4pw`). |

---

## Rubric navigation map (`Parts A–E`, `100` points total)

| Rubric Part | Weight | Primary Owner | Markdown Draft Source(s) | Appendices & Supporting Evidence | Exported PDF Pages |
| --- | ---: | --- | --- | --- | --- |
| **Part A — Final working product** | **35** | **A** (domain/demo) + **B** (UI/access/demo) | Combined post-G5 deployed feature table + live journeys (`[PENDING G5 Final captures]`) | `Project_code/docs/evidence/R3-B03-final-regression.md` (`assets/s3-b03/*`), [`PR #148`](https://github.com/zerotwobook/fastTrack/pull/148), `#36` UAT captures | `[Assign at PDF export]` |
| **Part B — Engineering process & team evidence** | **15** | **B** (`@Atip-Infa`) | [`engineering-and-chains.md`](engineering-and-chains.md) | S2 Chain (`PR #118`), S3 Chain (`PR #134`), `CR-L7-01` RED/GREEN ([R2-A05](../../../Project_code/docs/evidence/R2-A05-lab7-red.md), [R2-B05](../../../Project_code/docs/evidence/R2-B05-lab7-green.md)), `R3-B03` fix (`d3b07ba`) | `[Assign at PDF export]` |
| **Part C — Final requirements & verification traceability** | **20** | **A** (`@zerotwobook`) | `deliverable _file/submit/final_owner_a/requirements-traceability.md` ([Draft PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) | Appendices: [`project_detail.md`](../../../Project_doc/project_detail.md) (English), all Sprint 1–3 contracts + `lab-7-feedback-limit.md`, Domain excerpt (`T-26`), Access excerpt (`F08-STS-04` in [Part D](qa-dod-readiness-draft.md)) | `[Assign at PDF export]` |
| **Part D — Final QA & Product DoD** | **20** | **B** (aggregates A + B + `#36`) | [`qa-dod-readiness-draft.md`](qa-dod-readiness-draft.md) | [`R3-A03-final-regression.md`](../../../Project_code/docs/evidence/R3-A03-final-regression.md), [`R3-B03-final-regression.md`](../../../Project_code/docs/evidence/R3-B03-final-regression.md), [`Project_code/README.md`](../../../Project_code/README.md), [`deployment.md`](../../../docs/labs/lab-05/deployment.md), `#36` UAT worksheet | `[Assign at PDF export]` |
| **Part E — Demonstration video** | **10** | **B** (edit/assembly) + **A & B** (joint presenters) | `student-demo-script.md` ([PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) + [`supervisor-demo-and-video-plan.md`](supervisor-demo-and-video-plan.md) | Joint YouTube URL (anyone with link), timestamp index, assessed `main` release identity (`[PENDING G5 recording]`) | `[Assign at PDF export]` |
| **Total** | **100** | **A + B** | Master `deliverable _file/submit/project_final_delivery.md` (to assemble cleanly once G4/G5 close) | Embedded self-contained engineering appendices (no external private links required to grade) | `[Assign at PDF export]` |

---

## Pre-export assembly checklist (`#38` -> `#39` `G6` gate)

- [ ] Merge A's `final_owner_a/` sections (`PR #148`) and B's `final_owner_b/` sections (`PR #149`) cleanly after `#36` (`G4`) & `main` freeze (`G5`).
- [ ] Populate final `main` commit SHA, immutable tag, CI run counts (`PASS/FAIL/SKIPPED`), `Deploy demo` IDs, image digests, serving revision, live `/api/health` + `/api/ready`, and independent UAT outcomes consistently across Cover, One-Page Summary, Parts A–E, and Part E video title/description.
- [ ] Assemble one self-contained English `deliverable _file/submit/project_final_delivery.md` containing embedded appendices (`project_detail.md` / contracts / test excerpts) with internal PDF page references populated after layout/export.
- [ ] Only upon user-authorized Final export, render the final PDF, visually inspect every single page (readable diagrams/screenshots, zero clipping, working links, zero secrets/passwords/tokens), verify YouTube playback in an incognito browser, and record the actual LEB2 submission receipt in [`Issue #39`](https://github.com/zerotwobook/fastTrack/issues/39).
