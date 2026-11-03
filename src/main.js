import {Engine} from './gameplay/engine.js';
import {Renderer} from './render/renderer.js';
import {UI} from './ui/ui.js';
import {AudioService} from './services/audio.js';
import {SaveService} from './services/save.js';
import {Input} from './services/input.js';
import {POWERUPS,CONFIG} from './data/content.js';
const storage=new SaveService();
const app={screen:'main',engine:null,save:storage.load(),audio:new AudioService(),fps:60,frameMs:16.7,updateMs:0,debugVisible:new URLSearchParams(location.search).has('debug'),selectedCharacter:'antonio',selectedStage:'forest',lastResult:null,lab:{weapon:'whip',level:8,enemyHp:100,enemyDensity:100,enemySpeed:20,gameSpeed:1},speed:1,testMode:false,
 get language(){return this.save.settings.language;},
 navigate(screen){if(screen==='options')this.optionsReturn=this.screen;this.screen=screen;this.audio.event('menu');ui.render();},
 startRun(opts={}){this.engine=new Engine({seed:opts.seed??Date.now()>>>0,character:this.selectedCharacter,stage:this.selectedStage,powerups:this.save.powerups,...opts});this.engine.onEvent=(type)=>this.audio.event(type);if(opts.lab&&opts.weapon)this.engine.give(opts.weapon,opts.level||8);this.speed=opts.gameSpeed||1;this.screen='game';this.lastResult=null;this.audio.unlock();this.audio.setMusic?.(true);ui.render();},
 resume(){if(this.engine&&['playing','levelup','chest'].includes(this.engine.state)){this.screen='game';ui.render();}},
 quitRun(){if(this.engine){this.engine.finish(false);this.commitResult(true);}this.navigate('main');this.audio.setMusic?.(false);},
 choose(id){if(this.engine?.choose(id)){this.audio.event('confirm');this.checkState();ui.render();}},
 chestContinue(){this.engine?.closeChest();this.checkState();ui.render();},
 setSetting(key,value){if(!(key in this.save.settings))return;this.save.settings[key]=value;this.save=storage.save(this.save);this.audio.update(this.save.settings);input.gamepadEnabled=this.save.settings.gamepad;document.documentElement.lang=this.language;if(!['master','music','sfx'].includes(key))ui.render();},
 buyPowerup(id){const d=POWERUPS[id],level=this.save.powerups[id]||0;if(!d||level>=d.max)return false;const cost=Math.floor(d.cost*(1+level*.5));if(this.save.gold<cost)return false;this.save.gold-=cost;this.save.powerups[id]=level+1;this.save=storage.save(this.save);this.audio.event('coin');ui.render();return true;},
 debug(action,value){if(action==='warp'){const seconds=Number(value);this.pendingWarp=Number.isFinite(seconds)?Math.max(0,Math.min(3600,seconds))*60:0;}else if(action==='speed'||action==='gameSpeed')this.speed=Math.max(.25,Math.min(20,Number(value)||1));else if(action==='performance')this.debugVisible=!this.debugVisible;else this.engine?.debug(action==='addXp'?'addXP':action,value);this.checkState();ui.render();},
 exportSave(){const text=storage.export(this.save);const blob=new Blob([text],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='survivors-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return text;},
 importSave(text){try{this.save=storage.import(text);this.audio.update(this.save.settings);ui.render();return true;}catch{alert(ui.t('saveError'));return false;}},
 commitResult(abandoned=false){const e=this.engine;if(!e||e.resultCommitted)return;e.resultCommitted=true;this.lastResult={...e.snapshot(),abandoned,weapons:{...e.weapons},passives:{...e.passives},duration:e.time};this.save.gold+=e.gold;this.save.totalKills+=e.kills;this.save.runs++;this.save.bestTime=Math.max(this.save.bestTime,e.time);this.save.unlocks.firstRun=true;if(e.player.level>=20)this.save.unlocks.level20=true;if(e.evolutionTime!==null)this.save.unlocks.bloody=true;this.save.collection=[...new Set([...this.save.collection,...Object.keys(e.weapons),...Object.keys(e.passives)])];this.save=storage.save(this.save);},
 checkState(){const e=this.engine;if(!e)return;if(['dead','won'].includes(e.state)&&this.screen==='game'){this.commitResult();this.screen='results';this.audio.setMusic?.(false);}},
};
const renderer=new Renderer(document.getElementById('world'));
app.renderer=renderer;
const ui=new UI(document.getElementById('ui'),app);
const input=new Input({gamepadEnabled:app.save.settings.gamepad,onAction(action){app.audio.unlock();if(app.screen==='game'){if(action==='cancel'||action==='pause'){app.navigate('pause');return;}if(action==='confirm'&&app.engine.state==='chest'){app.chestContinue();return;}if(app.engine.state==='levelup')ui.handleAction(action);}else if(app.screen==='pause'&&(action==='pause'||action==='cancel'))app.resume();else ui.handleAction(action);}});
app.audio.update(app.save.settings);document.documentElement.lang=app.language;
window.addEventListener('pointerdown',()=>app.audio.unlock());window.addEventListener('keydown',e=>{if(e.code==='F3'){e.preventDefault();app.debugVisible=!app.debugVisible;ui.render();}if(e.code==='F11'){e.preventDefault();if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&app.screen==='game')app.navigate('pause');});
window.addEventListener('resize',()=>renderer.resize());
window.addEventListener('beforeunload',()=>storage.save(app.save));
let last=performance.now(),accumulator=0,frames=0,fpsClock=last,lastState=null,uiClock=0;
function frame(now){const elapsed=Math.min(.25,(now-last)/1000);last=now;input.poll();let begin=performance.now();if(app.screen==='game'&&!app.testMode){if(app.pendingWarp>0){const limit=performance.now()+8;while(app.pendingWarp>0&&performance.now()<limit){app.engine.step();app.pendingWarp--;if(app.engine.state!=='playing'&&!app.engine.auto)break;}}accumulator+=elapsed*app.speed;while(accumulator>=1/60){app.engine.step(1/60,input.direction());accumulator-=1/60;if(app.engine.state!=='playing'&&!app.engine.auto){accumulator=0;break;}}app.checkState();}else accumulator=0;app.updateMs=performance.now()-begin;app.audio.tick(elapsed);renderer.draw(app.engine,app.save.settings);app.frameMs=performance.now()-begin;frames++;if(now-fpsClock>=500){app.fps=Math.round(frames*1000/(now-fpsClock));frames=0;fpsClock=now;}const state=app.screen+':'+app.engine?.state;if(state!==lastState){lastState=state;ui.render();}if(now-uiClock>100){ui.updateHUD();uiClock=now;}requestAnimationFrame(frame);}
ui.render();requestAnimationFrame(frame);
window.__VS={app,Engine,renderer,input,storage,start:opts=>app.startRun(opts),snapshot:()=>app.engine?.snapshot(),debug:(action,value)=>app.debug(action,value),get pauseLoop(){return app.testMode;},set pauseLoop(v){app.testMode=!!v;},runFrames(n,direction={x:0,y:0}){if(!Number.isFinite(n)||n<0||n>216000)throw new RangeError('Invalid frame count');for(let i=0;i<n;i++)app.engine?.step(1/60,direction);app.checkState();renderer.draw(app.engine,app.save.settings);ui.render();return app.engine?.snapshot();}};
