# Wave and spawn pressure

Reference minute-by-minute Mad Forest enemy mix, spawn rate, cap, special waves and boss table are **unknown**. Any locally authored table is an estimated baseline.

Wave schema: start/end seconds, enemy or weighted mix, spawnRate, spawnPattern, maxAlive, scaling, specials. Boss table uses timestamp, identity, spawnCount, HP/scaling, chest rules. Distinguish active enemy cap, spawn batch/rate and kills/sec. Camera-relative spawn ring should introduce enemies offscreen; do not let view resize change simulation RNG.

Required samples: 0/1/3/5/10/15/20/25/28/29/30/30:01. Record player level, DPS, kills, living/spawned enemies, XP/minute, elite count, chest events, occupancy, projectiles, entity count and update/render frame times. Separate automatic test time-warp from a faithful minute table.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.

## Local baseline snapshot (estimated; not reference)

`reference/implementation_baseline.json` records the authored 30-entry minute table. Local spawn rate is `2 + minute × 0.65` enemies/second, cap `120 + minute × 45`, HP multiplier `1 + minute × 0.12`. Local bosses occur at 60/300/600/900/1200/1500/1740 seconds; local plant rings at 180/600 seconds. These convenient test values have not been verified against Mad Forest. They are P1 fidelity gaps, not measured source values.
