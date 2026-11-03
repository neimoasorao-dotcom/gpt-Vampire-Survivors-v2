# Phase 2 actual weapon stress

Measured 2026-11-03T09:19:39.011Z, 154.0.8037.57, cloud Linux. CSS1920×1080, logical960×540;60 RAF warmup+180 sampled frames per case. Other test processes/real-time runs share this instance. This is no Windows performance guarantee.

| Case | Actual enemies | Peak live projectiles | Created during sample | Hits during sample | RAF FPS | Update p95 ms | Render p95 ms | CPU p95 ms | CPU max ms |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 500 | 0 | 0 | 57 | 60.00 | 1.30 | 2.40 | 3.50 | 7.60 |
| B | 1000 | 0 | 0 | 117 | 60.00 | 1.40 | 5.30 | 6.50 | 13.90 |
| C | 1500 | 0 | 0 | 179 | 59.34 | 2.20 | 8.40 | 9.50 | 16.10 |
| D | 1000 | 259 | 481 | 13273 | 56.53 | 6.30 | 8.30 | 13.00 | 32.80 |
| E | 1500 | 257 | 516 | 20495 | 50.90 | 6.40 | 9.00 | 15.00 | 30.10 |

A/B/C preserve baseline Whip at500/1000/1500 moving enemies. D equips HolyWand,ThousandEdge,DeathSpiral,UnholyVespers,Hellfire,NOFUTURE against1000 enemies. E combines the same actual weapon systems with1500 enemies,400 XP gems and pooled particle generation. D/E apply explicit laboratory stress modifiers Amount+12, Cooldown×0.3, Duration×2 and Area×1.1 to produce a dense actual-projectile workload. These are stress fixtures, not ordinary-build balance claims. Both projectile movement and collision are executed; these are not retained synthetic render objects. All enemies receive1e9 HP after initialization and before warmup, avoiding deaths without reducing requested counts. Invincibility is a load-stability fixture and not survival evidence.

The minimum dense target remains30FPS. MeanFPS, p95RAFinterval≤33.33ms and absence of100msstalls are separate observations in the raw report; a passing mean does not establish stable30FPS. Sample flags under shared cloud scheduling are not release certification. CPU/RAF outliers, spatial checks, weapon damage, generated counts, finite-state checks, hashes and short heap observations are retained in [phase2-stress.json](phase2-stress.json). Console errors:0; external requests:0; source files changed during measurement:0.

This harness bundles current source independently. Recorded distribution artifact metadata:213550bytes SHA256`1c7c62aa12966b1da99b82bd3f9e478ad9566c5993d50d0cf13d4b5f6f2e6ce8`. The distribution itself must still pass its separate browser smoke.

## Stability observations

| Case | RAF p95 ms | CPU frames >100ms | RAF intervals >100ms | Mean ≥30FPS | RAF p95 ≤33.33ms |
|---|---:|---:|---:|---|---|
| A | 16.70 | 0 | 0 | yes | yes |
| B | 16.70 | 0 | 0 | yes | yes |
| C | 16.80 | 0 | 0 | yes | yes |
| D | 16.80 | 0 | 0 | yes | yes |
| E | 33.40 | 0 | 0 | yes | no |

E peak measured CPU sample: {"index":155,"updateMs":9.199999999254942,"renderMs":20.900000002235174,"cpuMs":30.100000001490116,"rafMs":16.700000000000728,"projectiles":241,"drawCalls":2973,"rotationEntriesBefore":48,"rotationEntriesAfter":48}. A passing mean does not establish stable30FPS; inspect RAF quantiles and stalls. Source-cache observations and shared scheduling do not establish a root cause. Thresholds remain unchanged.
