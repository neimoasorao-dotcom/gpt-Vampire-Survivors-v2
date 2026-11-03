/** Phase 2 content hypotheses. Numerical values are estimated, not verified current-PC specifications. */
const name = (ja,en) => ({ja,en});
const base = {maxHp:100,moveSpeed:1,might:1,armor:0,recovery:0,cooldown:1,area:1,speed:1,duration:1,amount:0,magnet:30,growth:1,luck:1,greed:1,curse:1,revival:0};
const character = (id,ja,en,weapon,stats,bonuses,cost,unlock,description,extra={}) => ({id,name:name(ja,en),startingWeapon:weapon,baseStats:{...base,...stats},levelBonuses:bonuses,cost,unlock,description:name(...description),specialBehaviors:[],sourceStatus:'estimated',...extra});
export const EXTRA_CHARACTERS = {
  imelda: character('imelda','イメルダ','Imelda','wand',{},[{every:5,stat:'growth',value:.1,cap:.3}],10,{type:'default'},['5レベルごとに獲得経験値が10%増加（最大30%）。','Gains 10% Growth every 5 levels, up to 30%.']),
  pasqualina: character('pasqualina','パスカリーナ','Pasqualina','runetracer',{speed:1.1},[{every:5,stat:'speed',value:.1,cap:.3}],100,{type:'default'},['5レベルごとに弾速が10%増加（最大30%）。','Gains 10% projectile Speed every 5 levels, up to 30%.']),
  gennaro: character('gennaro','ジェンナーロ','Gennaro','knife',{maxHp:120,amount:1},[],500,{type:'default'},['すべての武器の発射数が1増加する。','Fires one additional projectile with every weapon.']),
  arca: character('arca','アルカ','Arca','fire',{might:1.1},[{every:10,stat:'cooldown',value:-.05,cap:.15,maxTimes:3}],500,{type:'reachWeaponLevel',weapon:'fire',level:4},['10レベルごとにクールダウンが5%減少（最大15%）。','Gains 5% Cooldown reduction every 10 levels, up to 15%.']),
  porta: character('porta','ポルタ','Porta','lightning',{area:1.3},[],500,{type:'reachWeaponLevel',weapon:'lightning',level:4},['攻撃範囲が広い。低レベル時はクールダウンが大幅に短縮する。','Has increased Area and greatly reduced Cooldown at low levels.'],{specialBehaviors:['portaEarlyCooldown'],modifiers:[{stat:'cooldown',op:'add',value:-.9,minLevel:1,maxLevel:1},{stat:'cooldown',op:'add',value:-.6,minLevel:2,maxLevel:2},{stat:'cooldown',op:'add',value:-.3,minLevel:3,maxLevel:3}]}),
  lama: character('lama','ラマ','Lama','axe',{maxHp:110,moveSpeed:1.1,might:1.1,curse:1.1},['might','moveSpeed','curse'].map(stat=>({every:10,stat,value:.05,cap:.2})),500,{type:'survive',value:1200,minCurse:1.1},['10レベルごとに攻撃力・移動速度・呪いが5%増加（最大20%）。','Gains 5% Might, MoveSpeed and Curse every 10 levels, up to 20%.']),
  poe: character('poe','ポー','Poe','garlic',{maxHp:70,magnet:55},[],500,{type:'reachWeaponLevel',weapon:'garlic',level:7},['獲得範囲が広い。最大体力は低い。','Has a larger pickup radius but lower maximum health.']),
  clerici: character('clerici','クレーリチ','Clerici','water',{maxHp:150,recovery:.5},[],500,{type:'totalHealing',value:1000},['体力と回復に優れ、低レベル時の攻撃範囲が非常に広い。','Has increased health and Recovery, with huge Area at low levels.'],{specialBehaviors:['clericiEarlyArea'],modifiers:[{stat:'area',op:'add',value:4,minLevel:1,maxLevel:1},{stat:'area',op:'add',value:3,minLevel:2,maxLevel:2},{stat:'area',op:'add',value:2,minLevel:3,maxLevel:3},{stat:'area',op:'add',value:1,minLevel:4,maxLevel:4}]}),
  dommario: character('dommario','ドンマリオ','Dommario','bible',{moveSpeed:.6,speed:1.4,duration:1.4},[],500,{type:'runGold',value:5000},['弾速と持続時間が40%増加するが、移動が40%遅い。','Has 40% more projectile Speed and Duration, but moves 40% slower.']),
  krochi: character('krochi','クロチ','Krochi','cross',{moveSpeed:1.3,revival:1},[{atLevel:33,stat:'revival',value:1}],500,{type:'totalKills',value:100000},['復活を1回所持し、レベル33でもう1回獲得する。','Starts with one Revival and gains another at level 33.'],{specialBehaviors:['revival']})
};
const enemy = (id,ja,en,hp,damage,speed,xp,r,movement='chase',extra={}) => ({id,name:name(ja,en),hp,damage,speed,xp,r,scale:1,visualScale:1,hitbox:{shape:'circle',radius:r},knockback:1,knockbackResistance:0,freezeResistance:0,spawnWeight:100,movementBehavior:movement,boss:false,elite:false,dropTable:[{type:'xp',weight:1}],animation:{frames:2,fps:5},sourceStatus:'estimated',...extra});
export const EXTRA_ENEMIES = {
  mudman: enemy('mudman','マッドマン','Mudman',5,6,23,1,8,'chase',{knockback:.9,knockbackResistance:.1}),
  ectoplasm: enemy('ectoplasm','エクトプラズム','Ectoplasm',20,10,29,2,9,'drift',{freezeResistance:.15,knockback:1.1}),
  fleaman: enemy('fleaman','フリーマン','Fleaman',35,12,25,2,7,'hop',{animation:{frames:2,fps:10}}),
  medusa: enemy('medusa','メデューサヘッド','Medusa Head',80,18,37,3,10,'weave',{knockback:.5,knockbackResistance:.5,freezeResistance:.25}),
  hag: enemy('hag','魔女','Hag',120,20,18,4,11,'drift',{knockback:.6,knockbackResistance:.4}),
  giantMudman: enemy('giantMudman','巨大マッドマン','Giant Mudman',600,25,18,40,22,'chase',{boss:true,elite:true,scale:2,visualScale:2,knockback:.1,knockbackResistance:.9,freezeResistance:.6,dropTable:[{type:'xp',value:40,weight:1},{type:'chest',weight:1}]}),
  nesufritto: enemy('nesufritto','ネスフリット','Nesufritto',2500,35,26,60,27,'weave',{boss:true,elite:true,scale:2.3,visualScale:2.3,knockback:.05,knockbackResistance:.95,freezeResistance:.85,dropTable:[{type:'xp',value:60,weight:1},{type:'chest',weight:1}]})
};
const groups = [
 ['mudman'],['mudman','ghost'],['ectoplasm','mudman'],['ectoplasm','skeleton'],['fleaman','mudman'],
 ['fleaman','ectoplasm'],['skeleton','fleaman'],['medusa','ectoplasm'],['mudman','medusa'],['medusa','fleaman'],
 ['hag','skeleton'],['hag','medusa'],['fleaman','hag'],['medusa','ectoplasm'],['hag','fleaman'],
 ['medusa','hag'],['ectoplasm','medusa'],['fleaman','hag'],['medusa','hag'],['hag','fleaman'],
 ['medusa','ectoplasm'],['hag','medusa'],['fleaman','hag'],['medusa','fleaman'],['hag','medusa'],
 ['medusa','hag'],['fleaman','medusa'],['hag','ectoplasm'],['medusa','hag'],['hag','medusa']
];
const libraryWaves = groups.map((types,i)=>({start:i*60,end:(i+1)*60,enemy:types[0],enemies:types.map((enemy,j)=>({enemy,weight:j?35:65})),spawnRate:2.2+i*.7,maxAlive:140+i*43,hpScale:1+i*.1,pattern:i%5===3?'group':'edges',groupEvery:i%5===3?8:0,groupSize:18+i}));
const libraryItems = [{id:'tome',x:-1000,y:80},{id:'mask',x:1100,y:-80}];
export const EXTRA_STAGES = {
  library: {id:'library',name:name('象眼の図書館','Inlaid Library'),description:name('左右へ続く図書館。書架の間を抜け、両側からの大群を迎え撃つ。','A long horizontal library. Weave between shelves and face hordes from both sides.'),duration:1800,environment:'library',background:'library',boundary:'horizontal',bounds:{minY:-200,maxY:200},camera:{lockY:0},tilemap:{repeatX:960,tileSize:32,floorTop:-200,floorBottom:200},obstacleRepeat:960,obstacles:[{x:130,y:-200,width:72,height:64},{x:540,y:145,width:64,height:55},{x:740,y:-200,width:60,height:64}],waves:libraryWaves,spawnTable:libraryWaves,enemyPool:['mudman','ectoplasm','fleaman','medusa','hag','skeleton','ghost'],bosses:[{time:60,enemy:'giantMudman',chest:true},{time:300,enemy:'giantMudman',chest:true},{time:600,enemy:'giantMudman',chest:true},{time:900,enemy:'giantMudman',chest:true},{time:1200,enemy:'giantMudman',chest:true},{time:1500,enemy:'nesufritto',chest:true},{time:1740,enemy:'nesufritto',chest:true}],pickups:libraryItems,stageItems:libraryItems,events:[{time:180,type:'edgeGroup',enemy:'fleaman',count:40},{time:600,type:'edgeGroup',enemy:'medusa',count:55},{time:1200,type:'edgeGroup',enemy:'fleaman',count:80},{time:1680,type:'edgeGroup',enemy:'medusa',count:100}],music:'library',modifiers:{},specialRules:{reaperAt:1800,clearEnemiesAtReaper:true},secrets:[],evolution:{minTime:600},unlock:{type:'reachLevel',value:20,stage:'forest'},sourceStatus:'estimated'}
};
EXTRA_STAGES.library.bossTable=EXTRA_STAGES.library.bosses;
export const EXTRA_POWERUPS = {
  area:{max:2,cost:300,value:.05},speed:{max:2,cost:300,value:.1},duration:{max:2,cost:300,value:.15},luck:{max:3,cost:600,value:.1},greed:{max:5,cost:200,value:.1},curse:{max:5,cost:1666,value:.1},revival:{max:1,cost:10000,value:1}
};
