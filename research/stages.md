# Stages

Mad Forest is the golden stage. Current exact map, obstacle collision, stage item coordinates, secrets, events, music and boundary behaviour are **unknown**. Procedural original terrain is an engineering asset and cannot count as visual comparison evidence.

StageDefinition fields: environment, map/tiles, obstacles, stagePickups, waveTable, bossTable, music, duration, modifiers, secrets, events, boundary, specialMechanics, evolutionOverrides. Keep stage rules separate from renderer art. Benchmark stage must remain one definition until its gate passes.

Capture the horizon-free top-down ground, tree clusters, repeated tile scale and pickup visibility. Verify looping/map-boundary behaviour through travel measurements rather than assuming infinite space.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
