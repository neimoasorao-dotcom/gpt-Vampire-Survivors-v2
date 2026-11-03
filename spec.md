# Engineering specification and reference boundary

## Required product

Deliver a single `dist/vampire_survivors.html` with inline HTML/CSS/JS/content, no runtime requests, usable under both `file://` and local HTTP. Windows latest stable Chrome at 1920×1080 is the requested target; Linux Chromium automation is evidence only for that tested browser. Also exercise 1366×768 and 2560×1440. Development source remains modular.

The requested final target is Vampire Survivors fidelity, not merely a functioning survival loop. The current reference version is unknown because origin access is denied. Therefore this document specifies testable engineering behaviour; reference fidelity remains a separate blocked gate.

## Golden vertical slice

Antonio starts with Whip on Mad Forest. A run must include start/character/stage menus, normalized movement and facing, autonomous directional Whip attacks, changing enemy pressure over 30 minutes, HP/contact immunity, XP gems and weighted upgrades, six weapon/six passive inventory capacity rules (initial golden content: Whip/Bloody Tear and nine passive definitions), chest rewards and eligible Bloody Tear evolution, bosses, death/results, saved gold/progression, Japanese/English and audible original audio. Whip must be a timed melee sweep, not a reskinned ballistic projectile.

## Simulation contracts

60 Hz fixed simulation; seeded random state owned by engine; deterministic input sequence; DOM/render/audio cannot change simulation RNG. Time stops during level-up, chest, pause and results. Multiple pending level-ups must resolve without loss; chest pickup during another transition must not corrupt inventory. All positions/HP/timers finite. Contact damage has a timed immunity window. Effects, enemies, pickups and numerical texts must have bounded lifetime or collection/merge policy. Camera uses separate world/display coordinates.

## Progression and evolution

Stats are centrally recomputed from base, character, purchased powerups, owned passives and temporary modifiers. Definitions carry caps and operations. Evolution rules express base/max level, passive/min level, chest eligibility/time/stage overrides, consumption and slot replacement. Chest event preserves spawn eligibility; changing time after drop does not retroactively forge eligibility. Upgrade pool excludes maxed inventory, respects slot limits, preserves distinct choices and supports skip/reroll/banish budgets. Unverified original rarity/chest formulae stay estimated.

## UI and input

Keyboard WASD/arrows, Enter/Escape; gamepad left stick/D-pad, confirm/cancel/pause with deadzone and edge detection; mouse menus. Localized names/descriptions and labels have Japanese and English values. Options persist master/music/SFX gain, language, damage numbers, shake, flashes, gamepad, performance. Pause prevents input bleed into simulation. Browser visibility loss pauses; sound resumes only after permitted interaction. Gamepad absence is a supported state.

## Persistence

Versioned schema with sanitized finite numeric values, default repair for missing fields, bounded import size and rejection of invalid JSON, no eval. Write failure does not block boot. Save meta state at safe transitions; settings survive reload. Export/import can be tested without writing credentials or HTML.

## Validation gates

1. Unit/integration: seeded determinism, movement normalization, Whip cadence/hit exclusion, enemy death/XP, simultaneous levels, upgrade exclusion, chest/evolution replacement, contact/death, save migration and invalid data.
2. Browser final artifact: boot, Japanese/English, menus, movement, level-up, chest, pause, results, keyboard, save/reload, audio gains and absent gamepad; no uncaught exceptions; actual file:// and HTTP artifacts.
3. Runs: multiple seeds at 30-minute simulation, honest distinction between ordinary bot and invincible safety/soak runs; at least 60-minute endless simulation; snapshots/telemetry at requested times.
4. Stress: 500/1000/1500 enemies, projectiles+1000, gems+enemies+particles; update/render/total frame durations measured separately. Headless Linux software rendering cannot prove Windows hardware FPS.
5. Fidelity: versioned reference captures and metric ranges from multiple independent runs. This gate is blocked while references are unavailable. Do not mark final release, score reference fidelity, or expand content on engineering checks alone.

## Current iteration scope

The actual content baseline contains Antonio, Whip/Bloody Tear, one Forest stage, nine passives, the pickup effects, a local persistent powerup economy and debug laboratory. It does not assert other character/stage/weapon content, Arcana/Darkana, relics, modes or DLC complete. Definitions and all numerical assumptions are captured in `reference/implementation_baseline.json` and `evidence.json`. Exact authored minute waves and boss timestamps are documented in `research/waves.md`; all remain estimated. Content expansion is gated by reference comparison.
