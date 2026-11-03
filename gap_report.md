# Gap report — not a release candidate

Updated 2026-11-03 (Asia/Tokyo). This document distinguishes an observed defect, missing functionality and unavailable comparison evidence. No unavailable comparison is marked passed. Original reference target remains unknown.

## Release-blocking differences and evidence gaps

| ID | Severity | Gap and evidence | Next verifiable action |
| --- | --- | --- | --- |
| REF-001 | P1 | Latest stable PC version/hotfix/DLC catalogue not identified; five official/community requests returned tunnel 403. `research/access_log.json`. | Apply requested research-domain configuration, fetch official chronology, freeze target and hotfix before fidelity judgement. |
| REF-002 | P1 | No original screenshots or gameplay frame measurements; movement, sprite/camera/UI scale, chest timing and density differences cannot be calculated. `reference/measurement_protocol.md`. | Acquire multiple lawful reference runs/captures with patch, character, powerups and mode metadata; perform timed/spatial comparison. |
| GAME-001 | P1 | Mad Forest wave rates, caps, enemy statistics, boss timestamps and pickup coordinates are authored estimates. `src/data/content.js`, `research/waves.md`. | Replace with source-supported tables, rerun all seeds and compare pressure/XP time series. |
| GAME-002 | P1 | Whip reach, shape, cooldown/level table, Bloody Tear critical/healing and XP thresholds have no acquired current-version evidence. `evidence.json`, `estimated_values.md`. | Verify/measure each independently; compare 30-second target bench and TTK, then timed runs. |
| GAME-003 | P1 | Ordinary 30-minute survival/pacing is not established by assisted runs; invincibility is explicitly enabled for continuity/soak. Natural deterministic bot outcomes are separate in `reports/benchmark.json`. | Diagnose natural progression against reference builds/routes. Do not count assisted survival as gameplay fidelity. |
| CONTENT-001 | P1 | Only Antonio, Whip/Bloody Tear, one authored Forest and nine passives are implemented. Other base weapons/characters/stages are absent. | Pass golden slice fidelity gate first, then expand by researched behaviour/data and per-feature tests. |
| SYSTEM-001 | P1 | Arcana/Darkana modifier catalogue and selection, relic routes, substantial character/stage unlock progression, Hyper/Hurry/Inverse/Limit Break and current secrets are absent. | Implement researched base systems after golden gate; architecture hooks or progress labels do not constitute these systems. |
| CHEST-001 | P1 | Chest probabilities/reward timeline/skip/reveal are not measured; current local presentation does not establish full original chest behaviour. Evolution exceptions/unions/gifts/morphs are not implemented recipes. | Acquire frame evidence and exception tables; test actual rewards and slot consumption per rule. |
| PICKUP-001 | P2 | Little Clover now adds an estimated +0.1 Luck for the run and persists through stat recomputation; original effect/duration and all drop probabilities remain unverified. The prior erroneous coin grant was fixed with regression coverage. | Verify magnitude and lifetime against acquired sources; preserve regression. |
| STAGE-001 | P1 | Stage obstacle geometry, exact ground-item rules, secrets and special mechanics are absent or estimated; local infinite field is not verified Mad Forest map behaviour. | Acquire stage structure and pickup/slot exceptions; test travel and collisions. |
| PERF-001 | P1 | 60 FPS normal and stable >=30 FPS dense on ordinary Windows hardware are not established by cloud Linux measurements. Concurrent samples recorded >100ms spikes; isolated browser rerun had none and retained all 1500 enemies at 58.05 FPS. Node soak outliers and target-hardware uncertainty remain; see latest reports. | Profile measured stalls/cache warmup, retain original counts, measure update/render/RAF separately; validate target hardware. |
| PERF-002 | P1 | Stress D has synthetic retained projectiles, not a real many-projectile weapon/update workload. | Implement researched projectile behaviours after slice gate, then stress combined collision/render/update. |
| PLATFORM-001 | P1 evidence gap | Actual Windows stable Chrome and physical gamepad are untested; synthetic Gamepad API only. Managed Chromium initially rejected file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; current browser report owns latest result. | Test final file on permitted browser and target Windows/gamepad; distinguish policy rejection from code defect. |
| VISUAL-001 | P2 | Original procedural art/music are lawful local assets but source scale, animation timing, luminance and audio hierarchy remain unmeasured. | Compare roles/size/cadence using original assets, not protected asset extraction or raw-pixel scores. |
| I18N-001 | P2 | Functional Japanese/English labels exist, but official Japanese terms/font metrics are not cross-checked. App import-error fallback was moved to central copy data. | Review official Japanese captures; move remaining app messages to localization; inspect Windows fallback/overflow. |

## Observed critical issues

No current P0 is asserted solely from missing reference evidence. Passing local smoke tests does not establish P0=0 across the unimplemented full scope. Read the latest `test_report.md` and `reports/browser-results.json` for actual failing checks; stale first-run results must not override a later rerun.

## Priority order

Resolve source access/version/captures; tune golden loop/movement/Whip and waves/XP; verify evolution/chest/stage; rerun deterministic regressions and long-run metrics; only then expand base content and meta systems. UI/art/audio refinement follows measured functional gaps. No current RC/final-release designation is warranted.

## Required external prerequisite

Research domains were saved to the environment configuration draft, not applied to the running machine. Review/save those network changes in environment settings and publish the environment when appropriate; then retry the exact failed source requests. Merely saving the draft does not prove the blocker resolved. No secret or token is requested.
