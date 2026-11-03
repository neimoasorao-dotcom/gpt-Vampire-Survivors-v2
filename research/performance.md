# Performance and resource validation

Targets from user requirements: 60 FPS normal; stable >=30 FPS high-density; no logic break under extreme stress. Actual Linux Chromium/headless timing cannot prove performance on an unspecified ordinary Windows PC.

Stress matrix: A 500 enemies; B 1000; C 1500; D 1000 plus projectiles; E XP/enemies/particles. Do not remove required enemies for FPS. Measure median/p95/p99 update/render/frame time, peak live entities, growth over 60-minute equivalent and approximate memory. Note rendering backend and whether real-time or accelerated simulation.

Profiling order: broad-phase query algorithm; allocation/pooling; rendering batching/cache; only then optional presentation settings. Sim-only CPU duration must never be presented as rendered FPS. Max-live counts are engineering constraints requiring reference validation. Browser console errors, NaN/Infinity and failed storage operations must remain observable.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
