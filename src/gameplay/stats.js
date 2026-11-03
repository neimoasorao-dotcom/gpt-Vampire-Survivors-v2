import {CHARACTERS,PASSIVES,POWERUPS} from '../data/content.js';
import {applyModifiers} from '../core/modifiers.js';
export function computeStats(character,level,passives={},powerups={},context={}){
 const def=CHARACTERS[character]||CHARACTERS.antonio;
 const s={maxHp:100,moveSpeed:1,might:1,armor:0,recovery:0,cooldown:1,area:1,speed:1,duration:1,amount:0,magnet:30,growth:1,luck:1,greed:1,curse:1,revival:0,...def.baseStats};let hp=1;
 // Preserve the established additive baseline; layer order is explicit for contextual modifiers.
 for(const b of def.levelBonuses||[]){const times=b.atLevel!=null?Number(level>=b.atLevel):Math.floor(level/b.every);const v=times*b.value;const cap=b.cap==null?Infinity:Math.abs(b.cap);s[b.stat]=(s[b.stat]||0)+Math.sign(v)*Math.min(cap,Math.abs(v));}
 applyModifiers(s,(def.modifiers||[]).filter(m=>level>=(m.minLevel??1)&&level<=(m.maxLevel??Infinity)));
 for(const[id,rank]of Object.entries(powerups)){const d=POWERUPS[id];if(!d)continue;const v=d.value*Math.min(d.max,Math.max(0,rank));if(id==='maxHp')hp+=v;else s[id]=(s[id]??0)+v;}
 for(const[id,rank]of Object.entries(passives)){const d=PASSIVES[id];if(!d)continue;const bounded=Math.min(d.maxLevel,Math.max(0,rank));const v=d.perLevel*bounded;if(d.stat==='maxHp')hp+=v;else if(d.op==='multiply')s[d.stat]*=1+v;else s[d.stat]=(s[d.stat]||0)+v;}
 s.maxHp*=hp;applyModifiers(s,context.stage||[]);applyModifiers(s,context.arcana||[]);applyModifiers(s,context.temporary||[]);applyModifiers(s,context.other||[]);
 s.cooldown=Math.max(.1,s.cooldown);s.moveSpeed=Math.max(.1,s.moveSpeed);s.area=Math.max(.1,s.area);s.speed=Math.max(.1,s.speed);s.duration=Math.max(.1,s.duration);s.amount=Math.floor(Math.max(0,s.amount));s.maxHp=Math.max(1,s.maxHp);return s;
}
export function xpThreshold(level){return level<20?5+(level-1)*10:level<40?195+(level-20)*13:455+(level-40)*16;}
