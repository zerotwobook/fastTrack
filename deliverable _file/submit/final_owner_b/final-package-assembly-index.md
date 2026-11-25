# Final Delivery Assembly Skeleton & One-Page Release Summary (Markdown Draft)

Assembly scaffold prepared by B (`@Atip-Infa`) under [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38) in Markdown (`.md`) format per repository policy. **Do NOT generate or export PDFs (`G6`) until joint video recording (`Part E`) finishes (`G4/#36` and `G5/#152` on `v1.0.0-final` are ACCEPTED & CLOSED).** This file defines the master front matter, one-page release summary (`G p.13`), rubric navigation map (`Parts A–E = 100 points`), and G6 assembly verification checklist without modifying A's parallel drafts in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148).

---

## Cover & release header template

- **Assessment:** CPE 334 Final Project Delivery — Complete Integrated and Verified Product Release (`100 points` | Semester 1/2026 | Due `13 December 2026, 23:59 Asia/Bangkok`)
- **Theme & Product:** Theme 6 — **fastTrack** (Course Project Management System)
- **Team Identity:** Group `EN-028` (`InfaCompany`), Section 31
  - **Member A:** Supapanya Yathip (`67070503443`, GitHub `@zerotwobook`)
  - **Member B:** Atip Infa-udom (`67070503446`, GitHub `@Atip-Infa`)
- **Repository:** <https://github.com/zerotwobook/fastTrack>
- **Submitted Immutable Tag & Commit SHA:** **`v1.0.0-final`** at `d0f3f9f8455e5e9c3d2047a2b1e1d1b41920d1af` (sharing identical Git tree `693e8fa617967ac4e8576841ac177f982df01320` with G4-accepted `staging/sprint-3@046310d2`; Final documentation release PR to `main` pending `G6`)
- **Deployed Final Application URL & Serving Version:** <https://fasttrack-app-kpx7au3w2a-as.a.run.app> -> serving revision **`fasttrack-app-00006-wzh`** (`100%` traffic via [Deploy `45394655431`](https://github.com/zerotwobook/fastTrack/actions/runs/45394655431), `v1.0.0-final` / `d0f3f9f8455e5e9c3d2047a2b1e1d1b41920d1af`)

---

## One-page release summary template (`project_final_delivery` / `summary §17.5`)

*(Keep to <= 1 rendered PDF page upon assembly; report only detailed rubric totals `100 points` where video = `10` per `summary_final_deliverable.md §17.5` without inventing an extra +2 points.)*

| Summary Field | Final Assessed Content (Update Final Doc/Video Fields at `G6`) |
| --- | --- |
| **Product Scope** | Full 3-sprint baseline `F-01`–`F-08` plus approved change `CR-L7-01` (`6,000`-code-point exact-version feedback) and post-D2 Summary pager wording fix (`d3b07ba`). |
| **Team & Ownership** | `@zerotwobook` (`Supapanya Yathip`, `67070503443`) & `@Atip-Infa` (`Atip Infa-udom`, `67070503446`) — see [Part B contributions](engineering-and-chains.md#team-contributions-and-ai-use-accounting). |
| **Final Version & Tag** | **`v1.0.0-final`** (`d0f3f9f8455e5e9c3d2047a2b1e1d1b41920d1af`) · Serving Cloud Run revision `fasttrack-app-00006-wzh` (`100%` traffic) |
| **Core Links** | Repository: <https://github.com/zerotwobook/fastTrack> · Deployed App: <https://fasttrack-app-kpx7au3w2a-as.a.run.app> · Demo Video (YouTube): `[PENDING Part E]` |
| **Completion & Verification State** | Staging regressions (`483/483` + `7/7` + `17/17` + `54/54`), Joint `#36` G4 UAT (`Cloud 8/8 PASS` Pawarit Wongdaeng, `Local 8/8 PASS` Tatchakorn Thamnimitr, `G4 ACCEPTED`), and Joint `#152` G5 release (`v1.0.0-final`, `PR #154`, `CI 45394655337`, `Deploy 45394655431`, `/api/health` & `/api/ready` `HTTP 200`, A & B live production readbacks, **G5 ACCEPTED**) are complete. **`[PENDING G6]`:** Joint Part E video, Final PDF verification, doc release PR -> `main` & LEB2 submission. |
| **Known Limitations & Clarifications** | See [Defect, Limitation & Debt Register](qa-dod-readiness-draft.md#known-defects-limitations-and-technical-debt-register) (including provisional `<= 4:00` vs `10:00` course video-duration conflict pending instructor clarification, and CLI-only `effect@3.20.0` devOptional advisory `GHSA-7589-6fvf-x4pw`). |

---

## Rubric navigation map (`Parts A–E`, `100` points total)

| Rubric Part | Weight | Primary Owner | Markdown Draft Source(s) | Appendices & Supporting Evidence | Exported PDF Pages |
| --- | ---: | --- | --- | --- | --- |
| **Part A — Final working product** | **35** | **A** (domain/demo) + **B** (UI/access/demo) | A's `final-working-product.md` + `production-release.md` ([`PR #148`](https://github.com/zerotwobook/fastTrack/pull/148)) paired with B's G4/G5 UI checks | `R3-B03-final-regression.md`, `#36` UAT captures, `v1.0.0-final` production readbacks | `[Assign at PDF export]` |
| **Part B — Engineering process & team evidence** | **15** | **B** (`@Atip-Infa`) | [`engineering-and-chains.md`](engineering-and-chains.md) | S2 Chain (`PR #118`), S3 Chain (`PR #134`), `CR-L7-01` RED/GREEN ([R2-A05](../../../Project_code/docs/evidence/R2-A05-lab7-red.md), [R2-B05](../../../Project_code/docs/evidence/R2-B05-lab7-green.md)), `R3-B03` fix (`d3b07ba` -> `v1.0.0-final`) | `[Assign at PDF export]` |
| **Part C — Final requirements & verification traceability** | **20** | **A** (`@zerotwobook`) | `deliverable _file/submit/final_owner_a/requirements-traceability.md` ([Draft PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) | Appendices: [`project_detail.md`](../../../Project_doc/project_detail.md) (English), all Sprint 1–3 contracts + `lab-7-feedback-limit.md`, Domain excerpt (`T-26`), Access excerpt (`F08-STS-04` in [Part D](qa-dod-readiness-draft.md)) | `[Assign at PDF export]` |
| **Part D — Final QA & Product DoD** | **20** | **B** (aggregates A + B + `#36` + `#152`) | [`qa-dod-readiness-draft.md`](qa-dod-readiness-draft.md) | [`R3-A03-final-regression.md`](../../../Project_code/docs/evidence/R3-A03-final-regression.md), [`R3-B03-final-regression.md`](../../../Project_code/docs/evidence/R3-B03-final-regression.md), [`Project_code/README.md`](../../../Project_code/README.md), [`deployment.md`](../../../docs/labs/lab-05/deployment.md), `#36` & `#152` records | `[Assign at PDF export]` |
| **Part E — Demonstration video** | **10** | **B** (edit/assembly) + **A & B** (joint presenters) | `student-demo-script.md` ([PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) + [`supervisor-demo-and-video-plan.md`](supervisor-demo-and-video-plan.md) | Joint YouTube URL (anyone with link), timestamp index, `v1.0.0-final` release identity (`[PENDING Part E recording]`) | `[Assign at PDF export]` |
| **Total** | **100** | **A + B** | Master `deliverable _file/submit/project_final_delivery.md` (to assemble cleanly once Part E finishes) | Embedded self-contained engineering appendices (no external private links required to grade) | `[Assign at PDF export]` |

---

## Pre-export assembly checklist (`#38` -> `#39` `G6` gate)

- [ ] Merge A's `final_owner_a/` sections (`PR #148`) and B's `final_owner_b/` sections (`PR #149`) cleanly after `chore/s3-b-sync-main-02` (`PR #157`) and Part E video links are added (`#36` G4 and `#152` G5 closed).
- [ ] Verify **`v1.0.0-final`** (`d0f3f9f8455e5e9c3d2047a2b1e1d1b41920d1af`), `Deploy 45394655431`, image digests, serving revision `fasttrack-app-00006-wzh`, `/api/health` + `/api/ready`, independent UAT outcomes, and Part E video title/description align 100% across Cover, One-Page Summary, and Parts A–E.
- [ ] Assemble one self-contained English `deliverable _file/submit/project_final_delivery.md` containing embedded appendices (`project_detail.md` / contracts / test excerpts) with internal PDF page references populated after layout/export.
- [ ] Only upon user-authorized Final export, render the final PDF, visually inspect every single page (readable diagrams/screenshots, zero clipping, working links, zero secrets/passwords/tokens), verify YouTube playback in an incognito browser, and record the actual LEB2 submission receipt in [`Issue #39`](https://github.com/zerotwobook/fastTrack/issues/39).
