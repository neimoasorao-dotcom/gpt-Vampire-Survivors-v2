import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const output=process.env.REALTIME_LABEL||'phase2-realtime-final';
const html=await readFile('dist/vampire_survivors.html');const report={startedAt:new Date().toISOString(),sha256:createHash('sha256').update(html).digest('hex'),seed:271,character:'gennaro',stage:'forest',build:'aoe',speed:1,assisted:false,fixture:'Purchased Gennaro with all beneficial meta PowerUps maxed; Curse not purchased. No invincibility, XP/time/weapon grants or accelerated ticks.',samples:[],errors:[],requests:[],completed:false};
await mkdir(`reports/${output}-screenshots`,{recursive:true});
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:1920,height:1080}});page.on('pageerror',e=>report.errors.push(e.message));await page.route('**/*',route=>{const u=new URL(route.request().url());if(/^https?:$/.test(u.protocol)&&u.hostname!=='127.0.0.1'){report.requests.push(u.href);return route.abort();}return route.continue();});
const marks=[30,300,600,900,1200,1500,1740,1800];let cursor=0;const wall=performance.now();
try{await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.__VS);await page.getByTestId('main-start').click();await page.evaluate(()=>{const a=window.__VS.app;a.save.characters.gennaro=true;a.save.powerups={might:5,maxHp:3,recovery:5,armor:3,cooldown:2,area:2,speed:2,duration:2,amount:1,moveSpeed:2,magnet:2,luck:3,growth:5,greed:5,revival:1};a.selectedCharacter='gennaro';a.startRun({seed:271,auto:true,build:'aoe'});a.speed=1;});
let next=0;
while(performance.now()-wall<35*60*1000){await page.waitForTimeout(1000);const sample=await page.evaluate(()=>{const a=window.__VS.app,e=a.engine;return{...e.snapshot(),fps:a.fps,frame_ms:1000/Math.max(1,a.fps),cpu_frame_ms:a.frameMs,weaponInventory:{...e.weapons},passiveInventory:{...e.passives},invincible:e.options.invincible,gameSpeed:a.speed,visibility:document.visibilityState,heap:performance.memory?.usedJSHeapSize};});sample.wallSeconds=(performance.now()-wall)/1000;
if(sample.time>=next){report.samples.push(sample);next+=30;await writeFile(`reports/${output}-progress.json`,JSON.stringify({...report,wallSeconds:sample.wallSeconds},null,2));console.log(JSON.stringify({time:sample.time,wall:sample.wallSeconds,fps:sample.fps,level:sample.level,kills:sample.kills,hp:sample.player_hp,state:sample.state}));}
if(cursor<marks.length&&sample.time>=marks[cursor]){await page.screenshot({path:`reports/${output}-screenshots/${String(marks[cursor]).padStart(4,'0')}.png`});cursor++;}
if(sample.state==='dead'||sample.state==='won'||sample.time>=1801){report.final=sample;report.completed=sample.time>=1800;break;}
}
report.endedAt=new Date().toISOString();report.wallSeconds=(performance.now()-wall)/1000;report.fullNormalSpeedRun=report.completed&&report.wallSeconds>=1790&&report.samples.every(x=>!x.invincible&&x.gameSpeed===1);await writeFile(`reports/${output}.json`,JSON.stringify(report,null,2));console.log('REALTIME RESULT',report.completed,report.wallSeconds,report.final);
}finally{await browser.close();await new Promise(r=>server.close(r));}
if(!report.fullNormalSpeedRun||report.errors.length)process.exitCode=1;
