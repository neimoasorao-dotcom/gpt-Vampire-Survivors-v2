import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('dist/vampire_survivors.html');
const server=createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(html);});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const report={date:new Date().toISOString(),artifact:'dist/vampire_survivors.html',checks:[],errors:[],limitations:['Layout checks validate this implementation; reference UI measurements remain unavailable.']};
try{
 for(const [width,height]of [[1366,768],[1920,1080],[2560,1440]]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.__VS);
  for(const language of ['ja','en']){
   await page.evaluate(language=>window.__VS.app.setSetting('language',language),language);
   for(const screen of ['main','characters','stages','powerups','collection','unlocks','secrets','options','lab']){
    await page.evaluate(screen=>window.__VS.app.navigate(screen),screen);
    const overflow=await page.evaluate(()=>[...document.querySelectorAll('#ui button:not([disabled]),#ui select,#ui input')].filter(n=>n.getClientRects().length).map(n=>({name:n.textContent,rect:n.getBoundingClientRect().toJSON()})).filter(n=>n.rect.bottom>innerHeight+.5||n.rect.right>innerWidth+.5||n.rect.top<-.5||n.rect.left<-.5));
    report.checks.push({width,height,language,screen,status:overflow.length?'failed':'passed',overflow});
   }
  }
  await page.evaluate(()=>{window.__VS.start({seed:1});window.__VS.pauseLoop=true;window.__VS.app.navigate('pause');window.__VS.app.navigate('options');});
  await page.getByTestId('back').click();
  assert.equal(await page.evaluate(()=>window.__VS.app.screen),'pause','options back must return to pause');
  report.checks.push({width,height,name:'pause/options/back',status:'passed'});
  await page.evaluate(()=>window.__VS.app.navigate('options'));
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>window.__VS.app.screen),'pause','options Escape must return to pause');
  report.checks.push({width,height,name:'pause/options/Escape',status:'passed'});
  await page.close();
 }
 assert.equal(report.errors.length,0,'no browser exceptions');
 assert.equal(report.checks.filter(x=>x.status==='failed').length,0,'no interactive controls outside viewport');
}catch(error){report.errors.push(error.message);process.exitCode=1;}finally{await browser.close();server.close();await mkdir('reports',{recursive:true});await writeFile('reports/ui-layout.json',JSON.stringify(report,null,2));}
console.log(`${report.checks.filter(x=>x.status==='passed').length}/${report.checks.length} UI layout/navigation checks passed. Errors: ${report.errors.length}`);
