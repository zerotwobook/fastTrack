# Source retention and publication scope

All new partner source payloads are retained privately in output/playwright/CoursePMS-Return-Review-20261117/ in the user's workspace. The original returned ZIP is at that root; original earlier archives are under original-archives/; full unchanged extracted snapshots are under received/; per-file hashes are in snapshot-inventory.json. These local artifact locations are not published repository paths.

Actual integrity checks verified 53 entries in the returned archive, 40 in the outgoing 14 November evidence and 78 in the reciprocal follow-up: 171 original manifest entries. All 174 extracted source files match their recorded hashes. Source builders/runners were not executed. The original ZIPs and their internal manifests remain unchanged. All private UAT images remain private, including 32 outgoing and 26 reciprocal follow-up PNGs.

The public staging PR contains only newly authored status/intake/handoff summaries and narrow public GitHub PR/CI plus anonymous health/readiness observations. It contains no newly received partner source files, raw UAT ledgers, patches, simulation, screenshot payloads, account fixtures or private source inventory. Existing historical received files from previously accepted PRs are untouched.

An initial request to push the full documentation intake was rejected by automatic approval review because public egress of partner UAT payloads was not explicitly authorized. This reduced publication scope removes those payloads. The private original ZIPs are available to the user for controlled sharing with the two teams. Publishing them would require a separate explicit decision.
