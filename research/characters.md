# Characters

Golden definition: Antonio; starting weapon hypothesis Whip. Expected level-bonus hypothesis: Might increases with level in discrete intervals, capped. Exact initial HP/Might, intervals/cap and all current unlock/cost details are **unverified**.

Required schema: id, localized name, startingWeapon, unlock, cost, baseStats `{maxHealth,moveSpeed,might,armor,recovery,cooldown,area,speed,duration,amount,revival,magnet,luck,growth,greed,curse,charm}`, levelBonuses, modifiers, hiddenBonuses, specialBehaviors, morphRules. Missing original fields remain null/unknown in research; runtime neutral defaults are engineering values.

Research sequence: Antonio stat screen and level bonuses first; then each base-game character, hidden bonuses and overrides; only then special/morph/DLC mechanics. Do not add roster entries with decorative select buttons before implemented behaviours and unlocks work.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
