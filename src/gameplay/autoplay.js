/** Deterministic QA player. Enemy AI is unchanged. No RNG or privileged combat actions. */
import {weaponStats} from '../data/content.js';
const directions=Array.from({length:8},(_,i)=>({x:Math.cos(i*Math.PI/4),y:Math.sin(i*Math.PI/4)}));directions.push({x:0,y:0});
export class Autoplay{
 constructor(engine){this.e=engine;this.nextTick=0;this.last={x:0,y:0};}
 direction(){const e=this.e,p=e.player;if(e.tick<this.nextTick)return this.last;this.nextTick=e.tick+8;
 let target=null,best=Infinity;for(const g of e.pickups){const d=Math.hypot(g.x-p.x,g.y-p.y),weight=g.type==='chest'?.3:g.type==='chicken'&&p.hp<p.maxHp*.6?.2:g.type==='xp'?1:2;const score=d*weight;if(d<1100&&score<best){best=score;target=g;}}
 const nearby=[];let nearest=null,nearestD=Infinity;for(const t of e.enemies){if(t.hp<=0)continue;const d=Math.hypot(t.x-p.x,t.y-p.y);if(d<nearestD){nearestD=d;nearest=t;}if(d<210)nearby.push(t);}
 const aura=e.weapons.soul?'soul':e.weapons.garlic?'garlic':null;const w=aura?weaponStats(aura,e.weapons[aura]):null;
 const range=w?w.range*(w.area||1)*p.stats.area:e.weapons.bible||e.weapons.vespers?60*p.stats.area:100;
 const chase=!target&&nearest&&nearestD>range*.75;const goal=target||(chase?nearest:null);const before=goal?Math.hypot(goal.x-p.x,goal.y-p.y):0;
 const step=45*p.stats.moveSpeed;let bestScore=-Infinity,chosen=directions[8];
 for(const dir of directions){const x=p.x+dir.x*step,y=p.y+dir.y*step;let score=goal?(before-Math.hypot(goal.x-x,goal.y-y))/Math.max(1,step)*3:-(dir.x*dir.x+dir.y*dir.y)*.1;
 if(e.definition.boundary==='horizontal'&&(y<e.definition.bounds.minY+14||y>e.definition.bounds.maxY-14))score-=100;
 for(const b of e.worldSystem.obstaclesAt(x,12))if(x>b.x-12&&x<b.x+b.width+12&&y>b.y-12&&y<b.y+b.height+12)score-=100;
 for(const t of nearby){const d=Math.hypot(t.x-x,t.y-y),contact=t.r+14;const fragile=w&&t.hp<=w.damage*p.stats.might&&Math.hypot(t.x-p.x,t.y-p.y)<range+t.r;
  if(d<contact)score-=fragile?1:40+(contact-d)*2;
  const safe=aura?Math.max(contact+5,range*.65):62;
  if(d<safe)score-=Math.pow((safe-d)/safe,2)*(fragile?.2:5);
 }
 if(score>bestScore){bestScore=score;chosen=dir;}
 }
 this.last={x:Math.abs(chosen.x)<1e-8?0:chosen.x,y:Math.abs(chosen.y)<1e-8?0:chosen.y};return this.last;
 }
}
