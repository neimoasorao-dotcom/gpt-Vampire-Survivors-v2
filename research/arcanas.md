# Arcana and Darkana

Current full catalogue, unlock/relic requirements, names, slot timing and Darkana rules are **unknown**. Architecture support is not implementation evidence.

Modifier architecture must support onAttack, onProjectileCreate, onHit, onKill, onCrit, onHeal, onPickup, onLevelUp, onDamageTaken, onWeaponTick and onEnemyDeath. Event payloads require stable IDs, source weapon, target and base/final values; avoid recursive heal/damage triggers without guards.

Before enabling a named Arcana, capture its official effect, affected weapons/stat groups, interactions and unlock; test it independently and with evolution. A menu alone cannot pass this feature. Current scope remains gated behind golden slice fidelity.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
