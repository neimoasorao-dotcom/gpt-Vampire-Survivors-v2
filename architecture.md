# Phase 2 architecture and working contracts

Updated 2026-11-03 (Asia/Tokyo). Existing systems are extended rather than replaced. `golden-vslice-v1` preserves the initial engineering slice; original-game comparison is a separate unresolved gate.

## Build and execution

Development modules are bundled by `scripts/build.mjs` with esbuild into an inline script and CSS in `dist/vampire_survivors.html`; the root HTML is an identical copy. Content tables and procedural sprite/audio code are included. No runtime library/CDN or protected game asset is fetched. CSP denies runtime network connections. Logical canvas size is 960×540 with crisp scaling inside a 16:9 display area.

Simulation is independent of DOM, Canvas and WebAudio. The engine owns a 60 Hz clock and seeded PRNG. Rendering and audio must not draw from that gameplay PRNG. The existing checkout is already isolated: do not create worktrees unless explicitly requested.

## Modules

| Module | Responsibility |
| --- | --- |
| `src/data/content.js` | Registry composition and original definitions; exposes CONFIG, CHARACTERS, WEAPONS, PASSIVES, ENEMIES, STAGES, EVOLUTIONS, POWERUPS and LEGACY_ITEM_IDS |
| `src/data/weapon-expansion.js` | Independently authored weapon/passive/recipe definitions and behaviour IDs |
| `src/data/researched-weapon-values.js` | Selected normalized community numerical observations with provenance; local unit conversion remains distinct |
| `src/data/stage-reference.js`, `world-reference.js` | Selected source timetable facts and independently reconstructed world/enemy interpretation |
| `src/data/world-expansion.js` | Additional character, enemy, Library and PowerUp definitions |
| `src/data/weapon-unlocks.js` | Fourteen shared-pool unlock rule objects with source metadata |
| `src/core/rng.js`, `spatial.js` | Seeded randomness and reusable broad-phase grid buckets |
| `src/core/modifiers.js` | Ordered add/multiply/set stat operations, event subscriptions, expiry and revision tracking |
| `src/gameplay/engine.js` | Fixed-step orchestration, HP/contact, original Whip, pickups/XP/choices/chests, telemetry and debug API |
| `src/gameplay/weapon-system.js` | Distinct non-Whip targeting/movement/effect behaviours; projectile and re-hit pools; per-weapon metrics |
| `src/gameplay/world-system.js` | Source-table spawning/events/bosses, stage boundaries, obstacle collision and extra enemy steering |
| `src/gameplay/evolution.js` | Pure recipe eligibility and atomic consumption/result application |
| `src/gameplay/stats.js` | Central stat pipeline and XP thresholds |
| `src/gameplay/progression.js` | Data-driven unlock evaluation, purchases and derived saved run evidence |
| `src/gameplay/autoplay.js` | Deterministic QA player; no privileged combat/time actions |
| `src/core/replay.js` | Validated tick-indexed input/menu replay |
| `src/render/renderer.js` | Cached original pixel art, terrain, sprites/effects, culling and render telemetry; Library camera/geometry |
| `src/services/audio.js`, `save.js`, `input.js` | Bounded original synthesis, validated version 2 persistence, device abstraction |
| `src/ui/ui.js`, `style.css` | Existing visual language, localized screens, purchase/collection/lab controls and HUD |
| `src/main.js` | Application navigation, real-time accumulator, saved settings/progression and QA bridge |

The data extractor `tools/extract-phase2-facts.py` reads an explicitly supplied local copy of the pinned community reference. It selects factual observations; it is not a runtime dependency or a downloader that bypasses network policy. Attribution and limits belong in `research/phase2_sources.md` and `research/phase2_unlocks.md`.

## Engine and behaviour APIs

`new Engine(options)` accepts seed, character, stage, PowerUps, `auto`, `endless`, `legacy`, build strategy and laboratory overrides. `step(1/60,input)` is the only simulation advance; other step sizes are rejected. Public state includes player, enemies, projectiles, pickups, effects, particles, texts, weapons/passives, choices, chest rewards, telemetry and metrics. `give`, `choose`, `openChest`, `closeChest`, `snapshot` and bounded `debug` operations support gameplay/testing.

`WeaponSystem(engine).tick(dt)` runs after the collision grid is ready. Its constructor consumes no RNG, and the no-extra-weapon fast path preserves legacy Whip behaviour. Projectiles carry owner weapon ID, motion mode, position/velocity, life, pierce, radius and per-target hit time. Area effects carry their actual damage/interval/lifetime; the renderer does not simulate them. Evolution removes consumed weapons so delayed effects/projectiles cannot become ghost equipment.

`WorldSystem` supplies `constrainPlayer`, `spawnTick` and optional `steer`. Definitions determine whether movement is unbounded or corridor-limited. Timed waves and source boss chest flags are data; enemy stats and world-unit conversion are separately estimated. Legacy Forest uses the original spawn path.

`ModifierBus` registers hooks and stat modifiers. Existing events route to onAttack, onProjectileSpawn, onHit, onCrit, onKill, onEnemyDeath, onHeal, onPickup, onDamageTaken and onLevelUp as applicable. Addition/expiry changes revision so stats can refresh without a level-up. This provides extension points; it does not imply any unimplemented Arcana is available in game.

## Progression and save contracts

`progression.js` exports unlock evaluation, availability/purchase helpers, initialization and run-result application. The application commits gold/kills/run counters once, then derived evidence once. Rules can combine all/any requirements. Shared weapon unlock flags and character starting equipment are separate; full-unlock QA fixtures must explicitly state their pool.

`SaveService` keeps the existing `vs-reconstruction.save.v1` storage key while using `saveVersion:2`, allowing earlier saves to migrate in place. It stores gold, aggregate/run evidence, purchased characters, stages, weapon flags, seals, PowerUps, collection and settings. Validation bounds sizes and numeric values, rejects unsafe/future imports, and uses checksum plus recovery copies. Storage denial falls back to session memory rather than preventing boot; that fallback is not persistent-storage proof.

## Browser and QA interfaces

The application owns screens, selected character/stage, engine, save, audio and measured timing. UI owns DOM menus; renderer owns the game world. Mouse/keyboard/gamepad actions call real application methods. `window.__VS` exposes the application, Engine, renderer/input/storage, `start`, bounded `runFrames`, `snapshot`, `debug` and `pauseLoop` for automation. The normal RAF loop remains separate from accelerated QA stepping.

Replay records exact input changes and decisions on simulation ticks, capped at 260,000 events. A recording that exceeds the cap is explicitly truncated and rejected for exact playback; gameplay continues. Debug warp is processed in bounded time slices. Lab numeric inputs and spawn loops are finite and capped.

## Regression separation

`legacy:true` restricts the prior content pool and bot/spawn path. `tools/phase2-regression.mjs --full` compares the current engine with source read from `golden-vslice-v1` without checking out or overwriting the worktree. Completion requires actual simulation arrival at all seven marks through 29:00, not merely the requested count of step calls.

Normal Phase 2 gameplay deliberately uses new item/unlock pools and researched timetables; its level/kill curve should not be asserted identical to the old fixture. Final artifact tests, accelerated build tests, real-time play and stress have distinct report/hash evidence. Source or artifact changes require the affected checks to be repeated or explicitly identified as an earlier milestone.
