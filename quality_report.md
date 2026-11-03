# Quality report — measured engineering progress, fidelity unscored

Iteration date: 2026-11-03 (Asia/Tokyo). **Status: development baseline; final-release gate failed/open.** The single-file build exists and local automated checks exercise real gameplay paths. It must not be described as a complete or fidelity-qualified Vampire Survivors reconstruction.

## Score rubric and evidence

Requested total: **100 points**. Current comparative quality score: **unscored / 100**. Giving a numerical fidelity score without an identified target version, source captures or source-run metrics would create unsupported precision. The table retains the requested weights and identifies the evidence needed for scoring. It is not a self-awarded substitute for comparison.

| Category | Weight | Current evidence | Remaining scoring blocker |
| --- | ---: | --- | --- |
| Gameplay fidelity | 25 | Fixed-step seed/replay tests; movement normalization; authored 30-minute waves; multiple-seed natural/assisted telemetry | Original speed/pressure/XP curve unknown; ordinary survival must not be inferred from invincibility-assisted runs |
| Combat fidelity | 20 | Actual directional Whip sweep/opposite strike, target exclusion, upgrades, eligible evolution, lab metrics | Original reach/timing/level/crit/heal tables and TTK unverified; other weapon behaviours absent |
| Systems | 15 | Versioned checksum/backup save, local powerups, collection, level choices, one evolution | Arcana/Darkana, substantial base unlock content, relics/modes/exception recipes absent |
| Visual fidelity | 10 | Original pixel sprites/terrain, real run/transition screenshots and density proxy | No original capture dimensions, luminance or occupancy to compare |
| UI/UX | 10 | Functional golden-slice menus, HUD, level/chest/pause/results; screenshot suite | Major full-game screens/content and measured original layout/timing unavailable |
| Audio | 5 | Original WebAudio music/effects, gain buses, unlock/suspend/voice-limit tests | Original cadence/mix comparison absent; physical audibility not verified by API state alone |
| Performance | 5 | Real browser renderer+engine stress and separate Node update timings | Windows hardware untested; average RAF FPS does not prove every dense frame meets 30 FPS; real projectile workload absent |
| Japanese localization | 5 | Japanese/English UI and Windows fallback stack; browser switch tests | Official current terminology, native Windows font/overflow review pending |
| Stability | 5 | Determinism, transition, invalid-save, XP conservation, input/audio tests and long-run harness | Actual current run results must be read; assisted accelerated soak is not real-time Windows/audio/listener leak proof |

## Verification evidence and limits

- Automated unit/integration source: `tests/engine.test.mjs`, `tests/services.test.mjs`, `tests/replay.test.mjs`. Test counts and actual pass/fail outcomes are reported by the final current run in `test_report.md`; this report does not assume unexecuted test success.
- Final HTML browser test: `tools/browser-test.mjs` → `reports/browser-results.json`. It records actual artifact bytes, protocol, checks, errors, external requests and screenshots. The first file:// attempt was rejected by the managed browser policy; use the refreshed report for the final outcome. Do not equate that network-policy error with application boot failure over HTTP.
- Screenshot evidence: `reports/screenshots/` contains actual rendered menus/transitions and golden run time captures; no original-game reference screenshots are currently present. Golden accelerated captures must state assistance and cannot prove ordinary survival.
- Simulation metrics: `tools/benchmark.mjs` → `reports/benchmark.json`, per-seed telemetry, `benchmark_results.md`, `performance_report.md`. Natural and assisted runs are separated, and distributions include variance. Read run completion/outcome rather than counting requested duration as completed.
- Render metrics: `reports/render-performance.json` / `.md` record actual entity counts, update/render duration, RAF scheduling and geometric coverage proxy. They are Linux cloud browser observations, not a Windows FPS guarantee. Synthetic projectile/particle stress does not establish real projectile behaviour.
- Reference evidence: `research/access_log.json` records five failed requests; `evidence.json` indexes hypotheses. `reference_target.md` intentionally keeps target version unknown. Numerical original-game correctness and screenshot similarity are therefore unscored.

## Release gate

The requested P0=0/P1=0 final gate is **not met**. `gap_report.md` records significant missing base content/systems and comparison blockers. The golden vertical-slice engineering build is useful for testing, but its reference gameplay gate remains open; expansion must not erase that distinction. No RC1/final badge is assigned.

## Re-measurement sequence

Apply research access configuration → identify version/hotfix → acquire multiple documented reference runs/captures → compare movement/Whip/waves/XP/chests → fix measured gaps → rerun current tests, golden seeds, density stress and 60-minute soak → score each category only against cited evidence → expand content after slice gate. Any later code change invalidates affected artifact measurements until rebuilt/retested.

## Completed local correction cycles

[Iteration evidence](reports/iteration-log.json) records the fixed-clock, consumed-base evolution, endless cycle boundary, lab-density hang, Clover reward, options-return and audio-event defects and their regressions. Current functional outcome: 37 unit/integration passes; final HTML 20 passes, 0 failures and 1 policy-blocked file check; 60 UI layout/navigation checks. These counts are implementation evidence, not original-reference fidelity.

Five natural bot runs ended at 325.85–755.90 seconds. Five invincibility-assisted runs reached 1801 seconds, and an assisted endless soak reached 3601 seconds. See benchmark_results.md; assistance is not a gameplay survival pass. Isolated Linux Chromium render stress retained all 1500 enemies and measured 58.05 FPS (CPU p95 11.4ms); detailed results and synthetic projectile limitations are in reports/render-performance.md. Windows and physical-controller validation remain outstanding.
