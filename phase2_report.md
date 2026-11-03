# Phase 2 intermediate report

Updated 2026-11-03 (Asia/Tokyo). **This is an engineering milestone report, not a final-release or original-fidelity approval.** Current official PC version and original visual/gameplay comparison remain unresolved.

## Preserved baseline and expanded scope

The prior working state is committed and tagged `golden-vslice-v1`; copies of its selected reports are under `reference/golden-vslice-v1/`. Normal Phase 2 play intentionally expands its item pool, progression and source-based stage tables. `legacy:true` exists only for strict old-slice regression.

| Area | Present in current code |
| --- | --- |
| Basic weapons | Whip, Magic Wand, Knife, Axe, Cross, King Bible, Fire Wand, Garlic, Santa Water, Runetracer, Lightning Ring, Pentagram, Peachone, Ebony Wings |
| Evolution / union | Bloody Tear, Holy Wand, Thousand Edge, Death Spiral, Heaven Sword, Unholy Vespers, Hellfire, Soul Eater, La Borra, NO FUTURE, Thunder Loop, Gorgeous Moon, Vandalier |
| Passives | 15 representative base items with levels/caps/stats |
| Characters | Antonio plus Imelda, Pasqualina, Gennaro, Arca, Porta, Lama, Poe, Clerici, Dommario, Krochi |
| Stages | Mad Forest and horizontal Inlaid Library with collision/bounds/camera differences |
| Meta / save | Gold, purchases, rule-driven unlock evidence, discovered/unknown Collection, 16 PowerUps, version 2 migration/recovery |
| Development | Expanded Weapon Laboratory, seeded player bot, replay, telemetry, modifier/event foundation and offline bundling |

Starting availability is separate from this registry count. A new save initially owns Antonio and Forest; the shared default weapon pool has six weapons. Other characters require purchase/unlock conditions, and Library requires a recorded Forest level-20 run. Shared weapon unlocks use the observed conditions in [research/phase2_unlocks.md](research/phase2_unlocks.md). Full-unlock/metaupgrade QA fixtures must not be presented as a new-player run.

## Research used and remaining uncertainty

Official Steam/Poncle/wiki destinations still returned CONNECT403 under the current runtime policy. Genuine public community companion/chart documents were acquired and pinned by commit. Recipe relationships were cross-checked; selected weapon numeric/level observations and stage minute tables were independently expressed as local factual data. The later community snapshot at `5e345c547ebe39c429d99032aae8e688fa15bfd4` is not an official latest-PC release identifier.

[Source ledger](research/phase2_sources.md), [selected weapon observations](research/phase2_weapon_facts.json) and the unlock ledger identify confidence limits. Enemy numeric statistics, projectile/world-unit conversion, map coordinates, some timing/cadence and full exceptions remain estimated. No protected game assets, original prose or third-party executable code are incorporated; graphics/audio are original procedural material.

## Validation record

| Check | Current evidence and required interpretation |
| --- | --- |
| Unit / integration | Current final run: 118/118 passed, 0 failed/skipped. Evidence: `reports/phase2-unit.tap`. |
| Final HTML browser | The final 213,550-byte artifact produced 24 PASS, 0 FAIL, 1 BLOCKED in `reports/phase2-browser.json`; its hash matches the current HTML. |
| File protocol | BLOCKED by managed Chromium policy, not silently counted as an HTTP success. Windows direct-file verification remains outstanding. |
| Legacy Golden | `reports/phase2-golden-full.json`: 7/7 actual marks passed (00:30, 05:00, 10:00, 15:00, 20:00, 25:00, 29:00). |
| Build diversity | `reports/phase2-builds.json` contains current Whip / Wand / AoE / Bible / Mixed simulation outcomes, with normal versus assisted and fixture details explicit. |
| Normal-speed 30-minute play | `reports/phase2-realtime-final.json` is completed: 1×, no invincibility, 1802.18 simulation seconds in 1870.26 wall seconds. Fixture/hash limits are documented below. |
| Enemy + real projectile stress | `tools/phase2-stress.mjs` measures actual WeaponSystem work. Results are recorded separately from Phase 1's synthetic projectile array test. |
| UI / screenshots | Browser captures remain under `reports/phase2-screenshots/`; completed real-time marks use their separate directory. Layout/device testing is scoped to the tested browser. |

The real-time fixture uses Gennaro, seed 271, Forest, an AoE-oriented deterministic player bot, beneficial meta upgrades at maximum and no purchased Curse. No invincibility, accelerated steps or forced XP/equipment is used during that run. Its pool is the fully available QA pool at the tested milestone. This can demonstrate normal-speed engine continuity/survival, not new-player difficulty or human Game Feel equivalence. An earlier run/capture must retain its own artifact identity if the current build changes.

## Important correction cycles

- New weapons deal their own measured damage through distinct target/movement/area algorithms rather than falling back to Whip.
- Recipe evaluation checks both birds for Vandalier, consumes them, frees one slot and allows result leveling.
- Source-table boss flags preserve early eligible Forest chests and block ineligible ones instead of applying a universal ten-minute rule.
- Bible/Vespers duration/cooldown handling, aura entry hits, bombardment sets and Gorgeous Moon phases were reviewed against acquired descriptions; unsourced details remain estimates.
- Temporary modifiers expire during simulation, Greed affects actual pickups, and progression retains real run evidence.
- QA player changes improve multi-build route/XP behaviour without changing enemy AI or granting privileged combat actions.

## Completion decision

**Phase 2 completion and P0=0/P1=0 are not declared here.** Current-source results and completed real-time/stress evidence are incorporated in phase2_test_report.md. Original-game comparison, official target identification, exact enemy/map/numeric exceptions and target Windows/physical-device validation remain open. Comparative quality is **unscored / 100** rather than a self-assigned number.

The single HTML remains the runnable artifact, while [feature_matrix.md](feature_matrix.md), [gap_report.md](gap_report.md) and [quality_report.md](quality_report.md) describe its actual limits. Advanced Arcana/Darkana, relics, modes, secrets and the remaining base/DLC catalogue belong to later expansion and are not claimed complete by this milestone.

## 最終計測への更新

この文書の旧「記録時点」の件数に優先する最終結果は [phase2_test_report.md](phase2_test_report.md) と [機械可読summary](reports/phase2-summary.json)。Unit118件成功、最終HTMLブラウザ24成功・0失敗・1管理ポリシーブロック、日英UI60検査成功。Golden7点はすべて実際の目標時刻へ到達して一致した。無敵なし・通常1倍の実時間ランは31分10秒でゲーム内30分02秒を越えた。全進行準備済みQA fixtureであり、新規アカウントの初回生存を主張していない。

追加の実投射物ストレスでは、敵1500体と最大257投射物・400XP・600粒子を維持して50.90FPS（Linuxクラウド）。最適化後全ケース100ms超CPU/RAFは0。Eのp95 RAF33.4msは厳密な33.33ms閾値フラグを満たさず、基準は変更していない。描画キャッシュは32条件と高密度フレームでピクセル差0を確認した。Windows性能や原作比較の合格へ読み替えない。
