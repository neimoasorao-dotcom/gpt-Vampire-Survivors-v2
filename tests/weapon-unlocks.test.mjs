import test from 'node:test';
import assert from 'node:assert/strict';
import { WEAPON_UNLOCKS } from '../src/data/weapon-unlocks.js';

test('the pinned community reference declares exactly six basic weapons available by default', () => {
  const actual = Object.entries(WEAPON_UNLOCKS).filter(([, rule]) => rule.type === 'default').map(([id]) => id).sort();
  assert.deepEqual(actual, ['axe', 'bible', 'knife', 'wand', 'water', 'whip']);
  assert.equal(Object.keys(WEAPON_UNLOCKS).length, 14);
});

test('nondefault weapon rules retain source-observed thresholds and character restriction', () => {
  assert.deepEqual([WEAPON_UNLOCKS.cross.pickup, WEAPON_UNLOCKS.cross.value], ['rosary', 1]);
  assert.deepEqual([WEAPON_UNLOCKS.garlic.pickup, WEAPON_UNLOCKS.garlic.value], ['chicken', 5]);
  assert.equal(WEAPON_UNLOCKS.fire.type, 'breakables');
  assert.equal(WEAPON_UNLOCKS.fire.value, 20);
  assert.equal(WEAPON_UNLOCKS.runetracer.character, 'pasqualina');
  assert.equal(WEAPON_UNLOCKS.runetracer.value, 300);
  assert.equal(WEAPON_UNLOCKS.lightning.value, 5000);
  assert.equal(WEAPON_UNLOCKS.pentagram.value, 1200);
  assert.equal(WEAPON_UNLOCKS.peachone.value, 600);
  assert.deepEqual([WEAPON_UNLOCKS.ebony.weapon, WEAPON_UNLOCKS.ebony.level], ['peachone', 7]);
});

test('every unlock condition retains its pinned source and does not claim official confirmation', () => {
  for (const [id, rule] of Object.entries(WEAPON_UNLOCKS)) {
    assert.match(rule.source, /^https:\/\/github\.com\/prabinpebam\/survivors-companion\/blob\/5e345c547ebe39c429d99032aae8e688fa15bfd4\/site\/data\/detail\/weapon\.[a-z-]+\.json$/, id);
    assert.equal(rule.status, 'estimated');
    assert(rule.confidence > 0 && rule.confidence < 1);
  }
});
