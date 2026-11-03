import { EXTRA_WEAPONS } from '../data/weapon-expansion.js';
const TAU = Math.PI * 2;
const PROJECTILE_LIMIT = 4096;
const HIT_RETRY_TICKS = 15;
const sq = (x,y) => x*x+y*y;
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const remove = (a,i)=>{a[i]=a[a.length-1];a.pop();};
function statsFor(id,level){const d=EXTRA_WEAPONS[id];const s={};for(let i=0;i<Math.min(level,d.maxLevel);i++)Object.assign(s,d.levels[i]);return s;}
function segmentDistanceSquared(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay;const t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);return sq(x-ax-t*dx,y-ay-t*dy);}

/** Independent behaviors share collision/pooling, not their attack algorithms. */
export class WeaponSystem {
  constructor(engine){
    this.engine=engine;
    this.cooldowns=new Map();
    this.delayed=[];
    this.free=[];
    this.direction={x:1,y:0};
    this.serial=0;
    this.metrics={};this.auraHits=new Map();
  }
  metric(id){return this.metrics[id]??=( {attacks:0,hits:0,damage:0,projectiles:0,maxRange:0,targetHits:0} );}
  nearest(x,y){let target=null,best=Infinity;for(const e of this.engine.enemies){if(e.hp<=0)continue;const d=sq(e.x-x,e.y-y);if(d<best){best=d;target=e;}}return target;}
  randomTarget(){const a=this.engine.enemies;if(!a.length)return null;for(let i=0;i<8;i++){const e=a[this.engine.rng.int(a.length)];if(e.hp>0)return e;}return this.nearest(this.engine.player.x,this.engine.player.y);}
  projectile(id,data){
    const e=this.engine;const limit=statsFor(id,e.weapons[id]||1).poolLimit||PROJECTILE_LIMIT;if(e.projectiles.length>=PROJECTILE_LIMIT||e.projectiles.filter(p=>p.weapon===id).length>=limit)return null;
    const p=this.free.pop()||{hitTimes:new Map()};
    const hitTimes=p.hitTimes;for(const k of Object.keys(p))if(k!=='hitTimes')delete p[k];hitTimes.clear();
    Object.assign(p,{id:++this.serial,weapon:id,type:id,x:e.player.x,y:e.player.y-8,r:4,vx:0,vy:0,life:2,maxLife:2,age:0,angle:0,pierce:1,mode:'linear',damage:1,hitTimes,...data});
    p.maxLife=p.life;e.projectiles.push(p);e.metrics.projectilesCreated++;this.metric(id).projectiles++;e.event('projectile',p);return p;
  }
  recycle(i){const p=this.engine.projectiles[i];if(p.hitTimes){p.hitTimes.clear();this.free.push(p);}remove(this.engine.projectiles,i);}
  effect(id,x,y,life,data={}){this.engine.effect(id,x,y,life,{weapon:id,...data});}
  hit(target,damage,id,dir=1,critChance=0,critMultiplier=2){
    if(target.hp<=0)return false;const e=this.engine,m=this.metric(id);const crit=critChance>0&&e.rng.next()<critChance*(e.player.stats.luck||1);const before=e.damage;
    const kx=target.kx,ky=target.ky;e.damageEnemy(target,damage*(crit?critMultiplier:1),dir,id,crit);if(id==='garlic'||id==='soul'){target.kx=kx;target.ky=ky;target.knockbackVulnerability=.2;}m.hits++;m.damage+=e.damage-before;m.targetHits++;if(crit)e.metrics.crit++;return target.hp<=0;
  }
  area(id,x,y,r,damage,{heal=false,knockback=false}={}){
    const e=this.engine;let hits=0;
    e.grid.query(x,y,r+28,target=>{if(target.hp<=0||sq(target.x-x,target.y-y)>(r+target.r)**2)return;const killed=this.hit(target,damage,id,target.x>x?1:-1);hits++;
      if(knockback){const dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy)||1;target.kx+=dx/d*20*target.knockback;target.ky+=dy/d*20*target.knockback;}
      if(heal&&killed&&e.rng.next()<.1)e.heal(1);
    });return hits;
  }
  queue(delay,action){if(this.delayed.length<1000)this.delayed.push({delay,...action});}
  spawnZone(id,x,y,w,s){this.effect(id,x,y,w.duration*(s.duration||1),{zone:true,r:w.range*s.area,range:w.range*s.area,initialR:w.range*s.area,damage:w.damage*s.might,pulse:0,interval:w.hitDelay||.5,growing:id==='borra',growth:0});}
  cast(id,w){
    const e=this.engine,p=e.player,s=p.stats,m=this.metric(id),d=EXTRA_WEAPONS[id];const amount=Math.max(1,Math.min(64,Math.floor((w.amount||1)+(s.amount||0)))),speed=(w.speed||0)*(s.speed||1),damage=w.damage*s.might,area=s.area||1;
    const aim=this.direction;let count=0;
    const launch=(data)=>{const proj=this.projectile(id,{damage,r:4*area*(w.area||1),pierce:w.pierce??1,life:w.life||(w.duration||3)*(s.duration||1),crit:w.crit||0,critMultiplier:w.critMultiplier||2,hitRetry:Math.max(1,Math.round((w.hitDelay||.25)*60)),...data});if(proj)count++;return proj;};
    switch(d.behavior){
      case 'nearestProjectile':{
        const target=this.nearest(p.x,p.y);if(!target)return false;
        for(let i=0;i<amount;i++)this.queue(i*(w.interval??.1),{kind:'aimed',id,w:{...w},targetX:target.x,targetY:target.y});break;
      }
      case 'directionalProjectile':
        for(let i=0;i<amount;i++)this.queue(i*(w.interval??.1),{kind:'directional',id,w:{...w},dx:aim.x,dy:aim.y});break;
      case 'ballisticArc':
        for(let i=0;i<amount;i++)launch({mode:'arc',x:p.x+(i-(amount-1)/2)*6,y:p.y-14,vx:((i-(amount-1)/2)*65+p.facing*35)*(s.speed||1),vy:-250*(s.speed||1),gravity:270,angle:0,r:8*area*(w.area||1)});break;
      case 'radialSpiral':
        for(let i=0;i<amount;i++){const a=i/amount*TAU;launch({mode:'spiral',vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:a,r:12*area,life:3*(s.duration||1)});}break;
      case 'boomerang':{
        const target=this.nearest(p.x,p.y),a=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(aim.y,aim.x);
        for(let i=0;i<amount;i++){const spread=(i-(amount-1)/2)*.18;launch({mode:'boomerang',vx:Math.cos(a+spread)*speed,vy:Math.sin(a+spread)*speed,angle:a+spread,turnAt:.65,turned:false,r:8*area*(w.area||1)});}break;
      }
      case 'orbit':case 'permanentOrbit':{

        for(let i=0;i<amount;i++)launch({mode:'orbit',orbitOffset:i/amount*TAU,angularSpeed:speed,range:w.range*area*(w.area||1),life:w.duration*(s.duration||1),r:7*area*(w.area||1),angle:i/amount*TAU});break;
      }
      case 'randomFireball':case 'piercingFireball':
        for(let i=0;i<amount;i++){const t=this.randomTarget();if(!t)continue;const a=Math.atan2(t.y-p.y,t.x-p.x)+(i-(amount-1)/2)*.08;launch({vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:a,r:7*area*(w.area||1)});}if(!count)return false;break;
      case 'aura':case 'healingAura':{
        const r=w.range*area*(w.area||1);count=0;this.effect(id,p.x,p.y,w.cooldown*s.cooldown+.08,{aura:true,r,range:r});m.maxRange=Math.max(m.maxRange,r);break;
      }
      case 'persistentGround':case 'growingGround':
        for(let i=0;i<amount;i++){const target=this.randomTarget();const a=e.rng.next()*TAU,rr=70+e.rng.next()*130;const x=target?target.x:p.x+Math.cos(a)*rr,y=target?target.y:p.y+Math.sin(a)*rr;
          const dx=x-p.x,dy=y-p.y;launch({mode:'waterBottle',x:p.x,y:p.y-8,vx:dx/.45,vy:dy/.45-120,gravity:240,targetX:x,targetY:y,life:.45,r:4*area,zoneStats:{...w},landAt:.45});}break;
      case 'bouncingProjectile':case 'explosiveRicochet':
        for(let i=0;i<amount;i++){const a=e.rng.next()*TAU;launch({mode:'ricochet',vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:w.duration*(s.duration||1),angle:a,r:5*area*(w.area||1),explosive:id==='nofuture',lastExplosion:-Infinity});}break;
      case 'targetedLightning':case 'echoLightning':
        for(let i=0;i<amount;i++){const t=this.randomTarget();if(!t)continue;const x=t.x,y=t.y,r=w.range*area*(w.area||1);count+=this.area(id,x,y,r,damage);this.effect(id,x,y,.35,{r,range:r});m.maxRange=Math.max(m.maxRange,Math.hypot(x-p.x,y-p.y)+r);if(id==='thunder')this.queue(.65,{kind:'lightning',id,x,y,r,damage});}break;
      case 'screenWipe':case 'harvestWipe':{
        if(id==='moon'){for(let i=0;i<20;i++)this.queue(3+9*Math.pow(i/20,.6),{kind:'moonBeam',id});this.queue(12.1,{kind:'moonWipe',id});this.queue(12.5,{kind:'moonVacuum',id});this.effect(id,p.x,p.y,3,{r:35,phase:'generation'});break;}
        const retain=id==='moon'||e.rng.next()<Math.min(1,w.retain*(s.luck||1));
        const killed=[];for(const target of e.enemies)if(target.hp>0&&target.type!=='reaper'&&Math.abs(target.x-p.x)<480+target.r&&Math.abs(target.y-p.y)<270+target.r){killed.push({target,x:target.x,y:target.y});}
        for(const {target,x,y} of killed){if(retain){this.hit(target,target.hp,id);if(id==='moon')e.pickup('xp',x,y,3);}else{const hp=target.hp;target.hp=0;target.killed=true;e.kills++;e.damage+=hp;e.metrics.hits++;e.metrics.damageByWeapon[id]=(e.metrics.damageByWeapon[id]||0)+hp;if(target.boss)e.bossKills++;e.modifiers.emit('onKill',{enemy:target});e.event('enemyDeath',{enemy:target});m.hits++;m.damage+=hp;}}
        if(!retain){for(let i=e.pickups.length-1;i>=0;i--){const g=e.pickups[i];if(Math.abs(g.x-p.x)<480&&Math.abs(g.y-p.y)<270)e.recycle('pickups',i);}}
        if(id==='moon')for(const gem of e.pickups)if(gem.type==='xp')gem.magnetized=true;
        count=killed.length;this.effect(id,p.x,p.y,1,{r:540,range:540,retain});m.maxRange=550;break;
      }
      case 'rotatingBombardment':case 'reverseBombardment':case 'dualBombardment':{
        const directions=id==='vandalier'?[1,-1]:[id==='ebony'?-1:1];
        const sets=Math.max(1,Math.ceil((w.duration||4)*(s.duration||1)));
        for(let set=0;set<sets;set++){const dir=id==='vandalier'?(set%2?-1:1):directions[0];for(let i=0;i<amount;i++)this.queue(set*(s.cooldown||1)+i*(w.interval??.025)*(s.cooldown||1),{kind:'bird',id,w:{...w},dir,angle:(e.time+set*(s.cooldown||1))*.7*dir,offset:i*.12});}break;
      }
      default:return false;
    }
    m.attacks++;e.metrics.attacks++;e.event('weapon',{id});if(count){e.metrics.attackTargets.push(count);if(e.metrics.attackTargets.length>300)e.metrics.attackTargets.shift();}return true;
  }
  delayedCast(action){
    const e=this.engine,p=e.player,s=p.stats,id=action.id,w=action.w;
    if(!e.weapons[id])return;
    if(action.kind==='moonBeam'){const t=this.nearest(p.x,p.y);if(t&&Math.abs(t.x-p.x)<480&&Math.abs(t.y-p.y)<270&&t.type!=='reaper'){const x=t.x,y=t.y;this.hit(t,t.hp,id);e.pickup('xp',x,y,1);this.effect(id,x,y,.2,{r:15,phase:'beam'});}return;}
    if(action.kind==='moonWipe'){for(const t of e.enemies)if(t.hp>0&&t.type!=='reaper'&&Math.abs(t.x-p.x)<480&&Math.abs(t.y-p.y)<270){const x=t.x,y=t.y;this.hit(t,t.hp,id);e.pickup('xp',x,y,1);}this.effect(id,p.x,p.y,.4,{r:540,phase:'erasure'});return;}
    if(action.kind==='moonVacuum'){for(const gem of e.pickups)if(gem.type==='xp')gem.magnetized=true;return;}
    if(action.kind==='lightning'){this.area(id,action.x,action.y,action.r,action.damage);this.effect(id,action.x,action.y,.35,{r:action.r,range:action.r});return;}
    const data={damage:w.damage*s.might,r:4*(s.area||1)*(w.area||1),pierce:w.pierce??1,life:w.life||2};
    if(action.kind==='aimed'||action.kind==='directional'){
      let dx=action.dx,dy=action.dy;
      if(action.kind==='aimed'){const t=this.nearest(p.x,p.y);dx=(t?.x??action.targetX)-p.x;dy=(t?.y??action.targetY)-p.y;const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;}
      this.projectile(id,{...data,vx:dx*w.speed*(s.speed||1),vy:dy*w.speed*(s.speed||1),angle:Math.atan2(dy,dx)});
    }else if(action.kind==='bird'){
      const a=action.angle??e.time*.7*action.dir,rr=w.range,cx=p.x+Math.cos(a)*rr,cy=p.y+Math.sin(a)*rr*.65;
      const spread=e.rng.next()*TAU,rad=Math.sqrt(e.rng.next())*35*(s.area||1)*(w.area||1),x=cx+Math.cos(spread)*rad,y=cy+Math.sin(spread)*rad;
      const birdX=p.x+Math.cos(e.time*1.8*action.dir)*25,birdY=p.y-35+Math.sin(e.time*1.8)*8;
      this.projectile(id,{...data,mode:'bomb',x:birdX,y:birdY,vx:(x-birdX)/.45,vy:(y-birdY)/.45,targetX:x,targetY:y,life:.45,blastRadius:22*(s.area||1)*(w.area||1),r:3*(s.area||1)});
    }
  }
  explosion(p,x,y){this.area(p.weapon,x,y,25*(this.engine.player.stats.area||1),p.damage*.5);this.effect(p.weapon,x,y,.2,{r:25,range:25,explosion:true});}
  collide(p,oldX,oldY){
    const e=this.engine,dx=p.x-oldX,dy=p.y-oldY,queryR=Math.hypot(dx,dy)/2+p.r+28;let hits=0;
    e.grid.query((p.x+oldX)/2,(p.y+oldY)/2,queryR,target=>{
      if(target.hp<=0||p.pierce<=0)return;
      const last=p.hitTimes.get(target.id);if(last!==undefined&&e.tick-last<(p.hitRetry||HIT_RETRY_TICKS))return;
      if(segmentDistanceSquared(target.x,target.y,oldX,oldY,p.x,p.y)>(target.r+p.r)**2)return;
      p.hitTimes.set(target.id,e.tick);this.hit(target,p.damage,p.weapon,p.vx>=0?1:-1,p.crit,p.critMultiplier);hits++;
      if(p.mode!=='orbit'&&p.mode!=='ricochet'&&p.mode!=='boomerang'&&p.mode!=='spiral')p.pierce--;
      if(p.explosive&&e.tick-p.lastExplosion>6){p.lastExplosion=e.tick;this.explosion(p,p.x,p.y);}
    });
    if(hits){e.metrics.attackTargets.push(hits);if(e.metrics.attackTargets.length>300)e.metrics.attackTargets.shift();}
    for(const l of e.lights||[])if(l.alive&&segmentDistanceSquared(l.x,l.y-8,oldX,oldY,p.x,p.y)<(p.r+7)**2){l.alive=false;l.respawn=e.time+60;e.dropLight(l);if(p.mode==='linear')p.pierce--;}
  }
  updateProjectiles(dt){
    const e=this.engine,p=e.player;
    for(let i=e.projectiles.length-1;i>=0;i--){const q=e.projectiles[i];if(!EXTRA_WEAPONS[q.weapon])continue;
      if(!e.weapons[q.weapon]){this.recycle(i);continue;}
      const oldX=q.x,oldY=q.y;q.age+=dt;q.life-=dt;
      if(q.mode==='orbit'){q.angle=q.orbitOffset+q.age*q.angularSpeed;q.x=p.x+Math.cos(q.angle)*q.range;q.y=p.y+Math.sin(q.angle)*q.range*.72-6;}
      else{if(q.mode==='arc'){q.vy+=q.gravity*dt;q.angle+=dt*8;}
        if(q.mode==='boomerang'&&!q.turned&&q.age>=q.turnAt){q.vx*=-1;q.vy*=-1;q.turned=true;}if(q.mode==='boomerang')q.angle+=dt*10;
        if(q.mode==='spiral'){const a=.2*dt,c=Math.cos(a),s=Math.sin(a),vx=q.vx;q.vx=vx*c-q.vy*s;q.vy=vx*s+q.vy*c;q.angle+=dt*7;}
        if(q.mode==='waterBottle')q.vy+=q.gravity*dt;
        q.x+=q.vx*dt;q.y+=q.vy*dt;
        if(q.mode==='ricochet'){let bounced=false;const cy=e.definition.camera?.lockY??p.y;const x0=p.x-475+q.r,x1=p.x+475-q.r,y0=cy-265+q.r,y1=cy+265-q.r;
          if(q.x<x0||q.x>x1){q.x=clamp(q.x,x0,x1);q.vx*=-1;bounced=true;}if(q.y<y0||q.y>y1){q.y=clamp(q.y,y0,y1);q.vy*=-1;bounced=true;}
          q.angle=Math.atan2(q.vy,q.vx);if(bounced&&q.explosive)this.explosion(q,q.x,q.y);
        }
      }
      this.metric(q.weapon).maxRange=Math.max(this.metric(q.weapon).maxRange,Math.hypot(q.x-p.x,q.y-p.y));
      if(q.mode==='waterBottle'||q.mode==='bomb'){
        if(q.life<=0){if(q.mode==='waterBottle')this.spawnZone(q.weapon,q.targetX,q.targetY,q.zoneStats,p.stats);else{this.area(q.weapon,q.targetX,q.targetY,q.blastRadius,q.damage);this.effect(q.weapon,q.targetX,q.targetY,.25,{r:q.blastRadius,range:q.blastRadius,explosion:true});}this.recycle(i);}continue;
      }
      if(EXTRA_WEAPONS[q.weapon]?.blockedByWalls&&e.worldSystem?.obstaclesAt(q.x,q.r).some(b=>q.x>=b.x-q.r&&q.x<=b.x+b.width+q.r&&q.y>=b.y-q.r&&q.y<=b.y+b.height+q.r)){this.recycle(i);continue;}
      this.collide(q,oldX,oldY);if(q.life<=0||q.pierce<=0||Math.abs(q.x-p.x)>1800||Math.abs(q.y-p.y)>1200)this.recycle(i);
    }
  }
  updateZones(dt){const e=this.engine,p=e.player;for(const z of e.effects){if(!EXTRA_WEAPONS[z.weapon])continue;if(z.aura){z.x=p.x;z.y=p.y;}if(!z.zone)continue;if(!e.weapons[z.weapon]){z.life=0;continue;}
      if(z.growing){z.growth+=dt;z.r=z.initialR*(1+Math.min(1,z.growth/3));z.range=z.r;const dx=p.x-z.x,dy=p.y-z.y,d=Math.hypot(dx,dy)||1,speed=Math.min(d,18*dt);z.x+=dx/d*speed;z.y+=dy/d*speed;}
      z.pulse-=dt;if(z.pulse<=0){z.pulse+=z.interval;this.area(z.weapon,z.x,z.y,z.r,z.damage);}
    }}
  updateAuras(){const e=this.engine,p=e.player;for(const[id,level]of Object.entries(e.weapons)){if(!['garlic','soul'].includes(id))continue;const w=statsFor(id,level),r=w.range*p.stats.area*(w.area||1),cooldown=Math.max(1,Math.round(w.cooldown*p.stats.cooldown*60));const times=this.auraHits.get(id)||new Map();this.auraHits.set(id,times);e.grid.query(p.x,p.y,r+28,t=>{if(t.hp<=0||sq(t.x-p.x,t.y-p.y)>(r+t.r)**2)return;const last=times.get(t.id);if(last!=null&&e.tick-last<cooldown)return;times.set(t.id,e.tick);const killed=this.hit(t,w.damage*p.stats.might,id,t.x>p.x?1:-1);if(id==='soul'&&killed&&e.rng.next()<.1)e.heal(1);});if(e.tick%60===0){const live=new Set(e.enemies.map(t=>t.id));for(const key of times.keys())if(!live.has(key))times.delete(key);}}}
  tick(dt){
    const e=this.engine;let hasExtra=false;for(const id of Object.keys(e.weapons))if(EXTRA_WEAPONS[id]){hasExtra=true;break;}
    // This fast path preserves the exact old Whip RNG sequence and update cost.
    if(!hasExtra&&!e.projectiles.length&&!this.delayed.length)return;
    if(Math.hypot(e.lastInput?.x||0,e.lastInput?.y||0)>.01){const d=Math.hypot(e.lastInput.x,e.lastInput.y);this.direction.x=e.lastInput.x/d;this.direction.y=e.lastInput.y/d;}
    else if(!this.cooldowns.size){this.direction.x=e.player.facing||1;this.direction.y=0;}
    for(const[id,level]of Object.entries(e.weapons)){if(!EXTRA_WEAPONS[id])continue;const w=statsFor(id,level);let left=this.cooldowns.get(id);if(left===undefined)left=(id==='pentagram'||id==='moon')?w.cooldown*(e.player.stats.cooldown||1):.15;left-=dt;if(left<=0){this.cast(id,w);const durationExtra=['orbit','rotatingBombardment','reverseBombardment','dualBombardment'].includes(EXTRA_WEAPONS[id].behavior)?w.duration||0:0;left=Math.max(['pentagram','moon'].includes(id)?15:.03,(w.cooldown+durationExtra)*(e.player.stats.cooldown||1));}this.cooldowns.set(id,left);}
    for(const id of this.cooldowns.keys())if(!e.weapons[id])this.cooldowns.delete(id);
    for(let i=this.delayed.length-1;i>=0;i--){const a=this.delayed[i];a.delay-=dt;if(a.delay<=0){this.delayedCast(a);remove(this.delayed,i);}}
    this.updateAuras();this.updateZones(dt);this.updateProjectiles(dt);
  }
}
