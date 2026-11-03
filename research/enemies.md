# Enemies

Enemy schema: id/name, HP, contactDamage, speed, scale, radius/hitbox, knockback/freeze/debuff resistance, XP, spawnWeight/rules, movementBehaviour, animation, boss flag, special attack/death and time scaling. Original numeric tables are **unknown**.

Provisional groups for visual/logic testing: fragile bats, walking skeletons, tougher ghouls, large late enemies, boss elites and terminal Reaper. These groups do not establish the correct original names or minute table.

Measure sprite pixel height and world collision radius separately. Density correction should reduce unnatural separation without introducing tactical flanking AI. Sample movement and knockback under fixed character speed. Boss tests must cover HP scaling, guaranteed or conditional chest, special mechanics and kill reward.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
