import {WEAPON_UNLOCKS} from "../data/weapon-unlocks.js";
import { CHARACTERS, STAGES, WEAPONS } from '../data/content.js';
const finite = (v, fallback = 0) => Number.isFinite(v) ? Math.max(0, v) : fallback;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

/** Rule values are content hypotheses until independently verified; evaluation is shared. */
export function evaluateUnlock(rule, save, run = {}) {
  if (!rule) return false;
  if (Array.isArray(rule)) return rule.every(r => evaluateUnlock(r, save, run));
  if (rule.all) return rule.all.every(r => evaluateUnlock(r, save, run));
  if (rule.any) return rule.any.some(r => evaluateUnlock(r, save, run));
  const needed = finite(rule.value ?? rule.count ?? rule.level ?? rule.seconds ?? rule.amount, 1);
  const stats = save.stats || {};
  switch (rule.type) {
    case 'default': case 'always': return true;
    case 'all': return (rule.rules || []).every(r => evaluateUnlock(r, save, run));
    case 'any': return (rule.rules || []).some(r => evaluateUnlock(r, save, run));
    case 'kills': case 'totalKills': case 'kill': return finite(save.totalKills) >= needed;
    case 'reachLevel': case 'level': return (rule.stage ? finite(stats.stageLevels?.[rule.stage]) : Math.max(finite(stats.maxLevel), finite(run.level))) >= needed;
    case 'survive': case 'time': if(rule.character)return finite(stats.characterTimes?.[rule.character])>=needed;if (rule.minCurse) return finite(stats.curseSurvival) >= needed; return (rule.stage ? finite(stats.stageTimes?.[rule.stage]) : Math.max(finite(save.bestTime), finite(run.time),...Object.values(stats.stageTimes||{}).map(v=>finite(v)))) >= needed;
    case 'evolve': case 'evolution': return rule.weapon || rule.id ? !!save.unlocks?.[rule.weapon || rule.id] : finite(stats.evolutions) >= needed;
    case 'reachWeaponLevel': return finite(stats.weaponLevels?.[rule.weapon]) >= (rule.level || needed);
    case 'pickupCount':return finite(stats.pickupCounts?.[rule.pickup])>=needed;
    case 'breakables':return finite(stats.breakables)>=needed;
    case 'totalHealing': return finite(stats.totalHealing) >= needed;
    case 'runGold': return finite(stats.bestRunGold) >= needed;
    case 'boss': case 'defeatBoss': return finite(stats.bossKills) >= needed;
    case 'character': case 'unlockCharacter': return !!save.characters?.[rule.id || rule.character];
    case 'pickup': case 'findRelic': return !!save.unlocks?.[rule.id] || (save.collection || []).includes(rule.id);
    case 'runs': return finite(save.runs) >= needed;
    default: return false;
  }
}
export function initializeProgression(save) {
  save.characters = { antonio: true, ...(save.characters || {}) };
  save.stages = { forest: true, ...(save.stages || {}) };
  save.weaponUnlocks ||= {};
  save.sealed ||= [];
  save.stats = { maxLevel: 1, bossKills: 0, evolutions: 0, stageLevels: {}, stageTimes: {}, weaponLevels: {}, totalHealing: 0, bestRunGold: 0, curseSurvival: 0, ...(save.stats || {}) };
  save.stats.pickupCounts||={};save.stats.characterTimes||={};save.stats.breakables||=0;
  for(const[id,rule]of Object.entries(WEAPON_UNLOCKS))save.weaponUnlocks[id]=save.weaponUnlocks[id]===true||(save.collection||[]).includes(id)||evaluateUnlock(rule,save);
  return save;
}
export function characterUnlocked(id, save) {
  const def = CHARACTERS[id];
  return !!def && (!!save.characters?.[id] || evaluateUnlock(def.unlock, save));
}
export function characterAvailable(id, save) {
  return id === 'antonio' || (!!CHARACTERS[id] && !!save.characters?.[id]);
}
export function stageAvailable(id, save) {
  const def = STAGES[id];
  return !!def && (id === 'forest' || !!save.stages?.[id] || evaluateUnlock(def.unlock, save));
}
export function purchaseCharacter(id, save) {
  initializeProgression(save);
  const def = CHARACTERS[id];
  if (!def || characterAvailable(id, save) || !characterUnlocked(id, save)) return false;
  const cost = Math.ceil(finite(def.cost));
  if (finite(save.gold) < cost) return false;
  save.gold -= cost;
  save.characters[id] = true;
  return true;
}
/** Caller commits gold/kills/run counters once; this function commits derived unlock evidence. */
export function applyRunProgress(save, run = {}) {
  initializeProgression(save);
  const stats = save.stats, stage = run.stage || 'forest';
  stats.maxLevel = Math.max(stats.maxLevel, finite(run.level, 1));
  stats.stageLevels[stage] = Math.max(finite(stats.stageLevels[stage]), finite(run.level, 1));
  stats.stageTimes[stage] = Math.max(finite(stats.stageTimes[stage]), finite(run.time));
  stats.bossKills += finite(run.bosses ?? run.bossKills);
  stats.breakables+=finite(run.breakables);
  if(run.character)stats.characterTimes[run.character]=Math.max(finite(stats.characterTimes[run.character]),finite(run.time));
  for(const[id,n]of Object.entries(run.pickupCounts||{}))stats.pickupCounts[id]=finite(stats.pickupCounts[id])+finite(n);
  stats.totalHealing += finite(run.healing);
  stats.bestRunGold = Math.max(stats.bestRunGold, finite(run.gold));
  if(Number.isFinite(run.curseTime))stats.curseSurvival=Math.max(stats.curseSurvival,run.curseTime);else if (finite(run.curse) >= 1.1) stats.curseSurvival = Math.max(stats.curseSurvival, finite(run.time));
  for (const [id, level] of Object.entries(run.weaponLevels || run.weapons || {})) stats.weaponLevels[id] = Math.max(finite(stats.weaponLevels[id]), finite(level));
  const inventory = [...Object.keys(run.weaponLevels||{}), ...Object.keys(run.weapons || {}), ...Object.keys(run.passives || {})];
  save.collection = [...new Set([...(save.collection || []), ...inventory])];
  for (const id of inventory) {
    save.weaponUnlocks[id] = true;
    if (WEAPONS[id]?.rarity === 0) {
      if (!save.unlocks[id]) stats.evolutions++;
      save.unlocks[id] = true;
    }
  }
  for (const [id, def] of Object.entries(CHARACTERS)) if (evaluateUnlock(def.unlock, save, run)) save.unlocks['character-' + id] = true;
  for (const [id, def] of Object.entries(STAGES)) if (id === 'forest' || evaluateUnlock(def.unlock, save, run)) save.stages[id] = true;
  initializeProgression(save);
  return save;
}
