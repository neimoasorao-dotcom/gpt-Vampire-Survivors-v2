import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveService, defaultSave } from '../src/services/save.js';
import { Input } from '../src/services/input.js';
import { AudioService } from '../src/services/audio.js';
class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(k) { return this.values.get(k) ?? null; }
  setItem(k, v) { this.values.set(k, v); }
}

test('save reload and export/import persist all supported progression', () => {
  const storage = new MemoryStorage(), service = new SaveService(storage), data = defaultSave();
  Object.assign(data, { gold: 1234, totalKills: 987, runs: 4, bestTime: 1800, powerups: { might: 2 }, unlocks: { forest: true }, collection: ['whip'] });
  data.settings.language = 'en';
  service.save(data);
  assert.deepEqual(new SaveService(storage).load(), data);
  const other = new SaveService(new MemoryStorage());
  assert.deepEqual(other.import(service.export(data)), data);
});
test('malformed primary and interrupted primary write recover latest checked backup', () => {
  const storage = new MemoryStorage(), service = new SaveService(storage);
  service.save({ ...defaultSave(), gold: 10 });
  storage.setItem(service.key, '{broken');
  const restored = new SaveService(storage);
  assert.equal(restored.load().gold, 10); assert.equal(restored.recovered, true);
  storage.setItem = (k, v) => { if (k.endsWith('.backup')) storage.values.set(k, v); else throw new Error('blocked'); };
  service.save({ ...defaultSave(), gold: 20 });
  assert.equal(new SaveService(storage).load().gold, 20);
});
test('checksum detects corruption and fallback preserves progression', () => {
  const storage = new MemoryStorage(), service = new SaveService(storage);
  service.save({ ...defaultSave(), gold: 30 });
  const modified = JSON.parse(storage.getItem(service.key)); modified.data.gold = 90000;
  storage.setItem(service.key, JSON.stringify(modified));
  assert.equal(new SaveService(storage).load().gold, 30);
});
test('old partial save migrates, bounds numeric values and restores settings defaults', () => {
  const storage = new MemoryStorage();
  storage.setItem('old', JSON.stringify({ gold: -99, totalKills: 500, powerups: { might: 999 }, settings: { language: 'en', music: 4 } }));
  const data = new SaveService(storage, 'old').load();
  assert.equal(data.saveVersion, 1); assert.equal(data.gold, 0); assert.equal(data.powerups.might, 100);
  assert.equal(data.settings.music, 1); assert.equal(data.settings.sfx, .6); assert.equal(data.totalKills, 500);
});
test('invalid import rejects unsafe/future data without overwriting current save', () => {
  const service = new SaveService(new MemoryStorage()); service.save({ ...defaultSave(), gold: 77 });
  for (const text of ['null', '[]', '{', '{"saveVersion":99}', '{"gold":1,"__proto__":{"polluted":true}}', '{"settings":{"constructor":{}}}', '{"unrelated":true}']) assert.throws(() => service.import(text));
  assert.equal(service.load().gold, 77); assert.equal({}.polluted, undefined);
});
test('unavailable browser storage safely retains current-session save', () => {
  const service = new SaveService(null);
  service.save({ ...defaultSave(), gold: 42 }); assert.equal(service.load().gold, 42); assert.equal(service.persistent, false);
  const denied = new SaveService({ getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } });
  assert.equal(denied.load().gold, 0); assert.equal(denied.save({ ...defaultSave(), gold: 3 }).gold, 3); assert.equal(denied.persistent, false);
});
function target() {
  const listeners = new Map();
  return { listeners, addEventListener(k, v) { listeners.set(k, v); }, removeEventListener(k) { listeners.delete(k); } };
}
test('keyboard movement is normalized and text editing is not intercepted', () => {
  const t = target(), actions = [], input = new Input({ target: t, onAction: a => actions.push(a) });
  let prevented = 0;
  t.listeners.get('keydown')({ code: 'KeyW', target: { tagName: 'DIV' }, preventDefault() { prevented++; } });
  t.listeners.get('keydown')({ code: 'KeyD', target: { tagName: 'DIV' }, preventDefault() { prevented++; } });
  const direction = input.direction(); assert.ok(Math.abs(Math.hypot(direction.x, direction.y) - 1) < 1e-12);
  t.listeners.get('keydown')({ code: 'Enter', target: { tagName: 'INPUT' }, preventDefault() { prevented++; } });
  assert.equal(prevented, 2); assert.deepEqual(actions, ['up', 'right']);
  t.listeners.get('blur')(); assert.deepEqual(input.direction(), { x: 0, y: 0 });
  input.destroy(); assert.equal(t.listeners.size, 0);
});
test('gamepad deadzone, analog movement, dpad normalization and edge-triggered buttons', () => {
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  let pad = { connected: true, axes: [.1, -.1], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { getGamepads: () => [null, pad] } });
  const actions = [], input = new Input({ target: target(), onAction: a => actions.push(a) });
  try {
    input.poll(); assert.deepEqual(input.direction(), { x: 0, y: -0 });
    pad.axes = [.6, 0]; input.poll(); assert.ok(input.direction().x > .4 && input.direction().x < .6);
    pad.buttons[12].pressed = pad.buttons[15].pressed = pad.buttons[0].pressed = true;
    input.poll(); assert.ok(Math.abs(Math.hypot(input.direction().x, input.direction().y) - 1) < 1e-12);
    const confirms = actions.filter(x => x === 'confirm').length; input.poll(); assert.equal(actions.filter(x => x === 'confirm').length, confirms);
    input.gamepadEnabled = false; input.poll(); assert.deepEqual(input.direction(), { x: 0, y: 0 });
    input.gamepadEnabled = true; pad = null; input.poll(); assert.deepEqual(input.direction(), { x: 0, y: 0 });
  } finally { input.destroy(); if (prior) Object.defineProperty(globalThis, 'navigator', prior); else delete globalThis.navigator; }
});
test('audio degrades safely when AudioContext is unsupported', async () => {
  const audio = new AudioService(); assert.equal(await audio.unlock(), false);
  audio.update({ master: 10, music: -1, sfx: NaN }); assert.equal(audio.settings.master, 1); assert.equal(audio.settings.music, 0); assert.equal(audio.settings.sfx, .6);
  audio.event('chest'); audio.tick(1 / 60); audio.stop(); assert.equal(audio.voices.size, 0);
});
test('audio limits live voices, routes gains, resumes suspension, and frees stopped nodes', async () => {
  const prior = globalThis.AudioContext;
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}, setTargetAtTime(value) { this.value = value; } });
  const node = () => ({ connected: false, connect() { this.connected = true; }, disconnect() { this.connected = false; } });
  class FakeContext {
    constructor() { this.currentTime = 1; this.state = 'suspended'; this.destination = node(); }
    createGain() { return { ...node(), gain: param() }; }
    createDynamicsCompressor() { return { ...node(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }; }
    createOscillator() { return { ...node(), frequency: param(), start() {}, stop() {} }; }
    async resume() { this.state = 'running'; }
  }
  globalThis.AudioContext = FakeContext;
  try {
    const audio = new AudioService(); assert.equal(await audio.unlock(), true); assert.equal(audio.context.state, 'running');
    audio.update({ master: .5, music: .2, sfx: .7 });
    assert.ok(Math.abs(audio.master.gain.value - .35) < 1e-12);
    for (let i = 0; i < 1000; i++) audio.tone(440, .1);
    assert.equal(audio.voices.size, 16);
    for (let i = 0; i < 1000; i++) audio.tone(220, .1, { music: true });
    assert.equal(audio.voices.size, 24);
    const voice = [...audio.voices][0]; voice.oscillator.onended(); assert.equal(audio.voices.size, 23);
    audio.stop(); assert.equal(audio.voices.size, 0);
    audio.context.currentTime += 600; audio.tick(600); assert.ok(audio.voices.size <= 4, 'scheduling must skip missed wall-clock beats');
    audio.stop(); assert.equal(audio.voices.size, 0);
  } finally { if (prior) globalThis.AudioContext = prior; else delete globalThis.AudioContext; }
});
