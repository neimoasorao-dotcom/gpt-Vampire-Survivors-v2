import {build} from 'esbuild';
import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
const root=resolve(import.meta.dirname,'..');
const rendererPath=resolve(root,'src/render/renderer.js');
const rendererSource=await readFile(rendererPath,'utf8');
let previousProfileRun=null;try{const p=JSON.parse(await readFile(resolve(root,'reports/phase2-render-profile.json'),'utf8'));previousProfileRun={date:p.date,rendererSourceSha256:p.rendererSourceSha256,results:p.results,pixelParity:p.pixelParity,interpretation:p.interpretation,trace:p.trace};}catch{}
const sha=v=>createHash('sha256').update(v).digest('hex');
const start=rendererSource.indexOf('  draw(engine, settings = {}) {'),end=rendererSource.indexOf('  projectile(q,',start);
if(start<0||end<0)throw Error('Renderer profiling anchors changed');
let section=rendererSource.slice(start,end);const anchors=[
 ['    const minX = Math.floor(-ox / CHUNK), minY = Math.floor(-oy / CHUNK);','terrain'],
 ['    // Persistent floor effects appear beneath the crowd.','floorEffects'],
 ['    for (const light of e.lights || []) {','lights'],
 ['    for (const item of e.stagePickups || []) {','stagePickups'],
 ['    for (const item of e.pickups || []) {','pickups'],
 ['    // Entities do not allocate draw lists each frame. Crowd overlap remains intentional.','enemies'],
 ["    if (e.state !== 'dead' || Math.floor(time * 10) % 2) {",'player'],
 ["    if(e.weapons)for(const [id,phase] of [['peachone',0],['ebony',Math.PI],['vandalier',0]])",'companions'],
 ['    for (const projectile of e.projectiles || []) this.projectile(projectile, ox, oy, time);','projectiles'],
 ['    for (const fx of e.effects || []) this.effect(fx, ox, oy, time, settings);','effects'],
 ['    for (const particle of e.particles || []) {','particles'],
 ['    if (settings.damageNumbers !== false) {','damageText'],
 ['    if (e.options?.grid) {','debugVignette'],
 ['    this.stats.renderMs = performance.now() - start;','end']
];
section=section.replace('    const start = performance.now(), ctx = this.ctx;','    globalThis.__renderProfileBegin?.();\n    const start = performance.now(), ctx = this.ctx;');
for(const[anchor,phase]of anchors){if(!section.includes(anchor))throw Error('Missing render phase '+phase);section=section.replace(anchor,`    globalThis.__renderProfileMark?.('${phase}');\n`+anchor);}
const instrumented=rendererSource.slice(0,start)+section+rendererSource.slice(end);
const entry=`
import {Engine} from './src/gameplay/engine.js';
import {Renderer as ControlRenderer} from './src/render/renderer.js';
import {Renderer as ProfileRenderer} from 'profile-renderer';
const canvases=[document.querySelector('#control'),document.querySelector('#profile')];
const original=new ProfileRenderer(canvases[0]),profiled=new ProfileRenderer(canvases[1]);
// Preserved pre-optimization image path; all other renderer behavior is identical.
original.image=function(id,x,y,{scale=1,flip=false,flash=false,shadow=true}={}){const ctx=this.ctx,s=(flash?this.flashes:this.sprites)[id]||this.sprites.zombie,w=s.width*scale,h=s.height*scale;x=Math.round(x);y=Math.round(y);if(shadow){ctx.fillStyle='#17231c';ctx.fillRect(Math.round(x-w*.32),y-2,Math.round(w*.64),4);}if(flip){ctx.save();ctx.translate(x,y);ctx.scale(-1,1);ctx.drawImage(s,-Math.floor(w/2),-h,w,h);ctx.restore();}else ctx.drawImage(s,x-Math.floor(w/2),y-h,w,h);this.stats.drawCalls++;};
const settings={damageNumbers:true,flashes:true,shake:false};
const heavy=['holy','thousand','spiral','vespers','hellfire','nofuture'];
const percentile=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*p)]||0;};
const summarize=a=>({mean:a.reduce((s,x)=>s+x,0)/a.length,p50:percentile(a,.5),p95:percentile(a,.95),p99:percentile(a,.99),max:Math.max(0,...a)});
let frameProfile;
window.__renderProfileBegin=()=>{frameProfile={phase:'setup',last:performance.now(),times:{}};};
window.__renderProfileMark=phase=>{const now=performance.now();frameProfile.times[frameProfile.phase]=(frameProfile.times[frameProfile.phase]||0)+now-frameProfile.last;frameProfile.last=now;frameProfile.phase=phase;};
function createScene(){const e=new Engine({seed:418,lab:true,enemyDensity:1500,enemyHp:1000000,enemySpeed:20,stats:{amount:12,cooldown:.3,duration:2,area:1.1}});e.options.invincible=true;e.options.freezeAI=false;e.lights=[];e.stagePickups=[];e.weapons={};for(const id of heavy)e.give(id,1);e.step();const cols=Math.ceil(Math.sqrt(1500*1.7)),rows=Math.ceil(1500/cols);for(let i=0;i<e.enemies.length;i++){const t=e.enemies[i];t.hp=t.maxHp=1e9;t.x=i%cols/(cols-1)*900-450;t.y=Math.floor(i/cols)/Math.max(1,rows-1)*470-235;}for(let i=0;i<400;i++)e.pickup('xp',330+i%20*5,70+Math.floor(i/20)*6,i%10===0?5:1);return e;}
function advance(e){e.burst(0,0,'#c7af77',80);e.step();e.burst(0,0,'#ae5b71',80);if(e.state!=='playing')throw Error('Scene stopped in '+e.state);}
window.profileRender=async()=>{
 const results=[];let lastEngine;
 for(const mode of ['control','instrumented']){const r=mode==='control'?original:profiled,e=createScene();canvases[0].style.visibility=mode==='control'?'visible':'hidden';canvases[1].style.visibility=mode==='control'?'hidden':'visible';
  for(let i=0;i<60;i++){await new Promise(requestAnimationFrame);advance(e);r.draw(e,settings);}
  const startLocal=performance.now();performance.mark('vs-render-profile-start-'+mode);const frames=[],updates=[],draws=[],intervals=[],phaseTotals={};let previous=null;
  for(let i=0;i<300;i++){const timestamp=await new Promise(requestAnimationFrame);if(previous!==null)intervals.push(timestamp-previous);previous=timestamp;let t=performance.now();advance(e);const u=performance.now()-t;updates.push(u);const rotationBefore=r.rotatedSprites.size;const renderStart=performance.now();r.draw(e,settings);const renderEnd=performance.now(),draw=renderEnd-renderStart;draws.push(draw);const phases={...frameProfile.times};
   if(phases)for(const[k,v]of Object.entries(phases))(phaseTotals[k]||=[]).push(v);
   frames.push({index:i,renderStart,renderEnd,updateMs:u,renderMs:draw,rafMs:intervals.at(-1)??null,phases,rotationBefore,rotationAfter:r.rotatedSprites.size,enemies:e.enemies.length,projectiles:e.projectiles.length,pickups:e.pickups.length,particles:e.particles.length,texts:e.texts.length,effects:e.effects.length,drawCalls:r.stats.drawCalls});
  }
  results.push({mode,startLocal,frames,updateMs:summarize(updates),renderMs:summarize(draws),rafMs:summarize(intervals),fps:1000/(intervals.reduce((s,x)=>s+x,0)/intervals.length),phases:Object.fromEntries(Object.entries(phaseTotals).map(([k,v])=>[k,summarize(v)])),snapshot:e.snapshot()});lastEngine=e;
 }
 // Instrumentation has no draw operations. Test this claim on exactly the same engine frame after timing.
 original.draw(lastEngine,settings);profiled.draw(lastEngine,settings);const a=original.ctx.getImageData(0,0,960,540).data,b=profiled.ctx.getImageData(0,0,960,540).data;let changedPixels=0,maxChannelDiff=0;for(let i=0;i<a.length;i+=4){let changed=false;for(let c=0;c<4;c++){const diff=Math.abs(a[i+c]-b[i+c]);if(diff)changed=true;maxChannelDiff=Math.max(maxChannelDiff,diff);}if(changed)changedPixels++;}
 return{results,pixelParity:{pixels:960*540,changedPixels,maxChannelDiff},scene:'1500 moving enemies + six actual weapon behaviors, Amount12/Cooldown0.3/Duration2/Area1.1,400XP,600pooledparticles. Invincible,1e9enemyHP; no entity reduction.'};
};window.ready=true;
`;
const bundle=await build({stdin:{contents:entry,resolveDir:root,loader:'js'},bundle:true,write:false,format:'iife',target:'chrome120',plugins:[{name:'diagnostic-render-phases',setup(b){b.onResolve({filter:/^profile-renderer$/},()=>({path:rendererPath,namespace:'diagnostic'}));b.onLoad({filter:/.*/,namespace:'diagnostic'},()=>({contents:instrumented,loader:'js',resolveDir:resolve(root,'src/render')}));}}]});
const html=`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden;background:#000}canvas{position:absolute;inset:0;width:100vw;height:100vh;object-fit:contain;image-rendering:pixelated}</style><canvas id="control"></canvas><canvas id="profile"></canvas><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script>`;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const cdp=await page.context().newCDPSession(page);const events=[];let traceError=null,truncated=false;cdp.on('Tracing.dataCollected',({value})=>{for(const e of value){if(!/GC|vs-render-profile-start|RasterTask|DrawFrame/.test(e.name||''))continue;if(events.length>=100000){truncated=true;continue;}events.push({name:e.name,cat:e.cat,ph:e.ph,ts:e.ts,dur:e.dur,pid:e.pid,tid:e.tid});}});
let data;
try{await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready);try{await cdp.send('Tracing.start',{categories:'devtools.timeline,v8,blink.user_timing,disabled-by-default-v8.gc,cc,gpu',transferMode:'ReportEvents'});}catch(e){traceError=e.message;}
 data=await page.evaluate(()=>window.profileRender());
 if(!traceError){const complete=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');await complete;}
}finally{await browser.close();await new Promise(r=>server.close(r));}
const marker=events.find(e=>e.name==='vs-render-profile-start-instrumented');const instrumentedRun=data.results.find(r=>r.mode==='instrumented');const offset=marker?marker.ts/1000-instrumentedRun.startLocal:null;
const gc=offset===null?[]:events.filter(e=>e.pid===marker.pid&&e.tid===marker.tid&&/GC/.test(e.name)&&e.dur>0).map(e=>({...e,localStart:e.ts/1000-offset,localEnd:(e.ts+e.dur)/1000-offset,durationMs:e.dur/1000}));
const longDraws=instrumentedRun.frames.filter(f=>f.renderMs>33.33).map(f=>({...f,gcOverlap:gc.filter(g=>g.localStart<f.renderEnd&&g.localEnd>f.renderStart),topPhase:Object.entries(f.phases||{}).sort((a,b)=>b[1]-a[1])[0]}));
const report={previousProfileRun,comparison:'Preserved pre-cache image transform versus current conservative mirror cache. Rest of Renderer is identical; both paths include identical diagnostic phase markers.',date:new Date().toISOString(),rendererSourceSha256:sha(rendererSource),rendererSourceChanged:sha(await readFile(rendererPath))!==sha(rendererSource),bundleSha256:sha(bundle.outputFiles[0].text),errors,trace:{error:traceError,truncated,marker,alignment:'UserTiming marker in the same renderer main thread maps monotonic trace times to performance.now; sub-millisecond marker-call uncertainty applies.',mainThreadGC:gc,rasterTaskSummary:{count:events.filter(e=>e.name==='RasterTask').length,maxDurationMs:Math.max(0,...events.filter(e=>e.name==='RasterTask').map(e=>(e.dur||0)/1000))}},...data,longDraws,limitations:['Diagnostic phase markers and tracing add overhead; these results are attribution evidence, not a performance gate.','Two real-time Chromium play sessions share the cloud instance; scheduling/raster-backend stalls remain possible.','Phase boundaries include JavaScript plus time blocked in canvas submission. A long canvas call alone does not distinguish scheduler preemption from backend synchronization.','Source application files were not edited; instrumentation exists only in the diagnostic esbuild bundle.']};
await writeFile(resolve(root,'reports/phase2-render-profile.json'),JSON.stringify(report,null,2));
const rows=Object.entries(instrumentedRun.phases).sort((a,b)=>b[1].mean-a[1].mean).map(([name,s])=>`| ${name} | ${s.mean.toFixed(3)} | ${s.p50.toFixed(3)} | ${s.p95.toFixed(3)} | ${s.max.toFixed(3)} |`).join('\n');
await writeFile(resolve(root,'reports/phase2-render-profile.md'),`# Renderer phase attribution and conservative mirror-cache comparison\n\nDate:${report.date}. Markers exist only in the diagnostic bundle; no app source changed during this profiling run:${!report.rendererSourceChanged}. Pixel parity:${data.pixelParity.changedPixels}/${data.pixelParity.pixels} changed pixels, maximumchanneldifference${data.pixelParity.maxChannelDiff}.\n\n${data.scene}\n\n| Phase | Mean ms | p50 ms | p95 ms | Max ms |\n|---|---:|---:|---:|---:|\n${rows}\n\nControl render p95:${data.results[0].renderMs.p95.toFixed(2)}ms; diagnostic render p95:${instrumentedRun.renderMs.p95.toFixed(2)}ms. Runs are sequential on a shared runner, so this is not an A/B optimization result. Longdiagnosticdraws>33.33ms:${longDraws.length}; main-threadGCtraceevents:${gc.length}; traceerror:${traceError||'none'}.\n\nRaw per-frame phase distributions, GC overlap windows and cache sizes: [phase2-render-profile.json](phase2-render-profile.json). Tracing/markers have overhead. Large canvas submission times do not by themselves identify backend vs scheduler causes. The target FPS criteria remain unchanged.\n`);
console.log(JSON.stringify({pixelParity:data.pixelParity,control:data.results[0].renderMs,instrumented:instrumentedRun.renderMs,topPhases:Object.entries(instrumentedRun.phases).sort((a,b)=>b[1].mean-a[1].mean).slice(0,5),longDraws:longDraws.length,gc:gc.length,traceError,errors}));
if(errors.length||report.rendererSourceChanged||data.pixelParity.changedPixels)process.exitCode=1;
