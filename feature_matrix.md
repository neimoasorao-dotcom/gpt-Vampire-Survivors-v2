# Feature matrix — engineering iteration, reference gate open

Updated 2026-11-03 (Asia/Tokyo). **Not a final release.** `✓` means demonstrated only in the indicated scope, `△` partial, `—` absent, `blocked` unavailable external evidence, `pending` awaiting current generated report. `Passed` is the requested original-game fidelity/release gate, not whether local code executes. Source-game numerical research remains blocked; no local test upgrades estimates to confirmed fidelity.

Current test counts/outcomes are authoritative in [test_report.md](test_report.md), [browser results](reports/browser-results.json), [simulation results](reports/benchmark.json) and [render stress](reports/render-performance.json). Do not infer results from a test name or missing result file.

| Feature | Research | Implemented | Tested | Compared | Passed |
| --- | --- | --- | --- | --- | --- |
| Current PC version/hotfix/DLC target | blocked | version remains unknown | 5 access failures recorded | — | no |
| Modular development → single inline HTML | engineering specified | ✓ esbuild | browser final artifact | external requests checked | engineering only |
| Antonio starting character | estimated | ✓ one character | stats/selection tests | blocked | no fidelity pass |
| Antonio level Might scaling | estimated | ✓ data-driven | stat tests | blocked | no fidelity pass |
| Whip directional melee timing | estimated | ✓ facing + delayed opposite sweep | attack/target exclusion/cadence | blocked | no fidelity pass |
| Whip level table | estimated | ✓ levels 1–8 | sparse-delta test/lab | blocked | no fidelity pass |
| Bloody Tear crit/healing | estimated | ✓ replacement + crit/heal | evolution/arena; exact healing comparison absent | blocked | partial |
| Other base weapons/characters | acquisition pending | — gated by slice | — | — | no |
| Fixed 60 Hz simulation | engineering specified | ✓ | timestep and normalized motion tests | internal determinism | engineering only |
| Seeded randomness | engineering specified | ✓ engine-owned PRNG | same-seed comparison | internal | engineering only |
| Input replay | engineering specified | ✓ tick input/menu records | replay regression | internal | engineering only |
| Movement/diagonal/facing | estimated reference | ✓ | keyboard/normalization | source speed unknown | no fidelity pass |
| Mad Forest world camera | estimated | ✓ original forest terrain | browser/render captures | blocked | no fidelity pass |
| Exact Mad Forest obstacles/pickups/secrets | unknown | △ authored pickup coordinates; no obstacles | local pickups only | blocked | no |
| Minute waves and boss schedule | estimated | ✓ authored 30-entry table | long-run telemetry | blocked | no fidelity pass |
| Crowd pursuit/soft separation | estimated | ✓ broad-phase grid | 500/1000/1500 stress | blocked | no fidelity pass |
| Boss/chest drops | estimated | ✓ authored elites | local combat/chest paths | blocked | no fidelity pass |
| 30-minute boundary/Reaper | estimated | ✓ terminal encounter | assisted continuity runs | blocked | no fidelity pass |
| Ordinary 30-minute survival pacing | reference unknown | game loop exists | natural bot results must be read separately | blocked | not established |
| XP gems/attraction | estimated | ✓ | XP collection/level tests | blocked | no fidelity pass |
| Gem-cap XP conservation | original policy unknown | ✓ local merge cap | sum/cap test | blocked | engineering only |
| XP thresholds/Growth | estimated | ✓ authored curve | levels/stat tests | blocked | no fidelity pass |
| Weighted level choices | estimated | ✓ owned weighting/unique sampling | exclusion/slot/weight tests | blocked | no fidelity pass |
| Reroll/skip/banish | estimated | ✓ limited budgets | browser and engine paths | blocked | no fidelity pass |
| Six-slot inventory | estimated exceptions | △ passive cap; only one base weapon | choice capacity tests | source ground-pickup exceptions unknown | partial |
| Evolution eligibility | estimated | ✓ rule + chest spawn time + slot replacement | eligible/ineligible/missing-passive tests | blocked | no fidelity pass |
| Unions/gifts/morphs/blacklist exceptions | unknown | △ schema only | — actual recipes absent | blocked | no |
| One/three/five chest rewards | estimated | ✓ authored probabilities | local chest reward path | blocked | no fidelity pass |
| Chest reveal presentation/timing | unknown original timing | △ local presentation | transition screenshots | no frame-measured original | no |
| Nine passive items | estimated | ✓ definitions + stats | stat/inventory tests | blocked | no fidelity pass |
| Coins/bags/chicken | estimated | ✓ pickup effects | local automated paths | blocked | no fidelity pass |
| Vacuum/clock/rosary/NFT | estimated | ✓ local effects | selected engine/long-run paths | blocked | no fidelity pass |
| Little Clover | unknown original magnitude/lifetime | run Luck modifier; prior gold bug fixed | regression passed | blocked | no |
| Light-source pickup distribution | estimated | ✓ authored table | local simulation | blocked | no fidelity pass |
| Permanent powerup economy | estimated | ✓ nine upgrades | buy/save paths | blocked | no fidelity pass |
| Saved collection/run achievements | engineering/local rules | ✓ | save/result/reload | original unlock thresholds unknown | engineering only |
| Character/stage/relic unlock progression | unknown current catalogue | — beyond initial content | — | blocked | no |
| Arcana/Darkana | unknown | — actual modifier catalogue/selection absent | — | — | no |
| Hyper/Hurry/Inverse/Limit Break | unknown | — | — | — | no |
| Endless | estimated | △ repeating local cycles | cycle-boundary/soak | original modifiers unknown | no fidelity pass |
| Main/character/stage/HUD/level/pause/results | layout unmeasured | ✓ functional golden-slice screens | screenshots/browser actions | blocked | no fidelity pass |
| Powerup/collection/unlocks/secrets/options | layout/content unmeasured | △ local progression screens | navigation/settings | blocked | partial |
| Japanese/English | official terminology unverified | ✓ dictionaries/data labels | browser language/overflow checks | blocked | functional only |
| Keyboard/mouse | product specified | ✓ | browser movement/menu actions | no latency capture | functional only |
| Gamepad | product specified | ✓ API/deadzone/buttons | synthetic API and fallback | physical device untested | partial |
| Original music/SFX | reference cadence unknown | ✓ WebAudio synthesis/gains/voice cap | unlock/suspension/voice tests | no original audio comparison | functional only |
| Pixel sprites/terrain/effects | scale estimated | ✓ original cached art | screenshots and renderer stress | no source captures | no fidelity pass |
| Versioned save/backup/import/export | engineering specified | ✓ | malformed/partial/checksum/write-failure tests | internal | engineering only |
| Debug lab/speed/telemetry | engineering specified | ✓ for current slice | benchmark scripts | original DPS unknown | engineering only |
| Browser resize/fullscreen/options | product specified | △ resize tested; fullscreen platform-dependent | 1366/1920/2560 test script | no Windows hardware | partial |
| 500/1000/1500 enemy rendering | product targets | ✓ | measured renderer stress | no original density sample | performance report limits apply |
| Combined real projectile stress | product specified | — Whip has no projectile system | synthetic array test only | — | no |
| 60-minute soak | product specified | ✓ accelerated assisted run harness | 3601 seconds completed, finite-state check passed | not a normal survival test | scope-limited |
| Final `file://` artifact | product specified | bundled file exists | BLOCKED: managed policy rejected navigation; see current report | — | unresolved until actual test |
| Final local HTTP artifact | product specified | ✓ | browser artifact test | offline requests/errors recorded | engineering only |
| Windows 10/11 stable Chrome | product specified | web standards target | — actual machine unavailable | — | unverified |

Expansion gate remains closed: no exact reference version, capture set, source wave table or measured movement/Whip/XP comparison has been obtained.
