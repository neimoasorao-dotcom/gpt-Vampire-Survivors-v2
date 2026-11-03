import {REFERENCED_ENEMIES} from "./world-reference.js";
import {EXTRA_WEAPONS,EXTRA_PASSIVES,EXTRA_EVOLUTIONS} from "./weapon-expansion.js";
import {EXTRA_CHARACTERS,EXTRA_ENEMIES,EXTRA_STAGES,EXTRA_POWERUPS} from "./world-expansion.js";
// All numerical reference hypotheses are estimated until cited reference verification.
export const CONFIG = Object.freeze({
  hz: 60,
  width: 960,
  height: 540,
  moveSpeed: 90,
  playerRadius: 7,
  enemyLimit: 2500,
  pickupLimit: 400,
  particleLimit: 600,
  textLimit: 120,
  spawnRadius: 570,
  cell: 48,
  duration: 1800,
  sourceStatus: "estimated",
});
const n = (ja, en) => ({ ja, en });
export const CHARACTERS = {
  antonio: {
    id: "antonio",
    name: n("アントニオ", "Antonio"),
    description: n(
      "10レベルごとに与ダメージが10%増加（最大50%）。",
      "Gains 10% Might every 10 levels, up to 50%.",
    ),
    startingWeapon: "whip",
    baseStats: {
      maxHp: 120,
      moveSpeed: 1,
      might: 1,
      armor: 1,
      recovery: 0,
      cooldown: 1,
      area: 1,
      amount: 0,
      magnet: 30,
      growth: 1,
      luck: 1,
      greed: 1,
    },
    levelBonuses: [{ every: 10, stat: "might", value: 0.1, cap: 0.5 }],
    cost: 0,
    unlock: { type: "default" },
    specialBehaviors: [],
  },
};
export const WEAPONS = {
  whip: {
    id: "whip",
    name: n("ムチ", "Whip"),
    description: n(
      "横方向に攻撃し、敵を貫通する。",
      "Attacks horizontally and passes through enemies.",
    ),
    maxLevel: 8,
    rarity: 100,
    behavior: "meleeSweep",
    levels: [
      { damage: 10, cooldown: 1.35, amount: 1, area: 1 },
      { amount: 2 },
      { damage: 15 },
      { damage: 20, area: 1.1 },
      { damage: 25 },
      { damage: 30, area: 1.2 },
      { damage: 35 },
      { damage: 40, area: 1.3 },
    ],
  },
  bloody: {
    id: "bloody",
    name: n("ブラッディー・ティア", "Bloody Tear"),
    description: n(
      "クリティカルで大ダメージ。体力を吸収する。",
      "Critical hits and life steal.",
    ),
    maxLevel: 1,
    rarity: 0,
    behavior: "meleeSweep",
    levels: [
      {
        damage: 40,
        cooldown: 1,
        amount: 2,
        area: 1.3,
        crit: 0.1,
        critMultiplier: 2,
        heal: 8,
      },
    ],
  },
};
export const PASSIVES = {
  heart: {
    id: "heart",
    name: n("命の器", "Hollow Heart"),
    description: n("最大体力が20%増加する。", "Raises maximum health by 20%."),
    stat: "maxHp",
    perLevel: 0.2,
    maxLevel: 5,
    rarity: 100,
  },
  spinach: {
    id: "spinach",
    name: n("ほうれん草", "Spinach"),
    description: n(
      "与ダメージが10%増加する。",
      "Raises inflicted damage by 10%.",
    ),
    stat: "might",
    perLevel: 0.1,
    maxLevel: 5,
    rarity: 100,
  },
  armor: {
    id: "armor",
    name: n("アーマー", "Armor"),
    description: n(
      "受けるダメージを1軽減する。",
      "Reduces incoming damage by 1.",
    ),
    stat: "armor",
    perLevel: 1,
    maxLevel: 5,
    rarity: 100,
  },
  pummarola: {
    id: "pummarola",
    name: n("命のトマト", "Pummarola"),
    description: n(
      "毎秒の体力回復量が0.2増加する。",
      "Recovers 0.2 health per second.",
    ),
    stat: "recovery",
    perLevel: 0.2,
    maxLevel: 5,
    rarity: 100,
  },
  wings: {
    id: "wings",
    name: n("翼", "Wings"),
    description: n("移動速度が10%増加する。", "Raises movement speed by 10%."),
    stat: "moveSpeed",
    perLevel: 0.1,
    maxLevel: 5,
    rarity: 100,
  },
  attractorb: {
    id: "attractorb",
    name: n("磁石", "Attractorb"),
    description: n("アイテムの取得範囲が広がる。", "Increases pickup range."),
    stat: "magnet",
    perLevel: 18,
    maxLevel: 5,
    rarity: 100,
  },
  crown: {
    id: "crown",
    name: n("王冠", "Crown"),
    description: n(
      "獲得する経験値が8%増加する。",
      "Grants 8% more experience.",
    ),
    stat: "growth",
    perLevel: 0.08,
    maxLevel: 5,
    rarity: 100,
  },
  tome: {
    id: "tome",
    name: n("白紙の学術書", "Empty Tome"),
    description: n(
      "武器のクールダウンが8%減少する。",
      "Reduces weapon cooldown by 8%.",
    ),
    stat: "cooldown",
    perLevel: -0.08,
    maxLevel: 5,
    rarity: 100,
  },
  candelabrador: {
    id: "candelabrador",
    name: n("燭台", "Candelabrador"),
    description: n("攻撃範囲が10%拡大する。", "Raises attack area by 10%."),
    stat: "area",
    perLevel: 0.1,
    maxLevel: 5,
    rarity: 100,
  },
};
export const ENEMIES = {
  bat: { hp: 1, damage: 5, speed: 36, r: 7, xp: 1, knockback: 1.3 },
  skeleton: { hp: 10, damage: 10, speed: 24, r: 8, xp: 1, knockback: 1 },
  zombie: { hp: 25, damage: 15, speed: 16, r: 9, xp: 2, knockback: 0.8 },
  ghost: { hp: 20, damage: 10, speed: 33, r: 8, xp: 2, knockback: 1 },
  plant: { hp: 40, damage: 15, speed: 0, r: 13, xp: 3, knockback: 0 },
  mantis: {
    hp: 500,
    damage: 25,
    speed: 23,
    r: 22,
    xp: 30,
    knockback: 0.1,
    boss: true,
  },
  werewolf: { hp: 150, damage: 20, speed: 38, r: 11, xp: 4, knockback: 0.5 },
  reaper: { hp: 655350, damage: 65535, speed: 170, r: 15, xp: 0, knockback: 0 },
};
// Explicit minute table; estimated benchmark, NOT a verified recreation of the PC wave table.
const sequence = [
  "bat",
  "skeleton",
  "zombie",
  "skeleton",
  "ghost",
  "zombie",
  "skeleton",
  "ghost",
  "zombie",
  "werewolf",
  "skeleton",
  "ghost",
  "werewolf",
  "zombie",
  "ghost",
  "werewolf",
  "ghost",
  "zombie",
  "werewolf",
  "skeleton",
  "werewolf",
  "ghost",
  "werewolf",
  "zombie",
  "werewolf",
  "ghost",
  "werewolf",
  "ghost",
  "werewolf",
  "werewolf",
];
export const STAGES = {
  forest: {
    id: "forest",
    name: n("狂乱の森", "Mad Forest"),
    description: n(
      "夜の森を30分間生き延びる。",
      "Survive thirty minutes in the forest.",
    ),
    duration: 1800,
    boundary: "infinite",
    music: "forest",
    environment: "forest",
    modifiers: {},
    obstacles: [],
    secrets: [],
    events: [
      { time: 180, type: "plantRing" },
      { time: 600, type: "plantRing" },
    ],
    pickups: [
      { id: "spinach", x: 900, y: 0 },
      { id: "heart", x: -1100, y: 300 },
    ],
    waves: sequence.map((enemy, i) => ({
      start: i * 60,
      end: (i + 1) * 60,
      enemy,
      spawnRate: 2 + i * 0.65,
      maxAlive: 120 + i * 45,
      pattern: i === 12 || i === 28 ? "swarm" : "ring",
      hpScale: 1 + i * 0.12,
    })),
    bosses: [60, 300, 600, 900, 1200, 1500, 1740].map((time) => ({
      time,
      enemy: "mantis",
      chest: true,
    })),
    evolution: { minTime: 600 },
  },
};
export const EVOLUTIONS = [
  {
    id: "bloody",
    base: "whip",
    baseLevel: 8,
    passive: "heart",
    passiveLevel: 1,
    chest: true,
    chestMinTime: 600,
    stage: ["forest"],
    consume: ["whip"],
    replaceSlot: true,
    blacklist: [],
    characterOverride: null,
    type: "evolution",
  },
];
export function weaponStats(id, level) {
  const def = WEAPONS[id];
  const s = {};
  for (let i = 0; i < Math.min(level, def.maxLevel); i++)
    Object.assign(s, def.levels[i]);
  return s;
}
export const POWERUPS = {
  might: { max: 5, cost: 200, value: 0.05 },
  maxHp: { max: 3, cost: 200, value: 0.1 },
  recovery: { max: 5, cost: 200, value: 0.1 },
  armor: { max: 3, cost: 600, value: 1 },
  moveSpeed: { max: 2, cost: 300, value: 0.05 },
  magnet: { max: 2, cost: 300, value: 15 },
  growth: { max: 5, cost: 900, value: 0.03 },
  cooldown: { max: 2, cost: 900, value: -0.025 },
  amount: { max: 1, cost: 5000, value: 1 },
};

// Keep the original pool immutable for the explicitly requested Golden regression mode.
export const LEGACY_ITEM_IDS=new Set([...Object.keys(WEAPONS),...Object.keys(PASSIVES)]);
Object.assign(WEAPONS,EXTRA_WEAPONS);
Object.assign(PASSIVES,EXTRA_PASSIVES);
Object.assign(CHARACTERS,EXTRA_CHARACTERS);
Object.assign(ENEMIES,EXTRA_ENEMIES,REFERENCED_ENEMIES);
Object.assign(STAGES,EXTRA_STAGES);
Object.assign(POWERUPS,EXTRA_POWERUPS);
EVOLUTIONS[0].stage=['forest','library'];
EVOLUTIONS.push(...EXTRA_EVOLUTIONS);
