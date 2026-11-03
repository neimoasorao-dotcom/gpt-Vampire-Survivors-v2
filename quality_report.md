# Quality report — Phase 2 evidence, fidelity unscored

Updated 2026-11-03 (Asia/Tokyo). **Status: expanded engineering build under validation; no final-release designation.** The current code extends the preserved slice rather than replacing it. The user's Phase 2 instruction authorizes this expansion; original-reference qualification remains separate.

## Requested score

Comparative quality remains **unscored / 100**. No identified latest official PC version, original capture set or matching source-run metric baseline is available. A numerical score would imply unsupported measurement. The requested weights are retained below so later scoring can be grounded in evidence.

| Category | Weight | Current evidence | Remaining scoring prerequisite |
| --- | ---: | --- | --- |
| Gameplay fidelity | 25 | Fixed-step/seed/replay checks, two stage timetables, natural multi-build simulations and dedicated real-time harness | Source movement/XP/pressure/build curves, complete unaccelerated result and matching reference runs |
| Combat fidelity | 20 | 14 actual base behaviours, 13 evolution/union results, per-weapon damage/trajectory/timing/condition tests and selected community numeric tables | Original hitboxes, local-unit calibration, TTK/DPS and evolved exceptions at the target patch |
| Systems | 15 | 15 passives, 16 PowerUps, 11 character definitions, purchases/unlocks, Collection, save version 2, event/modifier foundation | Complete official rule/cost verification; actual advanced Arcana/relic/mode systems belong to later scope |
| Visual fidelity | 10 | Original pixel art, Forest/Library geometry, projectile/effect rendering and actual screenshot regression | Original scale/layout/animation/luminance/density capture measurements |
| UI/UX | 10 | Existing Japanese/English UI retained, expanded grids, lab, HUD, real purchase and chest reveal/skip paths | Current final-artifact layout results and measured original navigation/presentation timing |
| Audio | 5 | Original bounded synthesis, weapon-specific events, independent gain buses and unlock/resume tests | Physical listening and original cadence/mix comparison |
| Performance | 5 | Engine pools/grid, actual projectile workload and separate update/render telemetry tools | Current stress results under recorded load; target Windows validation and frame-outlier diagnosis |
| Japanese localization | 5 | Bilingual content/UI and Windows fallback stack; localization/layout checks | Official current names, enemy terminology and Windows font/overflow review |
| Stability | 5 | Save migration/recovery, finite-state checks, transition/evolution regressions and long-run harnesses | Completed current-source normal-speed run and appropriately scoped leak/device/browser evidence |

## Evidence hierarchy

1. `research/phase2_sources.md`, `research/phase2_weapon_facts.json`, `research/phase2_unlocks.md` and `evidence.json` distinguish user specifications, selected community facts and estimates. They do not turn a community commit date into a game patch version.
2. `reports/phase2-unit-console.log` / the current unit test output record local tests. Tests establish the implementation contract, not original correctness.
3. `reports/phase2-browser.json` records exact HTML hash/bytes, real functionality, screenshots, errors, external requests and policy-blocked checks. Source edits after that hash require affected artifact checks again.
4. `reports/phase2-golden-full.json` must contain all seven marks through 29:00 and a completed comparison before strict legacy parity is claimed. It compares the preserved local engine with `legacy:true`, not the original game.
5. `reports/phase2-builds.json` records five normal simulation builds and their actual completion/death outcomes. Meta-upgrade and unlock fixtures must remain explicit. Earlier pre-fix results are preserved separately instead of being silently reported as the current baseline.
6. `reports/phase2-realtime-final.json` is completed normal-speed browser evidence only when it exists with the required duration/outcome; a `*-progress.json` file is still in progress. It is automated play, not human-perceived Game Feel or original balance proof.
7. `reports/phase2-stress.json` / `.md` records actual projectile update/collision/render workloads. Phase 1 synthetic-projectile measurements cannot satisfy this new gate. Linux cloud scheduling and Windows target performance are distinct.

## Current outcome boundary

The code registry now contains 27 weapon definitions (14 base plus 13 evolution/union results), 15 passives, 11 characters, two stages and 16 PowerUps. This is useful scope evidence, not a quality score. Per-weapon damage checks prevent a hidden Whip substitute from satisfying new weapon tests; recipe tests cover missing requirements, replacement and union consumption; modifier and progression tests cover real effects/save data.

No aggregate Phase 2 PASS is assigned while the current real-time run, final unlock integration/artifact regression or original-reference gates are unresolved. Read [phase2_report.md](phase2_report.md) for the recorded milestone and [gap_report.md](gap_report.md) for current P1 evidence gaps. Do not carry Phase 1's limited-content absence forward as if these additions did not exist, and do not carry Phase 1 performance passes forward as proof of all new workloads.

## Next measured iteration

Finish the current-source artifact, Golden, build, normal-speed and stress checks; diagnose failures without disabling assertions or lowering targets. Apply official research access, pin the patch, acquire several reference captures/runs, compare the new weapons/stages/progression, correct measured differences and repeat affected regressions. Score only categories with actual comparison evidence. Full base content, advanced Arcana/relic/mode systems and DLC do not become complete from extension hooks alone.

## Phase 2 measured update

Current local functional checks: 118 unit/integration passes; final HTML 24 passes, 0 failures, 1 policy-blocked file protocol check; UI60/60. Full legacy Golden matched all7actual timestamps. Five natural build fixtures reached30minutes; separate real1x/no-invincibility run reached1802.18s in1870.26wallseconds. Exact artifact hashes and progression fixture limits are documented in phase2_test_report.md.

Renderer profiling identified the enemy phase as the main draw cost. A bounded pre-mirrored cache is used only for scales with proven pixel parity, with the original path retained for other scales. Production32cases and a full heavy frame had0changedpixels. Isolated real-projectile stress retained1500enemies plus257projectiles/400XP/600particles at50.90FPS with0CPU/RAFstalls>100ms. The strictE p95RAF33.4ms≤33.33ms flag is false and has not been waived. Fidelity remains unscored/100 because latest official PC identity and original gameplay/visual measurements remain unavailable.
