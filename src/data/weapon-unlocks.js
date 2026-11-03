/**
 * Independently expressed unlock facts from one pinned community reference.
 * Not an assertion of the latest official PC patch. No art/prose/code is copied.
 * Attribution and exact source documents: research/phase2_unlocks.md.
 */
const revision = '5e345c547ebe39c429d99032aae8e688fa15bfd4';
const entry = (slug, rule) => ({
  ...rule,
  source: `https://github.com/prabinpebam/survivors-companion/blob/${revision}/site/data/detail/weapon.${slug}.json`,
  sourceRevision: revision,
  status: 'estimated', provenance: 'community_documented',
  confidence: 0.65,
});
export const WEAPON_UNLOCKS = Object.freeze({
  whip: entry('whip', { type: 'default' }),
  wand: entry('magic-wand', { type: 'default' }),
  knife: entry('knife', { type: 'default' }),
  axe: entry('axe', { type: 'default' }),
  cross: entry('cross', { type: 'pickupCount', pickup: 'rosary', value: 1 }),
  bible: entry('king-bible', { type: 'default' }),
  fire: entry('fire-wand', { type: 'breakables', value: 20 }),
  garlic: entry('garlic', { type: 'pickupCount', pickup: 'chicken', value: 5 }),
  water: entry('santa-water', { type: 'default' }),
  runetracer: entry('runetracer', { type: 'survive', character: 'pasqualina', value: 300 }),
  lightning: entry('lightning-ring', { type: 'totalKills', value: 5000 }),
  pentagram: entry('pentagram', { type: 'survive', value: 1200 }),
  peachone: entry('peachone', { type: 'survive', value: 600 }),
  ebony: entry('ebony-wings', { type: 'reachWeaponLevel', weapon: 'peachone', level: 7 }),
});
