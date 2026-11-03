# Performance evidence

Measured 2026-11-03T03:12:26.520Z on INTEL(R) XEON(R) PLATINUM 8573C, Linux x64, Node v24.19.0. Fixed 60 Hz. Engine SHA256 4fc33cac7228328cd783f619bc0ab3693317dc784669d3dbe082cbfab4409557. Natural/assisted/soak simulations ran with three worker threads; stress and DPS below ran serially after workers finished. Concurrent-run timings include scheduling contention.

## Simulation stress

| Test | Actual enemies | Pickups | Projectile array | Update mean ms | p95 ms | p99 ms | Max ms | >100ms steps |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 500 | 0 | 0 | 0.33 | 0.91 | 1.59 | 3.88 | 0 |
| B | 1000 | 0 | 0 | 0.85 | 1.81 | 2.74 | 4.20 | 0 |
| C | 1500 | 0 | 0 | 3.23 | 5.33 | 7.57 | 10.79 | 0 |
| D | 1000 | 0 | 1500 | 1.62 | 2.67 | 3.61 | 5.92 | 0 |
| E | 1000 | 400 | 0 | 2.61 | 4.62 | 16.10 | 132.85 | 3 |

D contains 1500 synthetic retained projectiles; there is no projectile update behavior in the Whip slice. D does **not** pass the requested combined weapon-projectile stress gate. Browser rendering stress is reported separately if available. E continually injects pooled particles and contains capped XP. No enemy counts were reduced for performance. Engine configured maximum is 2500; explicit stress peak is 1500.

Simulation timings exclude render, audio, input and compositor. These values cannot be called FPS or prove Windows 60 FPS. Target remains 60 FPS normal, at least 30 FPS dense.

## 60-minute assisted endless soak

Reached 3601s; level 123; 38680 kills. Requested duration completed. State playing. Update p95 3.71ms, max 214.99ms; >100ms steps 30. Invincibility was enabled; no normal-survival claim. Finite-state assertion completed.

- 300.00s: heap 8.79 MiB; live {"enemies":176,"pickups":98,"effects":1,"texts":41,"particles":242}; pools {"enemies":114,"pickups":138,"effects":3,"texts":20,"particles":124}; replay 17988; telemetry 11.
- 600.00s: heap 11.06 MiB; live {"enemies":407,"pickups":403,"effects":2,"texts":52,"particles":128}; pools {"enemies":13,"pickups":2,"effects":2,"texts":68,"particles":249}; replay 35947; telemetry 21.
- 900.00s: heap 11.75 MiB; live {"enemies":187,"pickups":406,"effects":1,"texts":12,"particles":6}; pools {"enemies":382,"pickups":0,"effects":3,"texts":108,"particles":508}; replay 53858; telemetry 31.
- 1200.00s: heap 13.31 MiB; live {"enemies":308,"pickups":403,"effects":1,"texts":34,"particles":42}; pools {"enemies":261,"pickups":4,"effects":3,"texts":86,"particles":494}; replay 71832; telemetry 41.
- 1500.00s: heap 15.91 MiB; live {"enemies":1145,"pickups":407,"effects":1,"texts":9,"particles":10}; pools {"enemies":0,"pickups":0,"effects":3,"texts":111,"particles":590}; replay 89819; telemetry 51.
- 1800.00s: heap 17.80 MiB; live {"enemies":1391,"pickups":415,"effects":1,"texts":77,"particles":48}; pools {"enemies":17,"pickups":4,"effects":3,"texts":43,"particles":552}; replay 107806; telemetry 61.
- 2100.00s: heap 20.15 MiB; live {"enemies":127,"pickups":151,"effects":1,"texts":6,"particles":6}; pools {"enemies":1281,"pickups":268,"effects":3,"texts":114,"particles":594}; replay 125672; telemetry 71.
- 2400.00s: heap 21.68 MiB; live {"enemies":190,"pickups":398,"effects":1,"texts":18,"particles":28}; pools {"enemies":1218,"pickups":21,"effects":3,"texts":102,"particles":572}; replay 143573; telemetry 81.
- 2700.00s: heap 23.20 MiB; live {"enemies":269,"pickups":410,"effects":1,"texts":3,"particles":12}; pools {"enemies":1139,"pickups":9,"effects":3,"texts":117,"particles":588}; replay 161487; telemetry 91.
- 3000.00s: heap 26.05 MiB; live {"enemies":269,"pickups":411,"effects":1,"texts":18,"particles":66}; pools {"enemies":1139,"pickups":8,"effects":3,"texts":102,"particles":534}; replay 179348; telemetry 101.
- 3300.00s: heap 27.59 MiB; live {"enemies":927,"pickups":407,"effects":1,"texts":61,"particles":138}; pools {"enemies":481,"pickups":12,"effects":3,"texts":59,"particles":462}; replay 197326; telemetry 111.
- 3600.00s: heap 29.14 MiB; live {"enemies":1425,"pickups":412,"effects":1,"texts":5,"particles":4}; pools {"enemies":0,"pickups":7,"effects":3,"texts":115,"particles":596}; replay 215311; telemetry 121.

Forced GC for snapshots: true. Heap snapshots include the benchmark harness; live/pool counters are the primary retention evidence. Pool/replay retention counts provide leak screening, not a heap-retainer proof. No browser WebAudio or event-listener leak claim follows from this Node soak.

## Browser rendering evidence

Browser measurements are stored in [reports/render-performance.json](reports/render-performance.json). Shared-resource preliminary measurements are superseded by the final isolated rendering run when its timestamp/hash are recorded. These are Linux Chromium measurements, not Windows PC validation.

## Long-frame finding

Stress E recorded three simulation steps above 100 ms (maximum 132.85 ms). The concurrent soak recorded 30 above 100 ms (maximum 214.99 ms). CPU scheduling and garbage collection have not yet been separated; the no-long-freeze target is not passed by these observations. The p95 figures must not conceal these outliers.

## Final isolated browser rendering run

Raw evidence: [reports/render-performance.json](reports/render-performance.json), measured 2026-11-03T03:18:43.400Z. Headless Chromium 154.0.8037.57 on Linux, 1920×1080 viewport / 960×540 logical canvas. Other project simulation workers were stopped. Each scenario sampled 150 RAF frames after warmup; short stress evidence does not replace a long rendered soak.

| Scenario | Actual enemies | Observed FPS | Combined CPU p95 ms | CPU max ms | RAF >100ms |
|---|---:|---:|---:|---:|---:|
| A | 500 | 60.00 | 3.80 | 5.40 | 0 |
| B | 1000 | 60.00 | 5.30 | 11.80 | 0 |
| C | 1500 | 58.05 | 11.40 | 16.10 | 0 |
| D | 1000 | 58.43 | 10.10 | 14.30 | 0 |
| E | 1500 | 60.00 | 7.90 | 12.90 | 0 |

E retained 1500 enemies, 397 XP pickups and 600 synthetic particles. D retained 1000 enemies plus 500 synthetic projectiles; it validates drawing load rather than unimplemented projectile gameplay. Browser errors: 0. Hardware memory readings are coarse browser estimates, not a heap-retention proof.

## Isolated Node E diagnosis

The engine was unchanged throughout these measurements (SHA256 4fc33cac7228328cd783f619bc0ab3693317dc784669d3dbe082cbfab4409557). Sources: [first isolated result](reports/stress-isolated-first.json), [CPU-instrumented result](reports/stress-isolated.json), and corresponding GC trace logs. Each measured 3600 simulation steps (60 seconds) after 10 seconds warmup, 1000 enemies and 400 XP pickups, injecting pooled particles every half-second.

- First isolated run: update p95 3.84 ms, max 263.87 ms, 3 above 100 ms; GC event maximum 9.87 ms.
- Second isolated run with process CPU instrumentation: p95 5.05 ms, max 45.02 ms, 0 above 100 ms; GC event maximum 10.93 ms. At the maximum wall-time step, process CPU was 89.28 ms including V8 background threads.

The first isolated long frames were not explained by the observed GC pause duration. The second run did not reproduce >100 ms frames. Scheduling, background V8 work and VM effects remain hypotheses; no engine fix or definitive cause is claimed. Historical long-frame findings remain open. The final short browser run met the frame-rate target on this Linux host, while Windows performance and a long rendered no-freeze guarantee remain unverified.

## Phase 2 final actual-projectile/browser evidence

The earlier synthetic-projectile limitation is superseded for the new representative weapon system by reports/phase2-stress.json/md. After other test browsers stopped, current cached Renderer measured A50060.00FPS, B100060.00FPS, C150059.34FPS, D1000+259realprojectiles56.53FPS and E1500+257realprojectiles+400XP+600particles50.90FPS. Enemy counts were retained, actual WeaponSystem hits were exercised, finite checks passed and all five cases had0CPU/RAF intervals>100ms. CPU p95 values3.5/6.5/9.5/13.0/15.0ms. E RAFp9533.4ms fails the unchanged strict33.33ms flag; no stable-target or Windows certification is inferred.

Profiling evidence: reports/phase2-render-profile.json/md and reports/phase2-flip-cache.json. Bounded pre-mirror caching uses only proven scales1/1.2/2 and the original path for unsupported scales.32production conditions and a whole dense frame are pixel-identical. Sequential traced enemy-phase mean11.089→6.768ms and total draw16.034→10.913ms are diagnostic comparisons with order/tracing caveats, not an isolated causal guarantee for every device. Prior shared-load outliers remain retained in reports.
