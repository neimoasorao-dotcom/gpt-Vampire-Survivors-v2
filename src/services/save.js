const VERSION = 1;
const SAFE_ID = /^[a-zA-Z0-9_-]{1,64}$/;
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const record = o => o !== null && typeof o === 'object' && !Array.isArray(o);
const number = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export function defaultSave() {
  return {
    saveVersion: VERSION, gold: 0, totalKills: 0, runs: 0, bestTime: 0,
    powerups: {}, unlocks: {}, collection: [],
    settings: { language: 'ja', master: .6, music: .35, sfx: .6, damageNumbers: true, shake: true, flashes: true, performance: false, gamepad: true }
  };
}

function rejectUnsafeKeys(value, depth = 0) {
  if (depth > 12) throw new Error('Save nesting limit exceeded');
  if (!value || typeof value !== 'object') return;
  for (const key of Object.keys(value)) {
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') throw new Error('Unsafe save field');
    rejectUnsafeKeys(value[key], depth + 1);
  }
}

export function normalizeSave(input, strict = false) {
  if (!record(input)) throw new Error('Invalid save object');
  rejectUnsafeKeys(input);
  const version = own(input, 'saveVersion') ? input.saveVersion : 0;
  if (!Number.isInteger(version) || version < 0 || version > VERSION) throw new Error('Unsupported save version');
  if (strict && !['gold', 'settings', 'powerups', 'runs', 'saveVersion'].some(key => own(input, key))) throw new Error('Unrecognized save format');
  const data = defaultSave();
  data.gold = Math.floor(number(input.gold, 0, 0, 1e12));
  data.totalKills = Math.floor(number(input.totalKills, 0, 0, 1e12));
  data.runs = Math.floor(number(input.runs, 0, 0, 1e9));
  data.bestTime = number(input.bestTime, 0, 0, 1e9);
  for (const [key, value] of Object.entries(record(input.powerups) ? input.powerups : {}).slice(0, 256)) {
    if (SAFE_ID.test(key) && typeof value === 'number' && Number.isFinite(value)) data.powerups[key] = Math.floor(number(value, 0, 0, 100));
  }
  for (const [key, value] of Object.entries(record(input.unlocks) ? input.unlocks : {}).slice(0, 1024)) {
    if (SAFE_ID.test(key) && typeof value === 'boolean') data.unlocks[key] = value;
  }
  if (Array.isArray(input.collection)) data.collection = [...new Set(input.collection.filter(x => typeof x === 'string' && SAFE_ID.test(x)))].slice(0, 1024);
  if (record(input.settings)) {
    const settings = input.settings;
    if (settings.language === 'en' || settings.language === 'ja') data.settings.language = settings.language;
    for (const key of ['master', 'music', 'sfx']) data.settings[key] = number(settings[key], data.settings[key], 0, 1);
    for (const key of ['damageNumbers', 'shake', 'flashes', 'performance', 'gamepad']) if (typeof settings[key] === 'boolean') data.settings[key] = settings[key];
  }
  return data;
}

function checksum(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

export class SaveService {
  constructor(storage, key = 'vs-reconstruction.save.v1') {
    if (storage === undefined) {
      try { storage = globalThis.localStorage; } catch { storage = null; }
    }
    this.storage = storage || null;
    this.key = key;
    this.revision = 0;
    this.persistent = !!this.storage;
    this.lastError = null;
    this.recovered = false;
    this.memory = defaultSave();
  }
  defaultSave() { return defaultSave(); }
  decode(text) {
    if (typeof text !== 'string' || text.length > 1_000_000) throw new Error('Invalid save size');
    const value = JSON.parse(text);
    if (record(value) && own(value, 'data') && own(value, 'checksum')) {
      if (typeof value.checksum !== 'string' || checksum(JSON.stringify(value.data)) !== value.checksum) throw new Error('Save checksum mismatch');
      return { data: normalizeSave(value.data), revision: number(value.revision, 0, 0, 1e12) };
    }
    return { data: normalizeSave(value), revision: 0 };
  }
  load() {
    this.recovered = false;
    if (!this.storage) return structuredClone(this.memory);
    const candidates = [];
    for (const key of [this.key, this.key + '.backup']) {
      try {
        const raw = this.storage.getItem(key);
        if (raw !== null) candidates.push({ ...this.decode(raw), backup: key !== this.key });
      } catch (error) { this.lastError = error.message; }
    }
    candidates.sort((a, b) => b.revision - a.revision);
    if (candidates.length) {
      const saved = candidates[0];
      this.memory = saved.data;
      this.revision = saved.revision;
      this.recovered = saved.backup;
    }
    return structuredClone(this.memory);
  }
  save(input) {
    const data = normalizeSave(input);
    this.memory = data;
    this.revision++;
    if (this.storage) {
      const text = JSON.stringify({ revision: this.revision, checksum: checksum(JSON.stringify(data)), data });
      // Write the recovery copy first; either complete write can recover an interrupted save.
      let written = false;
      for (const key of [this.key + '.backup', this.key]) {
        try { this.storage.setItem(key, text); written = true; }
        catch (error) { this.lastError = error.message; }
      }
      this.persistent = written;
    } else this.persistent = false;
    return structuredClone(data);
  }
  export(data = this.memory) { return JSON.stringify(normalizeSave(data), null, 2); }
  import(text) {
    if (typeof text !== 'string' || text.length > 1_000_000) throw new Error('Invalid save size');
    const parsed = JSON.parse(text);
    const data = normalizeSave(parsed, true);
    return this.save(data);
  }
}
