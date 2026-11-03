import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile,mkdir,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const artifact=resolve('dist/vampire_survivors.html'),html=await readFile(artifact),sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const report={date:new Date().toISOString(),artifact:'dist/vampire_survivors.html',bytes:html.length,sha256:sha(html),tests:[],screenshots:[],errors:[],externalRequests:[],limitations:['Actual Windows and physical gamepads are not validated.','Original-game version/visual comparisons are separate from local functional tests.','Accelerated arena checks do not substitute for a thirty-minute real-time play session.']};
const out=resolve('reports/phase2-screenshots');await mkdir(out,{recursive:true});
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1920,height:1080}});
await context.route('**/*',route=>{const u=new URL(route.request().url());if(/^https?:$/.test(u.protocol)&&u.hostname!=='127.0.0.1'){report.externalRequests.push(u.href);return route.abort();}return route.continue();});
let page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',e=>{if(e.type()==='error')report.errors.push(e.text());});
async function check(name,fn){const start=performance.now();try{const data=await fn();report.tests.push({name,status:'passed',ms:performance.now()-start,data});console.log('PASS '+name);}catch(e){const status=/ERR_BLOCKED_BY_ADMINISTRATOR/.test(e.message)?'blocked':'failed';report.tests.push({name,status,error:e.message});console.error(status.toUpperCase()+' '+name+': '+e.message);}}
async function shot(name){await page.screenshot({path:resolve(out,name+'.png')});report.screenshots.push('reports/phase2-screenshots/'+name+'.png');}
const ev=(fn,arg)=>page.evaluate(fn,arg);
try{
 await check('file protocol actual final artifact',async()=>{await page.goto(pathToFileURL(artifact).href);await page.waitForFunction(()=>window.__VS);});
 await page.close();page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',e=>{if(e.type()==='error')report.errors.push(e.text());});
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.__VS);
 await check('boot Japanese final artifact',async()=>{assert.match(await page.locator('body').innerText(),/スタート/);await shot('main');});
 await check('new game offers the six researched starting weapons',async()=>{await ev(()=>{window.__VS.start({seed:66});window.__VS.pauseLoop=true;const e=window.__VS.app.engine;e.makeChoices();});const ids=await ev(()=>{const e=window.__VS.app.engine,s=new Set();for(let i=0;i<100;i++){e.makeChoices();for(const c of e.choices)if(c.kind==='weapon')s.add(c.id);}return[...s];});assert(ids.length===6,`Default pool should have six source-supported weapons, got ${ids}`);return{ids};});
 await check('unlock evidence opens additional weapon pools and persists',async()=>{await ev(()=>{const a=window.__VS.app;const e=a.engine;e.pickupCounts={chicken:5,rosary:1};e.breakables=20;e.player.level=20;a.quitRun();});const u=await ev(()=>window.__VS.app.save.weaponUnlocks);assert(u.fire&&u.cross&&u.garlic);assert(!u.runetracer);await page.reload();await page.waitForFunction(()=>window.__VS);assert(await ev(()=>window.__VS.app.save.weaponUnlocks.garlic));return u;});
 await check('character purchase through UI and persistent reload',async()=>{
  await ev(()=>{const a=window.__VS.app;a.save.gold=10000;a.navigate('characters');});await shot('characters');
  await page.getByTestId('character-imelda').click();
  const buy=page.locator('[data-action="purchase-character:imelda"], [data-action="buy-character:imelda"], [data-testid="character-purchase"]');
  assert(await buy.count()>0,'Purchase control must exist');await buy.first().click();
  assert(await ev(()=>window.__VS.app.isCharacterAvailable('imelda')));await page.reload();await page.waitForFunction(()=>window.__VS);assert(await ev(()=>window.__VS.app.isCharacterAvailable('imelda')));
  return{character:'imelda'};
 });
 await check('library unlock applies and real selection starts horizontal stage',async()=>{
  await ev(()=>{const a=window.__VS.app;window.__VS.start({seed:67});window.__VS.pauseLoop=true;const e=a.engine;e.debug('level',20);a.quitRun();a.navigate('stages');});
  assert(await ev(()=>window.__VS.app.isStageAvailable('library')),'Level20forest should unlock library');await shot('stages');await page.getByTestId('stage-library').click();await page.getByTestId('start-run').click();assert.equal(await ev(()=>window.__VS.app.engine.stage),'library');
  await ev(()=>window.__VS.pauseLoop=true);await ev(()=>window.__VS.runFrames(1200,{x:0,y:1}));const y=await ev(()=>window.__VS.app.engine.player.y);assert(Math.abs(y)<=210,`Library vertical escape ${y}`);await shot('library-gameplay');return{playerY:y};
 });
 const ids=['whip','wand','knife','axe','cross','bible','fire','garlic','water','runetracer','lightning','pentagram','peachone','ebony'];
 for(const id of ids)await check(`weapon ${id} inflicts damage in final bundle`,async()=>{
  const result=await ev(({id})=>{const e=new window.__VS.Engine({lab:true,enemyDensity:0,enemySpeed:0,seed:55});e.weapons={};e.give(id,8);e.options.freezeAI=true;e.options.invincible=true;e.lights=[];e.stagePickups=[];for(let i=0;i<48;i++){const a=i*Math.PI/24,r=35+Math.floor(i/12)*42;e.spawn('skeleton',Math.cos(a)*r,Math.sin(a)*r,{hp:1e6,speed:0,knockback:0,xp:0});}for(let i=0;i<60*(id==='pentagram'?90:35);i++){e.step();e.pickups.length=0;}e.assertFinite();window.__VS.app.engine=e;window.__VS.app.screen='game';window.__VS.renderer.draw(e,window.__VS.app.save.settings);return{damage:e.damage,byWeapon:e.metrics.damageByWeapon,projectiles:e.projectiles.length,hits:e.metrics.hits};},{id});assert(result.damage>0,`${id} dealt no damage`);assert((result.byWeapon[id]||0)>0,`${id} did not record its own damage; another weapon cannot satisfy this check`);if(['bible','garlic','water','runetracer'].includes(id))await shot('weapon-'+id);return result;
 });
 await check('level up, treasure evolution, result state and save remain usable',async()=>{
  await ev(()=>{window.__VS.start({seed:68});window.__VS.pauseLoop=true;window.__VS.debug('addXP',5);});assert.equal(await ev(()=>window.__VS.app.engine.state),'levelup');await shot('levelup');
  await page.locator('[data-testid^="level-choice-"]').first().click();
  await ev(()=>{const e=window.__VS.app.engine;e.give('wand',8);e.give('tome',1);e.debug('time',601);e.openChest({eligible:true,born:601});window.__VS.app.navigate('game');});
  assert.equal(await ev(()=>window.__VS.app.engine.weapons.holy),1);assert.equal(await ev(()=>window.__VS.app.engine.weapons.wand),undefined);await shot('evolution');await page.getByTestId('chest-continue').click();
  await page.keyboard.press('Escape');await shot('pause');await page.keyboard.press('Escape');await ev(()=>window.__VS.debug('death'));assert.equal(await ev(()=>window.__VS.app.screen),'results');await shot('results');
 });
 await check('old save import uses the same unlock migration as reload',async()=>{const n=await ev(()=>{const a=window.__VS.app;a.importSave(JSON.stringify({saveVersion:1,gold:12}));return Object.values(a.save.weaponUnlocks).filter(Boolean).length;});assert.equal(n,6);});
 await check('language, audio and save settings survive bundle reload',async()=>{await ev(()=>{window.__VS.app.setSetting('language','en');window.__VS.app.setSetting('music',.12);window.__VS.app.navigate('main');});await page.reload();await page.waitForFunction(()=>window.__VS);assert.equal(await ev(()=>window.__VS.app.language),'en');assert.equal(await ev(()=>window.__VS.app.save.settings.music),.12);await ev(()=>window.__VS.app.setSetting('language','ja'));});
 await check('bundle has zero runtime external requests and errors',()=>{assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalRequests,[]);});
 await check('artifact remains unchanged during test',async()=>assert.equal(sha(await readFile(artifact)),report.sha256));
}finally{report.passed=report.tests.filter(t=>t.status==='passed').length;report.failed=report.tests.filter(t=>t.status==='failed').length;report.blocked=report.tests.filter(t=>t.status==='blocked').length;await writeFile('reports/phase2-browser.json',JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));}
if(report.failed)process.exitCode=1;
