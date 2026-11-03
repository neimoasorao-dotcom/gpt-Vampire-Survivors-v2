# Graphics, camera and provenance

Current design resolution 960×540, world/display separation and ~22 logical-pixel character height are **engineering estimates**, not reference measurements. Use integer sprite presentation and nearest-neighbour scaling. Original procedural art must preserve role and readability; it does not permit a pixel-perfect fidelity claim.

Required measurements: player/enemy height, collision versus visual bounds, gem size, tile repetition, camera world-width, background luminance, damage text prominence, enemy/projectile/pickup screen occupancy. Crop HUD out of world-density measurements and report bounding-box estimate limitations.

Review checklist: camera too zoomed; player too large; enemies too small; UI too modern; text too large; world too empty; projectiles too sparse; colors too bright; ground too detailed; hits too weak; gems too small; damage numbers too dominant. Compare all requested run times, not only title screen.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
