import {build} from 'esbuild';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
const root=resolve(import.meta.dirname,'..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function collect(directory){const result=[];for(const entry of await readdir(resolve(root,directory),{withFileTypes:true})){const p=directory+'/'+entry.name;if(entry.isDirectory())result.push(...await collect(p));else if(p.endsWith('.js'))result.push(p);}return result;}
const sourceFiles=await collect('src');
let previousMeasuredRun=null,history=[];try{const prior=JSON.parse(await readFile(resolve(root,'reports/phase2-stress.json'),'utf8'));history=[...(prior.history||[]),...(prior.previousMeasuredRun?[prior.previousMeasuredRun]:[])].slice(-4);previousMeasuredRun={date:prior.date,sourceHashes:prior.sourceHashes,results:prior.results};}catch{}
const sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async p=>[p,hash(await readFile(resolve(root,p)))])));
let artifact;try{const b=await readFile(resolve(root,'dist/vampire_survivors.html'));artifact={path:'dist/vampire_survivors.html',bytes:b.length,sha256:hash(b)};}catch{artifact=null;}
const bundle=await build({stdin:{resolveDir:root,loader:'js',contents:`
import {Engine} from './src/gameplay/engine.js';
import {Renderer} from './src/render/renderer.js';
const heavy=['holy','thousand','spiral','vespers','hellfire','nofuture'];
const renderer=new Renderer(document.querySelector('canvas'));
const percentile=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*p)]??0;};
const summary=a=>({mean:a.reduce((s,x)=>s+x,0)/a.length,p50:percentile(a,.5),p95:percentile(a,.95),p99:percentile(a,.99),max:Math.max(0,...a)});
window.runStress=async config=>{
 const e=new Engine({seed:418,lab:true,enemyDensity:config.enemies,enemyHp:1000000,enemySpeed:20,stats:config.stressStats||{}});
 e.options.invincible=true;e.options.freezeAI=false;e.lights=[];e.stagePickups=[];
 if(config.heavy){e.weapons={};for(const id of heavy)e.give(id,1);}
 e.step();
 const columns=Math.ceil(Math.sqrt(config.enemies*1.7)),rows=Math.ceil(config.enemies/columns);
 for(let i=0;i<e.enemies.length;i++){const t=e.enemies[i];t.hp=t.maxHp=1e9;t.x=(i%columns)/(columns-1)*900-450;t.y=Math.floor(i/columns)/Math.max(1,rows-1)*470-235;}
 // XP remains within the viewport outside the normal pickup radius, so real collection cannot freeze the lab in a menu.
 if(config.pickups)for(let i=0;i<400;i++)e.pickup('xp',330+i%20*5,70+Math.floor(i/20)*6,i%10===0?5:1);
 const settings={damageNumbers:true,flashes:true,shake:false};
 const advance=()=>{if(config.particles)e.burst(0,0,'#c7af77',80);e.step();if(config.particles)e.burst(0,0,'#ae5b71',80);if(e.state!=='playing')throw Error('Stress simulation unexpectedly stopped in '+e.state);};
 // Real RAF warmup settles cache/raster startup and exercises the same workload as measurement.
 for(let i=0;i<60;i++){await new Promise(requestAnimationFrame);advance();renderer.draw(e,settings);}
 const startTick=e.tick,startDamage=e.damage,startCreated=e.metrics.projectilesCreated,startHits=e.metrics.hits,startByWeapon={...e.metrics.damageByWeapon};
 const frameDetails=[];const update=[],render=[],cpu=[],frames=[],enemyCounts=[],projectileCounts=[],queries=[],collisions=[];let last=null;
 const memoryBefore=performance.memory?.usedJSHeapSize??null;
 for(let i=0;i<180;i++){
  const time=await new Promise(requestAnimationFrame);if(last!==null)frames.push(time-last);last=time;
  let t=performance.now();advance();const u=performance.now()-t;update.push(u);
  const rotationEntriesBefore=renderer.rotatedSprites.size;t=performance.now();renderer.draw(e,settings);const r=performance.now()-t;render.push(r);cpu.push(u+r);frameDetails.push({index:i,updateMs:u,renderMs:r,cpuMs:u+r,rafMs:frames.at(-1)??null,projectiles:e.projectiles.length,drawCalls:renderer.stats.drawCalls,rotationEntriesBefore,rotationEntriesAfter:renderer.rotatedSprites.size});
  enemyCounts.push(e.enemies.length);projectileCounts.push(e.projectiles.length);queries.push(e.metrics.queries);collisions.push(e.metrics.collisions);
 }
 e.assertFinite();let finite=true;
 for(const a of [e.projectiles,e.particles])for(const obj of a)for(const key of ['x','y','vx','vy','life','damage'])if(typeof obj[key]==='number'&&!Number.isFinite(obj[key]))finite=false;
 const advanced=e.tick-startTick;
 return {id:config.id,configuration:config,measureFrames:180,warmupFrames:60,advancedTicks:advanced,advancedSimulationSeconds:advanced/60,state:e.state,finite,
  frameDetails,wallFrameMs:summary(frames),wallFps:1000/(frames.reduce((s,x)=>s+x,0)/frames.length),updateMs:summary(update),renderMs:summary(render),combinedCpuMs:summary(cpu),rafIntervalsOver100ms:frames.filter(x=>x>100).length,cpuFramesOver100ms:cpu.filter(x=>x>100).length,
  entities:{enemies:e.enemies.length,minEnemies:Math.min(...enemyCounts),maxEnemies:Math.max(...enemyCounts),projectiles:e.projectiles.length,minProjectiles:Math.min(...projectileCounts),maxProjectiles:Math.max(...projectileCounts),pickups:e.pickups.length,particles:e.particles.length,effects:e.effects.length},
  measuredCombat:{damage:e.damage-startDamage,hits:e.metrics.hits-startHits,projectilesCreated:e.metrics.projectilesCreated-startCreated,byWeaponDamageDuringSample:Object.fromEntries(Object.entries(e.metrics.damageByWeapon).map(([id,value])=>[id,value-(startByWeapon[id]||0)])),byWeaponTotalsIncludingWarmup:{...e.metrics.damageByWeapon},weaponMetrics:e.weaponSystem.metrics},spatialQueries:summary(queries),broadPhaseChecks:summary(collisions),drawCalls:renderer.stats.drawCalls,
  memory:{beforeBytes:memoryBefore,afterBytes:performance.memory?.usedJSHeapSize??null,projectilePool:e.weaponSystem.free.length},snapshot:e.snapshot(),thresholds:{denseMinimumFps:30,observedMeanFpsPass:1000/(frames.reduce((s,x)=>s+x,0)/frames.length)>=30,observedP95IntervalPass:percentile(frames,.95)<=1000/30,observedNo100msStalls:cpu.every(x=>x<=100)&&frames.every(x=>x<=100)},
  assistance:'Invincible for bounded load stability only. Enemy AI remains active. No enemy was killed or removed for performance; HP was raised to 1e9 before warmup.'};
};window.ready=true;
`},bundle:true,write:false,format:'iife',platform:'browser',target:'chrome120'});
const html=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none';script-src 'unsafe-inline';style-src 'unsafe-inline';connect-src 'none'"><title>Phase2 real weapon stress</title><style>html,body{margin:0;background:#000;overflow:hidden}canvas{width:100vw;height:100vh;object-fit:contain;image-rendering:pixelated}</style><canvas></canvas><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const report={date:new Date().toISOString(),platform:process.platform,browser:await browser.version(),viewport:{width:1920,height:1080},logicalViewport:{width:960,height:540},sourceHashes,artifact,history,previousMeasuredRun,bundleSha256:hash(bundle.outputFiles[0].text),errors:[],externalRequests:[],results:[],limitations:['This is a freshly bundled Engine/Renderer harness over local HTTP, not a claim that the distribution artifact itself was benchmarked. Artifact hash is recorded for traceability.','Measurements share the cloud Linux instance with other test processes and real-time play runs. RAF includes scheduling; it is not representative Windows hardware.','D and E exercise real WeaponSystem spawn, movement, collision, hit, pooling and rendering; no synthetic projectile array is used.','Brief JS heap observations are not a leak diagnosis. No original-game fidelity or density comparison is implied.']};
page.on('pageerror',e=>report.errors.push(e.message));page.on('console',e=>{if(e.type()==='error')report.errors.push(e.text());});
await page.route('**/*',route=>{const u=new URL(route.request().url());if(/^https?:$/.test(u.protocol)&&u.hostname!=='127.0.0.1'){report.externalRequests.push(u.href);return route.abort();}return route.continue();});
const scenarios=[{id:'A',enemies:500},{id:'B',enemies:1000},{id:'C',enemies:1500},{id:'D',enemies:1000,heavy:true,stressStats:{amount:12,cooldown:.3,duration:2,area:1.1}},{id:'E',enemies:1500,heavy:true,pickups:true,particles:true,stressStats:{amount:12,cooldown:.3,duration:2,area:1.1}}];
try{await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready===true);for(const config of scenarios){const result=await page.evaluate(config=>window.runStress(config),config);report.results.push(result);console.log(JSON.stringify({id:result.id,enemies:result.entities.enemies,projectiles:result.entities.maxProjectiles,projectilesCreated:result.measuredCombat.projectilesCreated,hits:result.measuredCombat.hits,fps:result.wallFps,cpuP95:result.combinedCpuMs.p95,cpuMax:result.combinedCpuMs.max,finite:result.finite}));}}
finally{await browser.close();await new Promise(r=>server.close(r));}
report.sourceChanged=[];for(const[p,before]of Object.entries(sourceHashes)){if(hash(await readFile(resolve(root,p)))!==before)report.sourceChanged.push(p);}
await mkdir(resolve(root,'reports'),{recursive:true});await writeFile(resolve(root,'reports/phase2-stress.json'),JSON.stringify(report,null,2)+'\n');
const f=n=>n.toFixed(2);const rows=report.results.map(r=>`| ${r.id} | ${r.entities.enemies} | ${r.entities.maxProjectiles} | ${r.measuredCombat.projectilesCreated} | ${r.measuredCombat.hits} | ${f(r.wallFps)} | ${f(r.updateMs.p95)} | ${f(r.renderMs.p95)} | ${f(r.combinedCpuMs.p95)} | ${f(r.combinedCpuMs.max)} |`).join('\n');
await writeFile(resolve(root,'reports/phase2-stress.md'),`# Phase 2 actual weapon stress\n\nMeasured ${report.date}, ${report.browser}, cloud Linux. CSS1920×1080, logical960×540;60 RAF warmup+180 sampled frames per case. Other test processes/real-time runs share this instance. This is no Windows performance guarantee.\n\n| Case | Actual enemies | Peak live projectiles | Created during sample | Hits during sample | RAF FPS | Update p95 ms | Render p95 ms | CPU p95 ms | CPU max ms |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${rows}\n\nA/B/C preserve baseline Whip at500/1000/1500 moving enemies. D equips HolyWand,ThousandEdge,DeathSpiral,UnholyVespers,Hellfire,NOFUTURE against1000 enemies. E combines the same actual weapon systems with1500 enemies,400 XP gems and pooled particle generation. D/E apply explicit laboratory stress modifiers Amount+12, Cooldown×0.3, Duration×2 and Area×1.1 to produce a dense actual-projectile workload. These are stress fixtures, not ordinary-build balance claims. Both projectile movement and collision are executed; these are not retained synthetic render objects. All enemies receive1e9 HP after initialization and before warmup, avoiding deaths without reducing requested counts. Invincibility is a load-stability fixture and not survival evidence.\n\nThe minimum dense target remains30FPS. MeanFPS, p95RAFinterval≤33.33ms and absence of100msstalls are separate observations in the raw report; a passing mean does not establish stable30FPS. Sample flags under shared cloud scheduling are not release certification. CPU/RAF outliers, spatial checks, weapon damage, generated counts, finite-state checks, hashes and short heap observations are retained in [phase2-stress.json](phase2-stress.json). Console errors:${report.errors.length}; external requests:${report.externalRequests.length}; source files changed during measurement:${report.sourceChanged.length}.\n\nThis harness bundles current source independently. Recorded distribution artifact metadata:${artifact?`${artifact.bytes}bytes SHA256\`${artifact.sha256}\``:'unavailable'}. The distribution itself must still pass its separate browser smoke.\n`);
const stabilityRows=report.results.map(r=>`| ${r.id} | ${f(r.wallFrameMs.p95)} | ${r.cpuFramesOver100ms} | ${r.rafIntervalsOver100ms} | ${r.thresholds.observedMeanFpsPass?'yes':'no'} | ${r.thresholds.observedP95IntervalPass?'yes':'no'} |`).join('\n');
const eResult=report.results.find(r=>r.id==='E'),ePeak=eResult?.frameDetails.reduce((a,b)=>a.cpuMs>b.cpuMs?a:b);
await writeFile(resolve(root,'reports/phase2-stress.md'),await readFile(resolve(root,'reports/phase2-stress.md'),'utf8')+`\n## Stability observations\n\n| Case | RAF p95 ms | CPU frames >100ms | RAF intervals >100ms | Mean ≥30FPS | RAF p95 ≤33.33ms |\n|---|---:|---:|---:|---|---|\n${stabilityRows}\n\nE peak measured CPU sample: ${JSON.stringify(ePeak)}. A passing mean does not establish stable30FPS; inspect RAF quantiles and stalls. Source-cache observations and shared scheduling do not establish a root cause. Thresholds remain unchanged.\n`);
if(report.errors.length||report.externalRequests.length||report.sourceChanged.length||report.results.some(r=>!r.finite||r.advancedTicks!==180||r.entities.minEnemies!==r.configuration.enemies||r.state!=='playing'))process.exitCode=1;
