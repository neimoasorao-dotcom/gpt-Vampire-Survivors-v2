# Phase 2 source ledger — 2026-11-03

The live runtime reports an enforced restricted policy with no custom domains. Steam, poncle, fandom and wiki.gg still failed with CONNECT 403; see [accessphase2.json](accessphase2.json). This task did not disable TLS, remove proxies, modify policy files or use a proxy service to evade denials. Current stable PC version/hotfix remains **unknown**. The requested domain changes are a saved draft, not proof of application to this runtime.

## Accessible community reference documents

Public GitHub repository search and read-only Git clones worked normally through the inherited platform HTTPS route. The following genuine community companion/chart projects document game facts. They are not official PC release records. Recipe relationships agree across separate repositories; shared upstream ancestry cannot be excluded. None establishes current-PC timing, damage, stage exceptions or patch identity.

| Source | Inspected exact revision | Scope | Limits |
|---|---|---|---|
| [taleek/VampireSurvivorsCompanion baseGameEvolutions](https://github.com/taleek/VampireSurvivorsCompanion/blob/968eff7620f018223daa6b8f195840fb00c49d36/src/data/evolutions/baseGame.js) | `968eff7620f018223daa6b8f195840fb00c49d36`, commit date 2026-05-29 | weapon requirements, level requirements, passive requirements and consumed items | one community source for levels, not current-PC official confirmation |
| [SchrodingerCatBox evolution list](https://github.com/SchrodingerCatBox/vampire-survivors-evolutions/blob/2527cd3e61f31d4539c07406e2fbd16c54bd37ca/scripts/evolutions-data.js) | `2527cd3e61f31d4539c07406e2fbd16c54bd37ca`, commit date 2025-04-13 | base/passive/result recipe relationships | lacks level/time/stage/exception precision |
| [mld evolution chart](https://github.com/mld/vampire-survivors-evolution-chart/blob/b93df28507c1c76d41402d964bdc538ccb52d6e2/lib.js) | `b93df28507c1c76d41402d964bdc538ccb52d6e2`, commit date 2023-07-04 | historical recipe relationships | file explicitly labels game version **0.7.2**, last_updated 2022-06-10; not a current version source |
| [taleek base item metadata](https://github.com/taleek/VampireSurvivorsCompanion/blob/968eff7620f018223daa6b8f195840fb00c49d36/src/data/items/baseGame.js) | same revision | base weapon/passive maximum levels | does not provide full weapon damage/cooldown/level deltas |

No third-party code, images, sound, fonts or game files were incorporated. These projects have no visible root license in the inspected files; only factual relationships are independently expressed in local data. The historical mld tool references extracted icons: those icons and extraction logic are explicitly **not used**. A GitHub repository advertising raw game data/files was excluded from inspection to avoid protected game-code/material reuse.

## Thirteen researched recipe relationships

All ordinary base weapons below have level 8 in the companion requirement list; listed passives are level 1. These levels have single-community-source support (confidence 0.65). Relationship names are cross-checked (confidence 0.75), not officially confirmed. `600s`, chest-drop age eligibility and stage/character exception handling are not supplied by these documents and remain independently estimated/unknown.

| Base | Passive / second weapon | Result | Consumed |
|---|---|---|---|
| Whip | Hollow Heart | Bloody Tear | Whip |
| Magic Wand | Empty Tome | Holy Wand | Magic Wand |
| Knife | Bracer | Thousand Edge | Knife |
| Axe | Candelabrador | Death Spiral | Axe |
| Cross | Clover | Heaven Sword | Cross |
| King Bible | Spellbinder | Unholy Vespers | King Bible |
| Fire Wand | Spinach | Hellfire | Fire Wand |
| Garlic | Pummarola | Soul Eater | Garlic |
| Santa Water | Attractorb | La Borra | Santa Water |
| Runetracer | Armor | NO FUTURE | Runetracer |
| Lightning Ring | Duplicator | Thunder Loop | Lightning Ring |
| Pentagram | Crown | Gorgeous Moon | Pentagram |
| Peachone Lv8 | Ebony Wings Lv8 | Vandalier | both birds; no passive |

Vandalier is a union; it consumes two weapon slots and returns one weapon slot. Subsequent Vandalier level behavior requires its own metadata/behavior validation rather than inheriting an ordinary level-one evolution rule.

## User-provided behavioral reference

The Phase 2 uploaded instruction explicitly provides horizontal Whip sweeps, nearest-target Magic Wand, movement-direction Knife, ballistic Axe, returning Cross, orbiting Bible, persistent player Garlic AoE, ground Santa Water zones, viewport-bouncing Runetracer, remote Lightning, screenwide Pentagram, and distinct orbit-region bird bombardment. These are **user specification** sources, not measurements or official verification. They authorize implementing distinct algorithms without relabelling their numerical parameters confirmed.

## Remaining research required

- Latest PC version/hotfix and patch freeze.
- Weapon damage, cooldown, amount, pierce, hitbox, duration, speed, intervals, level deltas and evolved special cases.
- Exact Mad Forest/Library minute waves, enemy stats, stage items/collision layout.
- Character stat/bonus/cost/unlock tables and official Japanese naming.
- Chest eligibility, probabilities, animation reveal/skip timings and full exception tables.
- Multiple original gameplay captures and reference metrics; no screenshot similarity or 30-minute pacing pass follows from these recipe documents.

## Additional community source acquired during Phase 2

[Prabin Pebam / survivors-companion](https://github.com/prabinpebam/survivors-companion/tree/5e345c547ebe39c429d99032aae8e688fa15bfd4), revision `5e345c547ebe39c429d99032aae8e688fa15bfd4` (community snapshot dated 2026-10-27), provides factual weapon/character/stage observations. Its content attributes Vampire Survivors Wiki contributors and declares CC BY-NC-SA 3.0; its app code is MIT, while game art is not licensed for reuse. No game images, prose or executable code were copied into this project. Selected numerical observations and factual relationships were independently expressed with attribution; official PC patch identity remains unknown.

`tools/extract-phase2-facts.py` reads a legitimately acquired local clone to select the numeric facts in `src/data/researched-weapon-values.js` and `src/data/stage-reference.js`. Those generated modules are committed, so building/running the game requires no source download. Source speed percentages do not establish pixels per second; local speed/range/world-unit conversions remain estimated. The generator does not copy article paragraphs, sprites or audio.

Documented behavioral corrections include Bible cooldown extending by base duration, repeatable finite-duration Vespers rings, per-target Garlic hit timing, four-set bird bombardments, the 15-second Pentagram/Moon cooldown floor, and Moon generation/erasure at 3/12.1 seconds after cooldown. Beam acceleration and the brief post-erasure vacuum gap remain authored timing estimates.

The stage tables distinguish the early eligible Forest boss chest from ineligible 3/5/7/9-minute drops. `eligibilityOverride` is explicit chest metadata; the preserved legacy mode retains the previous ten-minute hypothesis solely for local regression. Enemy statistics and exact map/collision geometry have not been verified by these tables.
