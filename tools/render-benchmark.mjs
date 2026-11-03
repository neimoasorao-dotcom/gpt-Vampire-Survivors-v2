import { build } from 'esbuild';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'reports');
await fs.mkdir(out, { recursive: true });
const bundle = await build({
  stdin: { contents: `
import { Renderer } from './src/render/renderer.js';
import { Engine } from './src/gameplay/engine.js';
const percentile = (a,p) => { const b=[...a].sort((x,y)=>x-y); return b[Math.floor((b.length-1)*p)]; };
const summary = a => ({mean:a.reduce((x,y)=>x+y,0)/a.length,p50:percentile(a,.5),p95:percentile(a,.95),max:Math.max(...a)});
const renderer=new Renderer(document.querySelector('canvas'));
window.runStress=async config=>{
  const engine=new Engine({seed:1024,lab:true,enemyDensity:config.enemies,enemyHp:100000,enemySpeed:12});
  engine.options.invincible=true;
  // Fill first, then arrange a repeatable dense screen-wide workload.
  engine.step();
  for(let i=0;i<engine.enemies.length;i++){
    const enemy=engine.enemies[i];
    const columns=Math.ceil(Math.sqrt(config.enemies*1.7));
    enemy.x=(i%columns)/(columns-1)*900-450;
    enemy.y=Math.floor(i/columns)/Math.ceil(config.enemies/columns)*480-220;
  }
  for(let i=0;i<(config.projectiles||0);i++)engine.projectiles.push({id:i,x:(i*47)%900-450,y:(i*71)%440-220,type:['knife','axe','bible','cross','fire'][i%5],r:3,vx:30,vy:10});
  for(let i=0;i<(config.pickups||0);i++)engine.pickup('xp',(i*43)%860-430,(i*29)%420-210,i%10===0?5:1);
  for(let i=0;i<(config.particles||0);i++)engine.particles.push({x:(i*31)%900-450,y:(i*37)%480-240,vx:0,vy:0,life:999,maxLife:999,color:['#c8bba0','#8b3e42','#e3ce85'][i%3],size:2});
  for(let f=0;f<30;f++){await new Promise(requestAnimationFrame);engine.autoMenu();engine.step();renderer.draw(engine,{damageNumbers:true,flashes:true});}
  const update=[],render=[],frames=[], totals=[];
  const memoryBefore=performance.memory?.usedJSHeapSize??null;
  let previous=null;
  for(let f=0;f<150;f++){
    const timestamp=await new Promise(requestAnimationFrame);
    if(previous!==null)frames.push(timestamp-previous); previous=timestamp;
    let now=performance.now(); engine.autoMenu();engine.step(); update.push(performance.now()-now);
    now=performance.now(); renderer.draw(engine,{damageNumbers:true,flashes:true});render.push(performance.now()-now);totals.push(update.at(-1)+render.at(-1));
  }
  const mask=new Uint8Array(960*540);let enemyAreaSum=0;
  const mark=(x,y,w,h)=>{const l=Math.max(0,Math.floor(x-w/2)),r=Math.min(960,Math.ceil(x+w/2)),t=Math.max(0,Math.floor(y-h)),b=Math.min(540,Math.ceil(y));for(let yy=t;yy<b;yy++)for(let xx=l;xx<r;xx++)mask[yy*960+xx]=1;};
  for(const e of engine.enemies){const x=e.x-engine.player.x+480,y=e.y-engine.player.y+270;const w=14,h=16;enemyAreaSum+=w*h;mark(x,y,w,h);}
  const enemyCoverage=mask.reduce((a,b)=>a+b,0)/(960*540);mask.fill(0);
  for(const q of engine.projectiles)mark(q.x-engine.player.x+480,q.y-engine.player.y+270,12,12);
  const projectileCoverage=mask.reduce((a,b)=>a+b,0)/(960*540);mask.fill(0);
  for(const q of engine.pickups)mark(q.x-engine.player.x+480,q.y-engine.player.y+270,7,7);
  const pickupCoverage=mask.reduce((a,b)=>a+b,0)/(960*540);
  window.lastEngine=engine;
  return {id:config.id,requested:config,frames:150,simulationTicks:engine.tick,wallFrameMs:summary(frames),wallFps:1000/(frames.reduce((a,b)=>a+b,0)/frames.length),updateMs:summary(update),renderMs:summary(render),combinedCpuMs:summary(totals),framesOver100ms:frames.filter(v=>v>100).length,cpuFramesOver100ms:totals.filter(v=>v>100).length,entities:{enemies:engine.enemies.length,projectiles:engine.projectiles.length,pickups:engine.pickups.length,particles:engine.particles.length},drawCalls:renderer.stats.drawCalls,memory:{before:memoryBefore,after:performance.memory?.usedJSHeapSize??null},density:{method:'Union of clipped approximate sprite bounding rectangles in 960x540 logical viewport; geometric proxy, not image segmentation or reference measurement.',enemyCoverage,projectileCoverage,pickupCoverage,enemyBoundingAreaSum:enemyAreaSum},snapshot:engine.snapshot()};
};
window.ready=true;
`, resolveDir: root, loader: 'js' },
  bundle: true, write: false, format: 'iife', platform: 'browser', target: 'chrome120',
});
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'vs-render-stress-'));
const html = path.join(temp, 'stress.html');
await fs.writeFile(html, `<!doctype html><html><meta charset="UTF-8"><title>Renderer stress measurements</title><style>html,body{margin:0;background:#000;overflow:hidden}canvas{width:100vw;height:100vh;object-fit:contain;image-rendering:pixelated}</style><canvas></canvas><script>${bundle.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script></html>`);
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({viewport: { width: 1920, height: 1080 },deviceScaleFactor:1});
const errors = [];
page.on('pageerror', error => errors.push(String(error)));
await page.setContent(await fs.readFile(html, 'utf8'));
await page.waitForFunction(() => window.ready === true);
const scenarios = [
  {id:'A',enemies:500}, {id:'B',enemies:1000}, {id:'C',enemies:1500},
  {id:'D',enemies:1000,projectiles:500},
  {id:'E',enemies:1500,pickups:400,particles:600},
];
const results=[];
for(const scenario of scenarios){
  const result=await page.evaluate(config=>window.runStress(config),scenario);
  results.push(result);
  await page.screenshot({path:path.join(out,`stress-${scenario.id}-1920.png`)});
  console.log(JSON.stringify({id:result.id,fps:result.wallFps,cpuP95:result.combinedCpuMs.p95,renderP95:result.renderMs.p95,updateP95:result.updateMs.p95}));
}
const report={date:new Date().toISOString(),platform:process.platform,architecture:process.arch,browser:await browser.version(),viewport:{width:1920,height:1080},logicalViewport:{width:960,height:540},measured:'Actual headless Chromium RAF render+simulation; Linux cloud instance, not representative Windows hardware. Projectiles D and particles E are synthetic persistent renderer stress objects, not full weapon-system gameplay.',errors,results};
await fs.writeFile(path.join(out,'render-performance.json'),JSON.stringify(report,null,2)+'\n');
const rows=results.map(r=>`| ${r.id} | ${r.entities.enemies} | ${r.wallFps.toFixed(1)} | ${r.updateMs.p95.toFixed(2)} | ${r.renderMs.p95.toFixed(2)} | ${r.combinedCpuMs.p95.toFixed(2)} | ${r.combinedCpuMs.max.toFixed(2)} | ${(r.density.enemyCoverage*100).toFixed(1)}% |`).join('\n');
await fs.writeFile(path.join(out,'render-performance.md'),`# Render + simulation stress measurements\n\nDate: ${report.date}\nBrowser: ${report.browser}; cloud Linux, 1920×1080 CSS viewport; logical 960×540.\n\n150 RAF frames per scenario after 30 RAF warmup frames. CPU times are draw submission + update; RAF interval includes actual browser scheduling. No Windows hardware guarantee. Shared-instance CPU contention can affect results; do not infer scaling from a single noisy run. All scenarios use the real Engine and Renderer. D adds 500 synthetic persistent projectiles; E adds 400 XP and 600 synthetic persistent particles.\n\n| Scenario | Enemies | RAF FPS | Update p95 ms | Render p95 ms | CPU p95 ms | CPU max ms | Enemy bounding-box coverage proxy |\n|---|---:|---:|---:|---:|---:|---:|---:|\n${rows}\n\nDensity is clipped geometric union of approximate sprite bounding rectangles, not opaque sprite pixels, screenshot segmentation, or an original-game reference comparison. Reference density remains unmeasured.\n\nRaw p50/p95/max, memory observations, entity counts, snapshots, console errors, and coverage measures: [render-performance.json](render-performance.json). Screenshots: stress-A-1920.png through stress-E-1920.png. Memory before/after is a brief observation, not a leak finding.\n\nConsole errors: ${errors.length}. Target high-density minimum: 30 FPS; no thresholds were relaxed.\n`);
await browser.close();
await fs.rm(temp,{recursive:true,force:true});
if(errors.length)process.exitCode=1;
