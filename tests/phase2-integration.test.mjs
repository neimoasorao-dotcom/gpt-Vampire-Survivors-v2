import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/gameplay/engine.js';
import { WEAPONS,PASSIVES,CHARACTERS,STAGES } from '../src/data/content.js';
const BASE=['whip','wand','knife','axe','cross','bible','fire','garlic','water','runetracer','lightning','pentagram','peachone','ebony'];
const PASSIVE=['spinach','armor','heart','pummarola','tome','candelabrador','bracer','spellbinder','duplicator','wings','attractorb','clover','crown','mask','skull'];
function arena(weapons){const e=new Engine({lab:true,enemyDensity:0,enemySpeed:0,seed:81});e.weapons={};for(const id of weapons)e.give(id,WEAPONS[id].maxLevel);e.options.freezeAI=true;e.options.invincible=true;e.lights=[];e.stagePickups=[];for(let i=0;i<48;i++){const a=i*Math.PI/24,r=35+Math.floor(i/12)*42;e.spawn('skeleton',Math.cos(a)*r,Math.sin(a)*r,{hp:1e6,speed:0,knockback:0,xp:0});}return e;}

test('Phase2 content registry exposes fourteen distinct base weapons and all fifteen passives',()=>{for(const id of BASE){assert(WEAPONS[id],id);assert(WEAPONS[id].name.ja);assert(WEAPONS[id].name.en);}for(const id of PASSIVE){assert(PASSIVES[id],id);assert(PASSIVES[id].name.ja);}assert(new Set(BASE.map(id=>WEAPONS[id].behavior)).size>=10,'Weapon behaviors must differ, not just artwork');});

test('mixed six-weapon build invokes each weapon damage path without a hidden Whip substitute',()=>{const ids=['wand','knife','axe','cross','bible','garlic'];const e=arena(ids);for(let i=0;i<1200;i++){e.step();e.pickups.length=0;}for(const id of ids)assert((e.metrics.damageByWeapon[id]||0)>0,`${id} did not inflict own damage`);assert.equal(e.metrics.damageByWeapon.whip,undefined);assert(e.projectiles.length>0);e.assertFinite();});

test('six weapon slots exclude new weapons but preserve existing upgrade candidates',()=>{const e=new Engine({lab:true,enemyDensity:0});e.weapons={};for(const id of BASE.slice(0,6))e.give(id,1);for(let i=0;i<30;i++){e.makeChoices();for(const choice of e.choices)if(choice.kind==='weapon')assert(Object.hasOwn(e.weapons,choice.id));}});

test('all playable character definitions create their declared weapon and finite starting statistics',()=>{const ids=['antonio','imelda','pasqualina','gennaro','arca','porta','lama','poe','clerici','dommario','krochi'];for(const id of ids){assert(CHARACTERS[id],id);const e=new Engine({character:id,lab:true,enemyDensity:0});assert.equal(e.character,id);assert(e.weapons[CHARACTERS[id].startingWeapon],id);assert(WEAPONS[CHARACTERS[id].startingWeapon],id);for(const key of ['maxHp','moveSpeed','might','cooldown','area','speed','duration'])assert(Number.isFinite(e.player.stats[key]),`${id}.${key}`);e.step();e.assertFinite();}});

test('Library corridor constrains vertical travel while Forest stays unbounded',()=>{assert(STAGES.library);const library=new Engine({stage:'library',lab:true,enemyDensity:0}),forest=new Engine({stage:'forest',lab:true,enemyDensity:0});for(let i=0;i<600;i++){library.step(1/60,{x:0,y:1});forest.step(1/60,{x:0,y:1});}assert(Math.abs(library.player.y)<=210);assert(forest.player.y>500);assert.notDeepEqual(STAGES.library.waves,STAGES.forest.waves);});
