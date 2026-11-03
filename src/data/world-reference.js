import {STAGE_REFERENCE} from './stage-reference.js';
// These are independently authored enemy stats. Timetables/names/minimums/intervals are documented;
// enemy HP/speed/radius and world-unit conversions remain estimated.
const templates={bat:{hp:1,damage:5,speed:36,xp:1,r:7},mob:{hp:20,damage:10,speed:24,xp:1,r:8},heavy:{hp:100,damage:20,speed:18,xp:3,r:12},plant:{hp:60,damage:15,speed:3,xp:2,r:13}};
function archetype(name){if(/Bat|Pipeestrello/i.test(name))return'bat';if(/Flower|Venus/.test(name))return'plant';if(/Giant|Colossal|Big|Werewolf|Mummy|Lionhead/.test(name))return'heavy';return'mob';}
export const REFERENCED_ENEMIES={};
export const slug=name=>'ref_'+name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
for(const rows of Object.values(STAGE_REFERENCE))for(const row of rows)for(const raw of [...row.enemyNames,row.bossName]){if(!raw||raw==='-'||raw==='The Reaper')continue;const name=raw.trim();if(!name)continue;const id=slug(name),kind=archetype(name);REFERENCED_ENEMIES[id]={id,name:{ja:name,en:name},...templates[kind],knockback:1,freezeResistance:0,boss:false,visualScale:kind==='heavy'?1.2:1,movementBehavior:/Medusa|Witch|Ghost/.test(name)?'weave':'chase',sourceStatus:'estimated',referenceName:name,renderAs:kind==='bat'?'bat':kind==='plant'?'plant':/Skeleton/.test(name)?'skeleton':/Ghost|Ectoplasm/.test(name)?'ghost':/Mummy|Mudman|Elemental/.test(name)?'zombie':/Medusa|Sneaky|Testa/.test(name)?'medusa':/Witch|Hag/.test(name)?'hag':'werewolf'};}
export function stageReference(id){const rows=STAGE_REFERENCE[id];return{reaperInterval:rows.at(-1).interval||60,
 waves:rows.filter(r=>r.start<1800).map((r,i)=>({start:r.start,end:r.start+60,enemies:r.enemyNames.filter(s=>s.trim()&&s!=='-').map(name=>({enemy:slug(name.trim()),weight:1})),minimum:r.minimum,interval:r.interval,maxAlive:2500,hpScale:1+i*.08,pattern:id==='forest'?'ring':'edges'})),
 bosses:rows.filter(r=>r.start<1800&&r.bossName).map(r=>({time:r.start,enemy:slug(r.bossName),chest:r.chest,evolutionEligible:r.evolutionEligible,chestProbabilities:r.chestProbabilities})),
 events:rows.flatMap(r=>r.start>=1800?[]:r.eventNames.map(type=>({time:r.start,type:type==='Flower Wall'?'plantRing':'swarm',enemy:type==='Flower Wall'?'plant':'bat',count:type==='Flower Wall'?50:35,duration:type==='Flower Wall'?30:8})))
};}
