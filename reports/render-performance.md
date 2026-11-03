# Render + simulation stress measurements

Date: 2026-11-03T03:18:43.400Z
Browser: 154.0.8037.57; cloud Linux, 1920×1080 CSS viewport; logical 960×540.

150 RAF frames per scenario after 30 RAF warmup frames. CPU times are draw submission + update; RAF interval includes actual browser scheduling. No Windows hardware guarantee. Shared-instance CPU contention can affect results; do not infer scaling from a single noisy run. All scenarios use the real Engine and Renderer. D adds 500 synthetic persistent projectiles; E adds 400 XP and 600 synthetic persistent particles.

| Scenario | Enemies | RAF FPS | Update p95 ms | Render p95 ms | CPU p95 ms | CPU max ms | Enemy bounding-box coverage proxy |
|---|---:|---:|---:|---:|---:|---:|---:|
| A | 500 | 60.0 | 0.90 | 2.90 | 3.80 | 5.40 | 24.3% |
| B | 1000 | 60.0 | 0.90 | 4.60 | 5.30 | 11.80 | 47.6% |
| C | 1500 | 58.1 | 2.20 | 9.50 | 11.40 | 16.10 | 61.1% |
| D | 1000 | 58.4 | 1.20 | 9.10 | 10.10 | 14.30 | 47.6% |
| E | 1500 | 60.0 | 1.20 | 7.00 | 7.90 | 12.90 | 61.1% |

Density is clipped geometric union of approximate sprite bounding rectangles, not opaque sprite pixels, screenshot segmentation, or an original-game reference comparison. Reference density remains unmeasured.

Raw p50/p95/max, memory observations, entity counts, snapshots, console errors, and coverage measures: [render-performance.json](render-performance.json). Screenshots: stress-A-1920.png through stress-E-1920.png. Memory before/after is a brief observation, not a leak finding.

Console errors: 0. Target high-density minimum: 30 FPS; no thresholds were relaxed.
