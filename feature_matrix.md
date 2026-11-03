# Feature matrix — Phase 2

Updated 2026-11-03 (Asia/Tokyo). **Phase 2 engineering expansion; not a fidelity-qualified final release.** The user's Phase 2 instruction authorizes expansion while retaining the original slice as a Golden baseline. This does not close the original-reference gate.

Status vocabulary: `Not researched`, `Researched`, `Implementing`, `Implemented`, `Tested`, `Compared`, `Passed`. In this table, `Code present` means the code/data exists and `Tested` means a local check ran; neither alone satisfies the user's full definition of Implemented. A community-data comparison is labelled separately from original-game image/video/play comparison. Final results and artifact hashes belong to the linked generated reports.

| Feature | Research | Code / local state | Test evidence | Comparison | Fidelity / release passed |
| --- | --- | --- | --- | --- | --- |
| Current official PC version/hotfix | Not researched to completion: official destinations denied | target remains unknown | access records | none | no |
| Modular source → single offline HTML | engineering specified | Code present | build/static/browser artifact checks | artifact hash/network requests | engineering only |
| Golden source preservation | engineering specified | commit/tag `golden-vslice-v1`, stored reports | regression reads old tag without checkout changes | local baseline comparison | 7/7 actual marks passed, local baseline only |
| Legacy Antonio/Whip/Forest | original numerical reference incomplete | old pool/bot/spawn path retained via `legacy:true` | `phase2-regression --full` | old engine snapshots/RNG/position/inventory | local regression only |
| Fourteen representative base weapons | user behaviour specification + selected community tables | Code present; 14 behaviour IDs/families | own-weapon damage and behaviour tests; artifact arenas | selected numeric data, no original footage | not fidelity passed |
| Projectile collision/lifetime/pooling | engineering design; source intervals/pool observations where acquired | Code present | targeting, trajectory, reversal, ricochet and damage tests | source facts, local units estimated | not fidelity passed |
| Bible/Vespers timing | community documented duration/cooldown distinction | Code present; recast/interval logic | duration/recast regression | source prose semantics, no frame measurement | not fidelity passed |
| Garlic persistent aura | community documented entry/re-hit role | Code present; per-enemy timing/debuff | entering-target and re-hit regression | source role, not original DPS | not fidelity passed |
| Water/La Borra ground zones | user/source role | Code present; timed/growing/drifting pools | own-damage/arena checks | geometry/tempo unmeasured | not fidelity passed |
| Pentagram/Gorgeous Moon | community levels and erasure/generation/vacuum descriptions | Code present; distinct phases and item handling | actual damage/phase tests | selected timing facts; remaining cadence estimated | not fidelity passed |
| Peachone/Ebony/Vandalier | community directions, sets and union relationship | Code present; opposite/dual bombardment | own-weapon arena and union tests | selected counts/levels, no original capture | not fidelity passed |
| Fifteen passive items | source observations and explicit estimates by property | Code present; centralized levels/caps | every passive level stat test | full current-PC interactions unverified | not fidelity passed |
| Stats pipeline | engineering/order contract; reference ordering incomplete | Code present; character→PowerUp→passive→context layers | stat/operation/cap tests | no complete original ordering proof | engineering partial |
| Thirteen evolution/union recipes | mappings cross-checked community sources; levels single-source | 12 evolutions + Vandalier union | missing requirement/chest/consumption/result tests | relationship/data comparison | not full current-PC exception pass |
| Vandalier slot replacement/leveling | community relationship/levels | consumes both birds; frees one slot; upgradeable result | union/choice regression | data checked, original animation unmeasured | local test passed |
| Early Forest eligible chest | selected stage table documents eligibility | boss metadata override, not global time alone | early eligible/ineligible regression | community timetable | no original-video pass |
| Gift/Morph/full character exceptions | incomplete | generic requirement/consumption fields; no full content catalogue | ordinary/union coverage only | incomplete | no catalogue claim |
| Chest reward count/reveal/skip | selected boss probabilities; reveal timing partly authored | Code present; presentation state/reveal/skip | artifact chest/evolution paths | original timing/audio not frame-measured | not fidelity passed |
| Mad Forest 30-minute timetable | selected community minute rows | normal-mode reconstructed wave/minimum/interval/event data | timed spawn/long-run evidence | table comparison; spawn interpretation estimated | not full wave-fidelity pass |
| Enemy database and crowd movement | source names; HP/speed/scale mostly estimated | data-driven archetypes, steering/grid/pools | finite-state/combat/stress checks | original enemy numeric/coverage gap | not fidelity passed |
| Boss/Reaper/end-of-stage | selected source schedule/drop eligibility; some stats estimated | timed bosses, metadata, Reaper continuation | run/boundary tests | original resistance/end sequence incomplete | not fidelity passed |
| Inlaid Library | selected community waves; authored geometry | horizontal bounds, fixed-Y camera, repeated obstacles/items/pool | movement/selection/browser checks | exact geometry/world units unmeasured | not fidelity passed |
| Eleven characters | starting equipment/stat/bonus/cost/unlock data; per-field confidence varies | Code present; abilities affect stats/Revival | every character creation and purchase tests | current official tables/captures unverified | not fidelity passed |
| Gold/Greed/PowerUps | source roles; economy details partly estimated | 16 PowerUps and coin/bag/chest effects | stat/purchase/save and Greed regression | complete current price/scaling comparison absent | local tested |
| Character/stage purchases/unlocks | data rules and acquired conditions | saved conditions and affordable purchases | progression/browser reload checks | selected requirements checked | local tested |
| Shared weapon unlocks | 14 sourced rule observations; six default | data and persisted-evidence integration | unlock data and progression tests; latest artifact rerun required | source condition comparison | local evidence must match current build |
| Collection | engineering/source role | all registered items shown as discovered/unknown | result/save/browser checks | no exact original layout comparison | local tested |
| XP/gem conservation | numerical curve/merge policy still partly estimated | attraction, thresholds, Growth and capped merge | mass XP/conservation/level queue tests | reference curve/gem policy unmeasured | not fidelity passed |
| Light sources and pickups | source roles; local drop table estimates | real breakage and pickup effects | weapon/light/drop paths | source rates/durations incomplete | not fidelity passed |
| Save version 2 | engineering specified | migration, checksum/recovery, bounded import/export | v1/partial/corrupt/future/reload tests | internal contract | local tested |
| Japanese/English/UI/input | localized data and existing visual baseline | functional menus/HUD/lab/keyboard/Gamepad API | browser/layout/device tests | official Japanese/font/physical hardware comparison absent | local tested |
| Expanded original audio | original synthesis; source cadence incomplete | weapon-specific events, gain buses and voice limits | audio unit/browser checks | no original mix/physical audibility comparison | local tested |
| Arcana modifier foundation | user architecture target | event hooks, operations, expiry, unsubscribe | modifier/expiry regression | no Arcana content comparison | foundation only |
| Arcana/Darkana/relic/mode catalogue | Phase 3 scope | absent as full systems/content | not claimed | not compared | no |
| Multi-build normal simulations | engineering target | five build strategies | `reports/phase2-builds.json` | build distribution, not original balance | outcome-specific |
| Real-time normal-speed 30-minute play | engineering target | dedicated unaccelerated browser harness | `reports/phase2-realtime-final.json` only after completion | no human/original Game Feel equivalence | completed 1802.18s in 1870.26 wall seconds; fixture limits apply |
| Real-projectile high-density stress | engineering target | active WeaponSystem workload | `reports/phase2-stress.json` | cloud Linux measurements only | no Windows guarantee |
| Windows / physical Gamepad / file protocol | product target | standards-based implementation | Windows/device untested; managed `file://` blocked | unavailable | no |

The authoritative result is the complete, current report, not the presence of a tool or a requested duration. A Golden file with fewer than seven marks, a real-time progress file, an old artifact hash or a synthetic projectile array cannot satisfy the corresponding final gate.
