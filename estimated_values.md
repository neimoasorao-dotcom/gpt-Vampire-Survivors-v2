# Estimated values and re-verification queue

No original reference page/video has been read during this task: five requests failed at the policy proxy. The ledger distinguishes user requirements/engineering decisions from original-game facts. No numeric original-game value is `confirmed`.

| Candidate | Current hypothesis | Origin/status | Priority and next measurement |
| --- | --- | --- | --- |
| Antonio start | Whip | memory / estimated | P1 acquire official/wiki character definition |
| Antonio level Might | discrete growth; exact interval/cap unknown | memory / unknown numeric | P1 capture stat change each level interval |
| Whip base damage | 10 | memory / estimated | P1 controlled target/damage capture |
| Whip cooldown | 1.35 s | memory / estimated | P1 frame-measure 10+ attacks at neutral stats |
| Whip maximum base level | 8 | memory / estimated | P1 acquire complete level table |
| Whip sweep shape, reach, extra strikes | directional lateral group-hit | memory / estimated | P1 capture multiple directions/levels |
| Whip evolution recipe | Whip + Hollow Heart | memory / estimated | P1 verify levels and chest timing separately |
| Internal viewport | 960×540 | engineering / estimated | P1 measure reference world-width and sprite pixels |
| Player sprite height | about 22 logical px | engineering / estimated | P1 compare 1920×1080 reference scale |
| Original waves/HP/XP/economy | unknown | no acquired evidence | P1 acquire tables and multiple timed runs |
| Chest probabilities/reveal timing | unknown | no acquired evidence | P1 three+ eligible chests and source documentation |
| Movement speed/acceleration | unknown | no source video | P1 frame-analyze neutral-stat runs |
| Background/item/particle colors | authored locally | original art / estimated | P2 compare luminance, role and occupied area |
| All synthesized audio timing/mix | authored locally | original synthesis / estimated | P2 compare cadence and loudness hierarchy |

Runtime content values not enumerated here are still **estimated engineering values**, unless a corresponding ledger entry supplies acquired evidence. Inspect `src/data/content.js` as the authoritative local implementation table; do not mistake it for an original-game data dump. After implementation stabilizes, reconcile all gameplay constants to ledger entries before any fidelity release.

## Status upgrade rule

Only actual source reading or reproducible reference measurement can upgrade an original-game hypothesis. A passing local unit test proves implementation consistency; it cannot upgrade an estimate to confirmed fidelity. Store URL/timecode, applicable patch, sample count, uncertainty and comparison result when rechecking.

## Implementation audit

`reference/implementation_baseline.json` snapshots CONFIG, Antonio stats/bonuses, both weapon level tables, all nine passive modifiers, eight enemy archetypes, every minute wave/boss/event/stage pickup, evolution and powerup data. Each numerical leaf is indexed in `evidence.json` under `implementation.content.*` as `estimated` with source type `authored_engineering_baseline`. The XP formula and selected combat constants are also ledger entries. This captures reasons/uncertainty and prevents a local data table being mistaken for extracted original data. No arbitrary confidence upgrade follows test success.

Additional engine estimates include sweep range 95 units, half-height 24, extra-strike interval 0.16s, 0.5s contact immunity, Bloody Tear heal 8 with 1s local cooldown, consumable effect duration 10s, and authored chest threshold/gold formulas. These require reference verification before a fidelity release.

- `pickups.clover.luckBonus = 0.1`, run-scoped local modifier, estimated. Source/lifetime not acquired. Regression prevents a return to the incorrect coin reward.

## Phase 2 remaining estimates

Local projectile speed/radius and camera-unit conversions, enemy HP/damage/speed/scaling/resistances, map/world coordinates and obstacle layout remain estimated. Source-supported stat tables, early chest flags and weapon unlock relationships are listed separately with pinned community attribution in evidence.json; they are not official current-PC confirmation. Bird set scheduling, Moon beam acceleration/vacuum gap, spawn replenishment interpretation and the exact chance aggregation for chest multi-rewards still require gameplay measurements. Poe pickup-range conversion is not independently measured.
