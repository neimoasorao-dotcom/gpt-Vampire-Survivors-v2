import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const smoke = process.argv.includes('--smoke');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifact = resolve(root, 'dist/vampire_survivors.html');
const out = resolve(root, 'reports');
await mkdir(resolve(out, 'screenshots'), { recursive: true });
const html = await readFile(artifact);
const server = createServer((req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = `http://127.0.0.1:${server.address().port}/vampire_survivors.html`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const report = { mode:smoke?'smoke':'full-with-assisted-golden',date: new Date().toISOString(), artifact: 'dist/vampire_survivors.html', bytes: html.length, sha256:createHash('sha256').update(html).digest('hex'), tests: [], consoleErrors: [], externalRequests: [], screenshots: [], limitations: ['Chrome on Linux automation; physical Windows hardware and physical gamepads are not validated.', 'Reference comparison blocked by unavailable reference captures; no fidelity pass is inferred from smoke tests.'] };
let page;
async function check(name, fn) {
  const start = performance.now();
  try { const data = await fn(); report.tests.push({ name, status: 'passed', ms: Math.round(performance.now() - start), ...(data ? { data } : {}) }); console.log(`PASS ${name}`); }
  catch (err) { const status = /ERR_BLOCKED_BY_ADMINISTRATOR/.test(err.message) ? 'blocked' : 'failed'; report.tests.push({ name, status, message: err.message, stack: err.stack }); console.error(`${status.toUpperCase()} ${name}: ${err.message}`); }
}
async function screenshot(name) { const path = resolve(out, 'screenshots', name + '.png'); await page.screenshot({ path }); report.screenshots.push('reports/screenshots/' + name + '.png'); }
async function bridge(code, arg) { return page.evaluate(code, arg); }
async function start(opts = {}) { await bridge(opts => window.__VS.start(opts), opts); }
async function snapshot() { return bridge(() => window.__VS.snapshot()); }
async function newPage(url) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await context.route('**/*', route => {
    const u = new URL(route.request().url());
    if (['http:', 'https:'].includes(u.protocol) && u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') {
      report.externalRequests.push(route.request().url()); return route.abort();
    }
    return route.continue();
  });
  await context.addInitScript(() => {
    window.__qaPad = null;
    Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => window.__qaPad ? [window.__qaPad] : [] });
  });
  const p = await context.newPage();
  p.on('pageerror', e => report.consoleErrors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  await p.goto(url);
  await p.waitForFunction(() => !!window.__VS, { timeout: 15000 });
  return p;
}
try {
  for (const [protocol, url] of [['file', pathToFileURL(artifact).href], ['http', address]]) {
    await check(`${protocol}: boot offline artifact`, async () => {
      page = await newPage(url);
      assert(await page.locator('canvas').count() > 0, 'canvas exists');
      assert.match(await page.locator('body').innerText(), /スタート|START|Start/);
      await screenshot(protocol + '-main-ja');
      return { viewport: '1920x1080', initialScreen: await bridge(() => window.__VS.app.screen) };
    });
    if (!page) continue;
    await check(`${protocol}: language toggles Japanese and English`, async () => {
      await bridge(() => window.__VS.app.setSetting('language', 'en'));
      assert.match(await page.locator('body').innerText(), /START|Start|PLAY|Play/);
      await bridge(() => window.__VS.app.setSetting('language', 'ja'));
      assert.match(await page.locator('body').innerText(), /スタート/);
    });
    await check(`${protocol}: character and stage selection navigation`, async () => {
      await page.getByTestId('main-start').click();
      await page.getByTestId('character-antonio').click();
      assert.match(await page.locator('body').innerText(), /Antonio|アントニオ/);
      await screenshot(protocol + '-characters');
      await page.getByTestId('character-next').click();
      await page.getByTestId('stage-forest').click();
      assert.match(await page.locator('body').innerText(), /Forest|森林|森/);
      await screenshot(protocol + '-stages');
      await page.getByTestId('start-run').click();
      assert.equal(await bridge(() => window.__VS.app.screen), 'game');
    });
    await check(`${protocol}: keyboard moves, diagonal is normalized`, async () => {
      await start({ seed: 12345 });
      await bridge(() => window.__VS.debug('invincible', true));
      const before = await bridge(() => ({x: window.__VS.app.engine.player.x, y: window.__VS.app.engine.player.y}));
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(220);
      await page.keyboard.up('ArrowRight');
      const after = await bridge(() => ({x: window.__VS.app.engine.player.x, y: window.__VS.app.engine.player.y}));
      assert(after.x > before.x + 3, 'right arrow moves player');
      assert(Math.abs(after.y - before.y) < 1, 'movement has no unwanted y component');
      await bridge(() => window.__VS.pauseLoop = true);
      await page.keyboard.down('ArrowRight'); await page.keyboard.down('ArrowDown');
      const diagonal = await bridge(() => {
        const input=window.__VS.input.direction(), e=window.__VS.app.engine, p={x:e.player.x,y:e.player.y};
        window.__VS.runFrames(60,input);
        return {input, distance:Math.hypot(e.player.x-p.x,e.player.y-p.y),expected:90*e.player.stats.moveSpeed};
      });
      await page.keyboard.up('ArrowRight'); await page.keyboard.up('ArrowDown');
      await bridge(() => window.__VS.pauseLoop = false);
      assert(Math.abs(Math.hypot(diagonal.input.x,diagonal.input.y)-1)<1e-10);
      assert(Math.abs(diagonal.distance-diagonal.expected)<.01);
      return { before, after, diagonal };
    });
    await check(`${protocol}: pause freezes world and resumes`, async () => {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(40);
      assert.equal(await bridge(() => window.__VS.app.screen), 'pause');
      const before = await bridge(() => window.__VS.app.engine.time);
      await page.waitForTimeout(120);
      assert.equal(await bridge(() => window.__VS.app.engine.time), before);
      await screenshot(protocol + '-pause');
      await page.keyboard.press('Escape');
      assert.equal(await bridge(() => window.__VS.app.screen), 'game');
    });
    await check(`${protocol}: pause options returns to pause, main options returns main`, async () => {
      await page.keyboard.press('Escape');
      await page.locator('[data-action="nav:options"]').click();
      assert.equal(await bridge(() => window.__VS.app.screen),'options');
      await page.keyboard.press('Escape');
      assert.equal(await bridge(() => window.__VS.app.screen),'pause');
      await bridge(() => window.__VS.app.navigate('main'));
      await page.getByTestId('main-options').click();
      await page.keyboard.press('Escape');
      assert.equal(await bridge(() => window.__VS.app.screen),'main');
      await start({seed:123});
    });
    await check(`${protocol}: visibility loss pauses and clears held input`, async () => {
      await page.keyboard.down('ArrowRight');
      await bridge(() => {
        Object.defineProperty(document,'hidden',{configurable:true,value:true});
        document.dispatchEvent(new Event('visibilitychange'));delete document.hidden;
      });
      assert.equal(await bridge(() => window.__VS.app.screen),'pause');
      assert.deepEqual(await bridge(() => window.__VS.input.direction()),{x:0,y:0});
      await page.keyboard.up('ArrowRight');await bridge(() => window.__VS.app.resume());
    });
    await check(`${protocol}: gamepad stick, deadzone, D-pad, pause`, async () => {
      await start({ seed: 124 });
      await bridge(() => {
        window.__VS.debug('invincible', true);
        window.__qaPad = { connected: true, axes: [0.8, 0], buttons: Array.from({length:16}, () => ({pressed:false})) };
      });
      const before = await bridge(() => window.__VS.app.engine.player.x);
      await page.waitForTimeout(180);
      const after = await bridge(() => window.__VS.app.engine.player.x);
      assert(after > before + 2, 'left stick drives movement');
      await bridge(() => { window.__qaPad.axes = [0.05, 0.05]; });
      await page.waitForTimeout(40);
      const idle = await bridge(() => ({x:window.__VS.app.engine.player.x,y:window.__VS.app.engine.player.y}));
      await page.waitForTimeout(100);
      assert.deepEqual(await bridge(() => ({x:window.__VS.app.engine.player.x,y:window.__VS.app.engine.player.y})), idle, 'deadzone prevents drift');
      await bridge(() => { window.__qaPad.buttons[13].pressed = true; });
      await page.waitForTimeout(100);
      assert(await bridge(y => window.__VS.app.engine.player.y > y + 2, idle.y), 'D-pad down moves');
      await bridge(() => { window.__qaPad.buttons[13].pressed = false; window.__qaPad.buttons[9].pressed = true; });
      await page.waitForTimeout(80);
      assert.equal(await bridge(() => window.__VS.app.screen), 'pause');
      await bridge(() => { window.__qaPad = null; window.__VS.app.resume(); });
      return { input: 'mocked Gamepad API; physical hardware untested' };
    });
    await check(`${protocol}: WebAudio unlock and bounded voices`, async () => {
      await page.keyboard.press('ArrowLeft');
      const result = await bridge(async () => {
        const a = window.__VS.app.audio;
        await a.unlock();
        if (!a.context) throw new Error('AudioContext unavailable');
        const before = a.beat;
        a.tick();
        for (let i = 0; i < 100; i++) a.tone(220 + i, .05);
        const count = a.voices.size;
        await a.context.suspend();
        const suspended = a.context.state;
        await a.unlock();
        return { state:a.context.state, suspended, voices:count, max:a.maxVoices, scheduledBeats:a.beat-before };
      });
      assert.equal(result.state, 'running');
      assert.equal(result.suspended, 'suspended');
      assert(result.voices <= result.max && result.voices > 0);
      return result;
    });
    await check(`${protocol}: XP opens actual level choice and upgrades`, async () => {
      await bridge(() => window.__VS.debug('addXP', 5));
      const state = await bridge(() => window.__VS.app.engine.state);
      assert.equal(state, 'levelup');
      const choices = await bridge(() => window.__VS.app.engine.choices);
      assert(choices.length > 0);
      await screenshot(protocol + '-levelup');
      const id = choices[0].id;
      await bridge(id => window.__VS.app.choose(id), id);
      assert(await bridge(id => !!(window.__VS.app.engine.weapons[id] || window.__VS.app.engine.passives[id]), id));
    });
    await check(`${protocol}: reroll, skip, banish have real effects`, async () => {
      await start({seed:42});
      await bridge(() => window.__VS.debug('addXP',5));
      const before = await bridge(() => window.__VS.app.engine.rerolls);
      await bridge(() => window.__VS.debug('reroll'));
      assert.equal(await bridge(() => window.__VS.app.engine.rerolls), before-1);
      assert((await bridge(() => window.__VS.app.engine.choices)).length > 0);
      await bridge(() => window.__VS.debug('skip'));
      assert.equal(await bridge(() => window.__VS.app.engine.skips),2);
      assert.equal(await bridge(() => window.__VS.app.engine.state),'playing');
      await bridge(() => window.__VS.debug('addXP',100));
      const id = await bridge(() => window.__VS.app.engine.choices[0].id);
      await bridge(id => window.__VS.debug('banish',id),id);
      assert(await bridge(id => window.__VS.app.engine.banned.has(id),id));
      assert.equal(await bridge(() => window.__VS.app.engine.banishes),2);
    });
    await check(`${protocol}: queued chest survives level-up and multiple XP thresholds`, async () => {
      await start({seed:52});
      await bridge(() => {
        const e=window.__VS.app.engine;
        e.xp(100);e.openChest({eligible:false,born:0});
      });
      assert.equal(await bridge(() => window.__VS.app.engine.chestQueue.length),1);
      const result=await bridge(() => {
        const e=window.__VS.app.engine;let choices=0;
        while(e.state==='levelup'&&choices++<100)e.choose(e.choices[0].id);
        window.__VS.runFrames(1);
        return {level:e.player.level,state:e.state,chests:e.chests,queued:e.chestQueue.length,xp:e.player.xp,next:e.player.nextXp};
      });
      assert(result.level>2);assert.equal(result.state,'chest');assert.equal(result.chests,1);assert.equal(result.queued,0);assert(result.xp<result.next);
      await bridge(() => window.__VS.app.chestContinue());
      return result;
    });
    await check(`${protocol}: eligible chest evolves Whip and replaces slot`, async () => {
      await start({seed:99});
      await bridge(() => {
        window.__VS.debug('giveWeapon',{id:'whip',level:8});
        window.__VS.debug('givePassive','heart');
        window.__VS.debug('setTime',600);
        window.__VS.debug('spawnChest');
        window.__VS.runFrames(1);
      });
      assert.equal(await bridge(() => window.__VS.app.engine.state),'chest');
      assert.equal(await bridge(() => window.__VS.app.engine.weapons.bloody),1);
      assert.equal(await bridge(() => window.__VS.app.engine.weapons.whip),undefined);
      assert.equal(await bridge(() => window.__VS.app.engine.chestRewards[0].kind),'evolution');
      assert(await bridge(() => {const e=window.__VS.app.engine;for(let i=0;i<100;i++){e.makeChoices();if(e.choices.some(c=>c.id==='whip'))return false;}return true;}), 'consumed base weapon is excluded from post-evolution level choices');
      await page.waitForTimeout(80);
      await screenshot(protocol+'-evolution');
      await bridge(() => window.__VS.app.chestContinue());
      assert.equal(await bridge(() => window.__VS.app.engine.state),'playing');
    });
    await check(`${protocol}: death records result and meta-progression`, async () => {
      await start({seed:33});
      const runs = await bridge(() => window.__VS.app.save.runs);
      const gold = await bridge(() => window.__VS.app.save.gold);
      await bridge(() => {window.__VS.debug('addGold',55);window.__VS.debug('death');});
      await page.waitForTimeout(80);
      assert.equal(await bridge(() => window.__VS.app.engine.state),'dead');
      assert.equal(await bridge(() => window.__VS.app.screen),'results');
      assert.equal(await bridge(() => window.__VS.app.save.runs),runs+1);
      assert.equal(await bridge(() => window.__VS.app.save.gold),gold+55);
      await screenshot(protocol+'-results');
      await page.reload(); await page.waitForFunction(() => !!window.__VS);
      assert.equal(await bridge(() => window.__VS.app.save.runs),runs+1);
      assert.equal(await bridge(() => window.__VS.app.save.gold),gold+55);
    });
    await check(`${protocol}: volume/settings persist through reload`, async () => {
      await bridge(() => window.__VS.app.navigate('options'));
      await page.getByTestId('setting-master').fill('0.17');
      await page.getByTestId('setting-language').selectOption('en');
      await page.reload(); await page.waitForFunction(() => !!window.__VS);
      assert.equal(await bridge(() => window.__VS.app.save.settings.master), 0.17);
      assert.equal(await bridge(() => window.__VS.app.save.settings.language), 'en');
      await bridge(() => window.__VS.app.setSetting('language', 'ja'));
    });
    await check(`${protocol}: resize keeps canvas bounded`, async () => {
      for (const [width, height] of [[1366,768],[2560,1440],[1920,1080]]) {
        await page.setViewportSize({width,height});
        const b = await page.locator('canvas').first().boundingBox();
        assert(b.width <= width + 1 && b.height <= height + 1, `canvas fits ${width}x${height}`);
        assert(Math.abs(b.width / b.height - 16/9) < 0.02, 'canvas aspect ratio preserved');
      }
    });
    await check(`${protocol}: oversized laboratory density clamps without freezing`, async () => {
      await bridge(() => window.__VS.app.navigate('lab'));
      await page.locator('[data-lab="enemyDensity"]').fill('1000000000');
      await page.getByTestId('start-lab').click();
      const result=await bridge(() => {
        window.__VS.pauseLoop=true;
        const start=performance.now();window.__VS.runFrames(1);
        return {enemies:window.__VS.app.engine.enemies.length,density:window.__VS.app.engine.labConfig.enemyDensity,ms:performance.now()-start};
      });
      assert.equal(result.density,2500);assert.equal(result.enemies,2500);assert(result.ms<1000,'laboratory command returns without hanging');
      await bridge(() => window.__VS.pauseLoop=false);
      return result;
    });
    if (protocol === 'http' && !smoke) {
      await check('HTTP: golden assisted run screenshots 00:30 through 29:00', async () => {
        await start({seed:413,auto:true});
        await bridge(() => {window.__VS.pauseLoop=true;window.__VS.debug('invincible',true);});
        report.golden = {seed:413,assisted:true,invincible:true,referenceCompared:false,snapshots:[]};
        for (const target of [30,300,600,900,1200,1500,1740]) {
          let tries=0;
          while ((await bridge(() => window.__VS.app.engine.time)) < target && tries++ < 1000) {
            await bridge(target => window.__VS.runFrames(Math.min(600,Math.ceil((target-window.__VS.app.engine.time)*60))),target);
          }
          const state=await snapshot();
          assert(Math.abs(state.time-target)<.03, `reached ${target} seconds`);
          const visual=await bridge(() => {
            const e=window.__VS.app.engine,c=document.createElement('canvas');c.width=960;c.height=540;
            const ctx=c.getContext('2d');let visible=0;
            ctx.fillStyle='#fff';for(const a of e.enemies){const x=a.x-e.player.x+480,y=a.y-e.player.y+270;if(x+a.r<0||x-a.r>960||y+a.r<0||y-a.r>540)continue;visible++;ctx.beginPath();ctx.arc(x,y,a.r,0,Math.PI*2);ctx.fill();}
            let occupied=0;const mask=ctx.getImageData(0,0,960,540).data;for(let i=3;i<mask.length;i+=4)if(mask[i])occupied++;
            const world=document.querySelector('canvas').getContext('2d').getImageData(0,0,960,540).data;let luminance=0;for(let i=0;i<world.length;i+=4)luminance+=world[i]*.2126+world[i+1]*.7152+world[i+2]*.0722;
            return {visibleEnemies:visible,collisionDiscCoverage:occupied/(960*540),meanLuminance:luminance/(960*540),renderer:window.__VS.renderer.stats};
          });
          report.golden.snapshots.push({...state,...visual});
          const minute=String(Math.floor(target/60)).padStart(2,'0'),second=String(target%60).padStart(2,'0');
          await screenshot(`golden_${minute}${second}`);
        }
        await bridge(() => {window.__VS.pauseLoop=false;});
        return report.golden;
      });
      await check('HTTP: high-density actual RAF frame telemetry', async () => {
        const result=await bridge(async () => {
          const frame=[],updates=[],renders=[];let last=performance.now();
          await new Promise(resolve => {function sample(now){frame.push(now-last);last=now;updates.push(window.__VS.app.updateMs);renders.push(window.__VS.renderer.stats.renderMs??window.__VS.renderer.stats.ms??0);if(frame.length<120)requestAnimationFrame(sample);else resolve();}requestAnimationFrame(sample);});
          const sorted=frame.slice(2).sort((a,b)=>a-b),mean=sorted.reduce((a,b)=>a+b,0)/sorted.length;
          return {frames:sorted.length,fps:1000/mean,medianFrameMs:sorted[Math.floor(sorted.length*.5)],p95FrameMs:sorted[Math.floor(sorted.length*.95)],maxFrameMs:Math.max(...sorted),meanUpdateMs:updates.reduce((a,b)=>a+b,0)/updates.length,meanRenderMs:renders.reduce((a,b)=>a+b,0)/renders.length,enemies:window.__VS.app.engine.enemies.length,environment:'headless Linux Chromium 1920x1080, invincible autoplay'};
        });
        report.frameTelemetry=result;
        assert(result.fps>=30, `high-density FPS ${result.fps.toFixed(1)} below 30`);
        return result;
      });
    }
    await page.context().close(); page = null;
  }
  await check('no external runtime network requests', () => assert.deepEqual(report.externalRequests, []));
  await check('no browser console errors', () => assert.deepEqual(report.consoleErrors, []));
  await check('artifact remained unchanged during test',async () => assert.equal(createHash('sha256').update(await readFile(artifact)).digest('hex'),report.sha256));
} finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  report.passed = report.tests.filter(t => t.status === 'passed').length;
  report.failed = report.tests.filter(t => t.status === 'failed').length;
  report.blocked = report.tests.filter(t => t.status === 'blocked').length;
  await writeFile(resolve(out, smoke?'browser-smoke-results.json':'browser-results.json'), JSON.stringify(report, null, 2));
  console.log(`Browser: ${report.passed} passed, ${report.failed} failed, ${report.blocked} blocked`);
}
if (report.failed || report.blocked) process.exitCode = 1;
