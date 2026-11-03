# Phase 2 weapon unlock observations

Investigated 2026-11-03 (Asia/Tokyo). The observations below were read from each weapon document's introductory facts in the publicly accessible community companion at revision **`5e345c547ebe39c429d99032aae8e688fa15bfd4`**. They are one community reference, **not confirmation of the latest official PC patch**. Confidence: 0.65; status: `community_documented`.

Source attribution: Vampire Survivors Wiki contributors and community companion by Prabin Pebam. The source repository describes its content as CC BY-NC-SA 3.0. This project independently expresses only factual unlock relationships/counts; no original prose, art, executable code or protected game files were copied.

| Local ID | Unlock condition | Exact document |
| --- | --- | --- |
| `whip` | Available by default | [Whip](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.whip.json) |
| `wand` | Available by default | [Magic Wand](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.magic-wand.json) |
| `knife` | Available by default | [Knife](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.knife.json) |
| `axe` | Available by default | [Axe](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.axe.json) |
| `cross` | Pick up a Rosary | [Cross](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.cross.json) |
| `bible` | Available by default | [King Bible](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.king-bible.json) |
| `fire` | Destroy 20 light sources in total | [Fire Wand](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.fire-wand.json) |
| `garlic` | Pick up five Floor Chickens | [Garlic](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.garlic.json) |
| `water` | Available by default | [Santa Water](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.santa-water.json) |
| `runetracer` | Survive five minutes as Pasqualina | [Runetracer](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.runetracer.json) |
| `lightning` | Defeat 5,000 enemies in total | [Lightning Ring](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.lightning-ring.json) |
| `pentagram` | Survive 20 minutes as any character | [Pentagram](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.pentagram.json) |
| `peachone` | Survive 10 minutes as any character | [Peachone](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.peachone.json) |
| `ebony` | Reach Peachone level seven | [Ebony Wings](https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.ebony-wings.json) |

## Integration requirements

`src/data/weapon-unlocks.js` exports the fourteen rule objects. Existing `default`, `totalKills`, `survive` and `reachWeaponLevel` rule types are reused. Integration must additionally support:

- `pickupCount` with `pickup` and `value`, backed by persisted pickup totals (`rosary`, `chicken`).
- `breakables` with `value`, backed by the persisted total of light sources actually broken.
- `survive` with a `character` restriction, backed by that character's best observed run duration; a generic best time is insufficient for Runetracer.

Starting equipment may be supplied by a character even before that weapon has been unlocked for the shared level-up pool. Do not block a selected character's starting weapon based only on the shared-pool rule. Preserve previously discovered/unlocked weapons when migrating saves. Fully unlocked QA fixtures must explicitly set all fourteen weapon flags; they should not be treated as evidence of the new-player pool.

The current official-PC version and patch-specific differences remain unresolved as described in `phase2_sources.md`.
