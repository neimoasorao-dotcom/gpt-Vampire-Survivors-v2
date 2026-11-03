# Measured simulation results

Generated 2026-11-03T03:12:26.520Z. Raw evidence: [reports/benchmark.json](reports/benchmark.json), telemetry per seed, [golden run](reports/golden_run.json). Linux v24.19.0; three concurrent simulation workers (wall-clock timing includes CPU scheduling). Engine SHA256 4fc33cac7228328cd783f619bc0ab3693317dc784669d3dbe082cbfab4409557. no original-game baseline was accessible. No fidelity pass is claimed.

## Natural deterministic bot, no invincibility

| Seed | Time (s) | Level | Kills | Chests | Evolution (s) | Outcome | Update p95 ms |
|---|---:|---:|---:|---:|---|---|---:|
| 149 | 589.67 | 22 | 2151 | 1 | none | dead | 1.09 |
| 271 | 380.52 | 10 | 828 | 0 | none | dead | 1.07 |
| 419 | 755.90 | 26 | 3325 | 2 | none | dead | 1.50 |
| 587 | 325.85 | 8 | 535 | 0 | none | dead | 0.60 |
| 733 | 453.40 | 7 | 664 | 0 | none | dead | 0.76 |

Natural runs surviving requested time: 0/5. Bot performance does not prove that human play can or cannot survive.

## Assisted continuity runs, invincibility enabled

| Seed | Time (s) | Level | Kills | Chests | Evolution (s) | Outcome | Update p95 ms |
|---|---:|---:|---:|---:|---|---|---:|
| 149 | 1801.00 | 64 | 18942 | 5 | 828.2666666666667 | playing | 3.26 |
| 271 | 1801.00 | 84 | 18613 | 5 | 853.2166666666667 | playing | 3.76 |
| 419 | 1801.00 | 83 | 17506 | 6 | 967.8333333333334 | playing | 2.65 |
| 587 | 1801.00 | 30 | 16842 | 5 | 747.9833333333333 | playing | 3.98 |
| 733 | 1801.00 | 82 | 17806 | 4 | 868.0166666666667 | playing | 2.00 |

Assisted runs reaching 30:01: 5/5. Assistance affects damage/survival; these are stability runs, not legitimate survival runs. Snapshots include 00:30, 01:00, 03:00, 05:00, 10:00, 15:00, 20:00, 25:00, 28:00, 29:00, 30:00, 30:01.

## Distribution

Population variance is used (five deterministic seeds, not a player population).

| Mode / metric | Mean | Median | Min | Max | Variance |
|---|---:|---:|---:|---:|---:|
| natural / time | 501.07 | 453.40 | 325.85 | 755.90 | 24059.01 |
| natural / level | 14.60 | 10.00 | 7.00 | 26.00 | 61.44 |
| natural / kills | 1500.60 | 828.00 | 535.00 | 3325.00 | 1167225.84 |
| natural / damage | 106612.80 | 37246.00 | 18236.00 | 316708.00 | 12886920341.36 |
| natural / gold | 69.80 | 27.00 | 24.00 | 195.00 | 4294.96 |
| natural / chests | 0.60 | 0.00 | 0.00 | 2.00 | 0.64 |
| assisted / time | 1801.00 | 1801.00 | 1801.00 | 1801.00 | 0.00 |
| assisted / level | 68.60 | 82.00 | 30.00 | 84.00 | 427.04 |
| assisted / kills | 17941.80 | 17806.00 | 16842.00 | 18942.00 | 573766.56 |
| assisted / damage | 5483626.80 | 5461432.00 | 5253298.00 | 5890733.00 | 47997988558.16 |
| assisted / gold | 1315.20 | 1515.00 | 396.00 | 1851.00 | 274238.56 |
| assisted / chests | 5.00 | 5.00 | 4.00 | 6.00 | 0.40 |

## Weapon laboratory

| Weapon | Level | DPS | Attacks/min | Hits | Max range |
|---|---:|---:|---:|---:|---:|
| whip | 1 | 184.00 | 46 | 552 | 95.00 |
| whip | 2 | 360.00 | 46 | 1080 | 95.00 |
| whip | 3 | 540.00 | 46 | 1080 | 95.00 |
| whip | 4 | 720.00 | 46 | 1080 | 104.50 |
| whip | 5 | 900.00 | 46 | 1080 | 104.50 |
| whip | 6 | 1080.00 | 46 | 1080 | 114.00 |
| whip | 7 | 1260.00 | 46 | 1080 | 114.00 |
| whip | 8 | 1440.00 | 46 | 1080 | 123.50 |
| bloody | 1 | 2108.00 | 60 | 1440 | 123.50 |

Stationary 40-target 30-second tests, knockback disabled; implementations only. Source-game TTK/DPS still unknown.

## Comparison gate

Reference level, kills, movement, chest timing, scale and density measurements are unknown because source access was denied. Numerical fidelity differences cannot yet be calculated. Expansion gate remains blocked.

## Baseline maintenance

This is the initial current-source Golden implementation baseline, not an original-game reference. Future `npm run benchmark` calls retain `reports/golden_run.json`, write current metrics and a diff, and return a failure status for unaccepted metric differences. `--accept-golden` explicitly accepts an intentional update. Pre-fix evidence remains explicitly superseded in `reports/golden_run_superseded_pre_fixes.json`.
