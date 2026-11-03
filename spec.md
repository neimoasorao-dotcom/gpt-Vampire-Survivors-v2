# Phase 2 specification and reference boundary

Updated 2026-11-03 (Asia/Tokyo). This specification describes the current engineering target and its tests. It does not establish a latest-PC patch or a fidelity-qualified release.

## Product and preserved baseline

The deliverable is `dist/vampire_survivors.html`, also copied to the repository root. HTML, CSS, JavaScript, content data and original procedural graphics/audio are inline. Runtime network requests are prohibited by CSP. Development source remains modular. Target platforms are Windows 10/11 stable Chrome, 1920×1080 primary, with 1366×768 and 2560×1440 layout checks. Linux Chromium evidence is scoped to that browser; managed `file://` refusal remains distinct from application failure.

The prior Antonio + Whip + Mad Forest implementation is preserved at `golden-vslice-v1`. Phase 2 was explicitly authorized by the user's expansion instruction despite unresolved original-reference comparison. `Engine({legacy:true})` retains the prior item pool, wave/spawn path, player bot and Whip RNG behaviour for regression. New-player progression and the normal Phase 2 pool intentionally differ from that fixture.

## Content and behaviour

| Area | Current code scope | Reference qualification |
| --- | --- | --- |
| Weapons | 14 representative base weapons; 12 evolved weapons and Vandalier union result | Community observations and user-provided behaviour descriptions; local units and unobserved details remain estimated |
| Behaviour families | Horizontal melee sweep; nearest-target bolts; direction-following knives; ballistic axes; returning crosses; orbit books; random fireballs; persistent aura; ground pools; viewport ricochet; targeted lightning; screen erasure; clockwise/counterclockwise bombardment | Algorithms are separate; shared collision/pooling must not turn them into sprite-only substitutions |
| Passives | 15 definitions with level caps and centralized stats | Numerical/source verification is per property, not inferred from test success |
| Evolutions | 13 rule-based recipes including two-weapon consumption and freed slot for Vandalier | Relationship mappings are community cross-checks; full stage/character exceptions, Gifts and Morphs are not a complete catalogue |
| Characters | Antonio, Imelda, Pasqualina, Gennaro, Arca, Porta, Lama, Poe, Clerici, Dommario, Krochi | Data includes starting weapon, stats, bonuses, special modifiers, unlock and cost; current-PC official validation remains open |
| Stages | Mad Forest and Inlaid Library | Selected community minute tables and boss chest flags are used; exact map geometry, world scale and enemy numeric stats remain unverified |
| Meta | Gold, purchases, character/stage/weapon unlock evidence, 16 PowerUps, discovered/undiscovered Collection, version 2 save | Rule evaluations require real saved run evidence; QA unlock fixtures are explicit |

## Simulation and combat contracts

The engine advances at exactly 60 Hz and rejects other step sizes. Simulation RNG is seed-owned and independent of rendering/audio. Input direction is normalized; world and camera coordinates are separate. Level-up/chest/pause/results stop ordinary simulation. The QA auto-menu path may resolve transitions automatically and must be identified as such.

Projectile behaviours share bounded pooling and broad-phase collision but implement their own movement, targeting, re-hit timing and lifetime. Weapon Laboratory isolates requested equipment rather than silently substituting Whip. Metrics include own-weapon damage, DPS, hits, attacks, projectiles, range and target distribution. Enemy, pickup, particle and numerical-text state must remain finite and bounded.

Whip timing and the old seeded run must remain unchanged in legacy regression. Current normal-mode changes include the expanded pool, reconstructed source Wave tables and a QA bot that can seek XP and avoid threats across different builds. Bot success is neither human Game Feel evidence nor original-game balance proof.

## Stats and modifier contracts

Compute base character stats, character level bonuses/special modifiers, purchased PowerUps, passives, stage modifiers, Arcana-layer modifiers and temporary/other modifiers in explicit order. Operations can add, multiply or set values; caps and max-health percentage rules remain centralized. Temporary modifiers expire during simulation without requiring another level-up.

`ModifierBus` supplies registration/unsubscribe, expiry and combat hooks. This is an Arcana-capable foundation, not an implemented Arcana/Darkana catalogue or selection screen. Event hooks must be exercised with real gameplay payloads before claiming a particular Arcana effect.

## Inventory, upgrade and evolution contracts

Normal upgrade candidates respect six weapon/six passive slots, max levels, weight/rarity, owned-item weighting, seals, banish and unlock state. Stage-ground passives may add equipment beyond normal passive selection capacity. Reroll, skip and banish consume actual budgets. Evolved/consumed base weapons must not reappear. Vandalier consumes both birds, returns one slot and remains upgradeable.

Recipes define requirements, levels, chest eligibility, time/stage/character conditions, consumption and result. Chest eligibility is captured on the drop; a later clock change must not forge it. Source-supported boss eligibility can override the generic time restriction, including Mad Forest's early eligible chest. A missing passive or second bird must block evolution. Gifts/Morphs and all original exceptions remain separate research/content work.

## World and end-of-run contracts

Stage definitions supply spawn tables, enemy groups, timed events, bosses, item positions, obstacles, boundaries, music and modifiers. Forest uses four-direction pressure; Library uses a horizontal corridor, fixed vertical camera, repeated obstacles and stage-specific pools/tables. These must affect movement and spawning, not only background colour.

Bosses have separate timed spawn data, scaling/resistance/knockback/visual/drop metadata. Standard 30-minute stages continue into Reaper encounter behaviour, not an automatic victory banner. Runtime/boss numeric estimates remain labelled until verified.

## Progression and persistence contracts

Antonio and Forest are initially available. Purchases require both unlock conditions and sufficient gold. Library requires a recorded level-20 Forest run. The six default shared weapons are Whip, Magic Wand, Knife, Axe, King Bible and Santa Water; other shared-pool unlocks use sourced rule data. Character starting equipment is independent of shared-pool availability. Preserve previously acquired/unlocked content across migrations.

Version 2 saves retain the existing storage key, validate finite bounded values, repair partial data, reject unsafe/future imports and keep checksum/recovery copies. Persist gold, purchases, unlock evidence, collection, PowerUps and settings. Required evidence includes stage/character duration, weapon levels, pickups, breakables, kills, healing, run gold and curse-active survival where a rule uses it. Do not invent a completed condition from missing evidence.

## UI, audio and validation

Keep the existing retro/gothic UI and Japanese/English labels. Support keyboard, mouse menus and Gamepad API deadzone/edge handling. Preserve level choices, HUD, pause, results, options and debug telemetry. Audio uses original synthesis, master/music/SFX gain separation, first-interaction unlock and bounded voices. Chest reveal/skip should control presentation and resumption rather than display rewards behind inactive buttons.

Validation requires unit/integration tests, final-HTML browser paths, screenshots, strict legacy Golden comparison at seven actual time marks, multiple build simulations, actual normal-speed thirty-minute browser play, and enemy/projectile/pickup stress. Record artifact hashes and distinguish interrupted, failed, blocked, assisted, accelerated and real-time outcomes. Compare against acquired original-game evidence before declaring fidelity or final release; a community table match does not replace video/image/run comparison.
