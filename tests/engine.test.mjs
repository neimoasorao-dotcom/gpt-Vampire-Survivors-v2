import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/gameplay/engine.js';
import { CONFIG, weaponStats } from '../src/data/content.js';
import { computeStats, xpThreshold } from '../src/gameplay/stats.js';
import { RNG } from '../src/core/rng.js';
const DT = 1 / 60;
const ticks = (engine, n, input = { x: 0, y: 0 }) => { for (let i = 0; i < n; i++) engine.step(DT, input); };
const arena = options => { const e = new Engine({ lab: true, enemyDensity: 0, enemySpeed: 0, ...options }); e.options.freezeAI = true; return e; };

test('seeded simulation reproduces fixed inputs, combat, drops and menu selections', () => {
  const simulate = seed => {
    const e = new Engine({ seed, auto: true });
    e.options.invincible = true;
    ticks(e, 6000);
    return { snapshot: e.snapshot(), position: [e.player.x, e.player.y], enemies: e.enemies.map(x => [x.id, x.type, x.x, x.y, x.hp]), weapons: e.weapons, passives: e.passives, rng: e.rng.state, replay: e.replay };
  };
  assert.deepEqual(simulate(149), simulate(149));
  assert.notDeepEqual(simulate(149).position, simulate(150).position);
});
test('fixed tick clock, normalized diagonals and immediate movement preserve speed', () => {
  const e = arena(); ticks(e, 60, { x: 1, y: 1 });
  assert.equal(e.time, 1); assert.equal(e.tick, 60);
  assert.ok(Math.abs(Math.hypot(e.player.x, e.player.y) - CONFIG.moveSpeed) < 1e-9);
  const previous = e.player.x; e.step(DT, { x: -1, y: 0 });
  assert.ok(e.player.x < previous); assert.equal(e.player.facing, -1);
});
test('invalid simulation dt is rejected rather than desynchronizing the fixed clock', () => {
  const e = arena();
  for (const dt of [0, -1, NaN, Infinity, 1 / 30, 1 / 120, .1]) assert.throws(() => e.step(dt), RangeError);
});
test('level-two whip alternates forward then rear with a measurable interval', () => {
  const e = arena({ level: 2 });
  const right = e.spawn('skeleton', 40, -5, { hp: 100, speed: 0 });
  const left = e.spawn('skeleton', -40, -5, { hp: 100, speed: 0 });
  while (!e.metrics.hits) e.step();
  assert.equal(right.hp, 90); assert.equal(left.hp, 100);
  const first = e.tick;
  while (left.hp === 100) e.step();
  assert.equal(left.hp, 90); assert.ok(e.tick - first >= 8 && e.tick - first <= 11);
  assert.deepEqual(e.effects.map(x => x.dir), [1, -1]);
});
test('whip pierces every eligible target but excludes rear and out-of-height targets', () => {
  const e = arena();
  const targets = [20, 40, 60, 80].map(x => e.spawn('skeleton', x, -5, { hp: 100, speed: 0 }));
  const rear = e.spawn('skeleton', -50, -5, { hp: 100, speed: 0 });
  const above = e.spawn('skeleton', 50, -70, { hp: 100, speed: 0 });
  ticks(e, 12);
  assert.deepEqual(targets.map(x => x.hp), [90, 90, 90, 90]);
  assert.equal(rear.hp, 100); assert.equal(above.hp, 100); assert.equal(e.metrics.hits, 4);
});
test('weapon level table accumulates sparse deltas and retains cooldown', () => {
  assert.deepEqual(weaponStats('whip', 8), { damage: 40, cooldown: 1.35, amount: 2, area: 1.3 });
});
test('stats combine character, bounded powerups and passive modifiers once', () => {
  const stats = computeStats('antonio', 60, { heart: 5, spinach: 5, tome: 5 }, { maxHp: 3, might: 5, cooldown: 2, amount: 1 });
  assert.ok(Math.abs(stats.maxHp - 276) < 1e-9);
  assert.equal(stats.might, 2.25); assert.ok(Math.abs(stats.cooldown - .55) < 1e-9); assert.equal(stats.amount, 1);
  assert.equal(computeStats('antonio', 1000).might, 1.5);
});
test('large XP grants queue every level-up and preserve remainder', () => {
  const e = arena(); e.xp(1000);
  let menus = 0;
  while (e.state === 'levelup' && menus < 100) { assert.ok(e.choose(e.choices[0].id)); menus++; }
  let expectedLevel = 1, remainder = 1000;
  while (remainder >= xpThreshold(expectedLevel)) { remainder -= xpThreshold(expectedLevel); expectedLevel++; }
  assert.equal(e.player.level, expectedLevel); assert.equal(menus, expectedLevel - 1); assert.equal(e.player.xp, remainder);
  assert.ok(e.player.xp < e.player.nextXp);
});
test('level-up choices exclude maxed and banished items, unique weighted sampling', () => {
  const e = arena(); e.give('whip', 8); e.banned.add('heart');
  e.xp(5);
  assert.ok(e.choices.every(c => c.id !== 'whip' && c.id !== 'heart'));
  assert.equal(new Set(e.choices.map(c => c.id)).size, e.choices.length);
  const oldRerolls = e.rerolls; e.debug('reroll'); assert.equal(e.rerolls, oldRerolls - 1);
  const id = e.choices[0].id; e.debug('banish', id); assert.ok(e.banned.has(id)); assert.equal(e.banishes, 2);
});
test('six passive slots block new choices while existing items remain upgradeable', () => {
  const e = arena();
  for (const id of ['heart', 'spinach', 'armor', 'pummarola', 'wings', 'attractorb']) assert.ok(e.give(id, 1));
  assert.equal(e.give('crown', 1), false);
  e.makeChoices(); assert.ok(e.choices.every(c => c.kind !== 'passive' || c.id in e.passives));
});
test('chest eligibility depends on drop time, maximum weapon and passive requirement', () => {
  const old = arena(); old.give('whip', 8); old.give('heart', 1); old.debug('time', 1200);
  old.openChest({ eligible: false, born: 590 }); assert.equal(old.weapons.bloody, undefined);
  const missingPassive = arena(); missingPassive.give('whip', 8); missingPassive.debug('time', 601);
  missingPassive.openChest({ eligible: true, born: 601 }); assert.equal(missingPassive.weapons.bloody, undefined);
  const e = arena(); e.give('whip', 8); e.give('heart', 1); e.debug('time', 601);
  e.openChest({ eligible: true, born: 601 });
  assert.equal(e.weapons.bloody, 1); assert.equal(e.weapons.whip, undefined); assert.equal(e.passives.heart, 1);
  assert.equal(e.chestRewards[0].kind, 'evolution'); assert.equal(e.evolutionTime, 601);
});
test('chest collected during level up is queued and processed after selection', () => {
  const e = arena(); e.xp(5); e.openChest({ eligible: false, born: 1 });
  assert.equal(e.state, 'levelup'); assert.equal(e.chestQueue.length, 1);
  e.choose(e.choices[0].id); e.step(); assert.equal(e.state, 'chest'); assert.equal(e.chestQueue.length, 0);
  e.closeChest(); assert.equal(e.state, 'playing');
});
test('contact damage respects armor and invulnerability interval, then death stops simulation', () => {
  const e = arena(); e.options.invincible = false; e.spawn('zombie', 0, 0, { hp: 10000, speed: 0, knockback: 0 });
  const hp = e.player.hp; ticks(e, 20); assert.equal(e.player.hp, hp - 14);
  e.debug('death'); const snapshot = e.snapshot(); ticks(e, 100); assert.deepEqual(e.snapshot(), snapshot);
});
test('XP merges without loss at pickup cap and effect pools remain bounded', () => {
  const e = arena();
  for (let i = 0; i < 1000; i++) e.pickup('xp', 1000, 1000, 2);
  assert.equal(e.pickups.length, CONFIG.pickupLimit); assert.equal(e.pickups.reduce((sum, p) => sum + p.value, 0), 2000);
  for (let i = 0; i < 1000; i++) { e.effect('whip', 0, 0); e.text(1, 0, 0); e.burst(0, 0, '#fff', 5); }
  assert.equal(e.effects.length, 180); assert.equal(e.texts.length, CONFIG.textLimit); assert.equal(e.particles.length, CONFIG.particleLimit);
  ticks(e, 60);
  assert.ok(e.effects.length <= 1); assert.equal(e.texts.length, 0); assert.equal(e.particles.length, 0);
});
test('enemy cap rejects extra spawns and dead objects are recycled with fresh identity', () => {
  const e = arena(); for (let i = 0; i < CONFIG.enemyLimit; i++) assert.ok(e.spawn('bat', 1000, 1000));
  assert.equal(e.spawn('bat'), null);
  const pooled = e.enemies.at(-1), previousId = pooled.id; pooled.hp = 0; e.step();
  const next = e.spawn('skeleton', 200, 200); assert.equal(next, pooled); assert.notEqual(next.id, previousId); assert.equal(next.type, 'skeleton'); assert.equal(next.killed, undefined);
});
test('death records once and late queued rewards cannot resume the dead run', () => {
  const e = arena(), events = []; e.onEvent = type => events.push(type);
  e.finish(false); e.finish(false); e.openChest({ eligible: true, born: 600 }); e.closeChest();
  assert.equal(e.state, 'dead'); assert.equal(events.filter(x => x === 'gameover').length, 1);
});
test('spatial combat rejects NaN input and periodically checks entity coordinates', () => {
  const e = arena(); ticks(e, 60, { x: NaN, y: Infinity }); assert.equal(e.player.x, 0); assert.equal(e.player.y, 0);
  e.spawn('bat', NaN, 0); assert.throws(() => e.assertFinite(), /Nonfinite enemy/);
});
test('seeded weighted sampler handles skew and never selects zero-weight entries', () => {
  const rng = new RNG(22), pool = [{ id: 'zero', weight: 0 }, { id: 'one', weight: 1 }, { id: 'nine', weight: 9 }];
  const count = { zero: 0, one: 0, nine: 0 };
  for (let i = 0; i < 10000; i++) count[rng.weighted(pool).id]++;
  assert.equal(count.zero, 0); assert.ok(count.nine > count.one * 7 && count.nine < count.one * 12);
});
test('stationary target TTK reflects whip cadence and per-hit damage', () => {
  const e = arena(), target = e.spawn('skeleton', 40, -5, { hp: 25, speed: 0, knockback: 0 });
  while (target.hp > 0 && e.tick < 300) e.step();
  assert.equal(e.metrics.hits, 3); assert.equal(e.kills, 1);
  assert.ok(Math.abs(e.time - (.15 + 1.35 * 2)) < .07, `Unexpected TTK ${e.time}`);
});
test('endless first cycle boundary schedules second-cycle bosses with local time', () => {
  const e = new Engine({ endless: true, auto: true }); e.options.invincible = true;
  e.tick = 107999; e.time = e.tick / 60; e.bossIndex = e.definition.bosses.length; e.eventIndex = e.definition.events.length;
  e.step(); assert.equal(e.time, 1800);
  assert.equal(e.bossIndex, 0); assert.equal(e.eventIndex, 0);
  e.tick = 111599; e.time = e.tick / 60;
  e.step(); assert.equal(e.time, 1860); assert.equal(e.bossIndex, 1);
  assert.equal(e.enemies.filter(x => x.boss).length, 1);
});
test('evolution excludes consumed base weapon from subsequent reward candidates', () => {
  const e = arena(); e.give('whip', 8); e.give('heart', 1); e.debug('time', 601); e.openChest({ eligible: true, born: 601 }); e.closeChest();
  for (let i = 0; i < 50; i++) { e.makeChoices(); assert.ok(e.choices.every(c => c.id !== 'whip')); }
});

test('Little Clover increases run luck and persists through stat recomputation instead of granting coins',()=>{const e=new Engine({seed:1});const luck=e.player.stats.luck;e.collect({type:'clover',value:1});assert.equal(e.gold,0);assert.equal(e.player.stats.luck,luck+.1);e.give('heart',1);assert.equal(e.player.stats.luck,luck+.1);});
test('weapon lab validates density and numeric fields before spawning', () => {
  const e = new Engine({ lab: true, enemyDensity: 999999, enemyHp: NaN, enemySpeed: Infinity });
  assert.equal(e.labConfig.enemyDensity, CONFIG.enemyLimit);
  assert.ok(Number.isFinite(e.labConfig.enemyHp)); assert.ok(Number.isFinite(e.labConfig.enemySpeed));
  e.step(); assert.equal(e.enemies.length, CONFIG.enemyLimit); e.assertFinite();
  const empty = new Engine({ lab: true, enemyDensity: -1, enemyHp: -1, enemySpeed: -1 });
  empty.step(); assert.equal(empty.enemies.length, 0); assert.equal(empty.labConfig.enemyHp, 1); assert.equal(empty.labConfig.enemySpeed, 0);
});
test('invalid weapon levels cannot propagate NaN damage into combat', () => {
  const e = arena({ level: NaN });
  const target = e.spawn('skeleton', 40, -5, { hp: 100, speed: 0, knockback: 0 });
  ticks(e, 12); assert.ok(Number.isFinite(target.hp)); assert.equal(e.weapons.whip, 1);
  e.give('whip', NaN); assert.equal(e.weapons.whip, 1); e.assertFinite();
});
