import { performance } from 'node:perf_hooks';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { createHash } from 'node:crypto';
import os from 'node:os';
import { Engine } from '../src/gameplay/engine.js';
import { CONFIG } from '../src/data/content.js';
const loadedEngineHash = createHash('sha256').update(Engine.toString()).digest('hex');
const DT = 1 / 60, seeds = [149, 271, 419, 587, 733];
const marks = [30, 60, 180, 300, 600, 900, 1200, 1500, 1680, 1740, 1800, 1801];
if (isMainThread) await mkdir('reports', { recursive: true });
const percentile = (values, p) => values[Math.min(values.length - 1, Math.floor(values.length * p))] || 0;
const distribution = values => {
  const sorted = [...values].sort((a, b) => a - b), mean = values.reduce((a, b) => a + b, 0) / values.length;
  return { mean, median: sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2, min: sorted[0], max: sorted.at(-1), variance: values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length };
};
function memory(engine) {
  globalThis.gc?.();
  return { heapMB: process.memoryUsage().heapUsed / 1048576, live: Object.fromEntries(['enemies', 'pickups', 'effects', 'texts', 'particles'].map(k => [k, engine[k].length])), pooled: Object.fromEntries(Object.entries(engine.pool).map(([k, v]) => [k, v.length])), replay: engine.replay.length, telemetry: engine.telemetry.length };
}
function run(seed, assisted, seconds = 1801, endless = false) {
  const engine = new Engine({ seed, auto: true, endless });
  engine.options.invincible = assisted;
  const snapshots = [], samples = [], memorySamples = [];
  let nextMark = 0, nextMemory = 300;
  const start = performance.now();
  const maxFrames = Math.ceil(seconds * 60) + 10000;
  for (let frame = 0; frame < maxFrames && engine.time < seconds && engine.state !== 'dead' && engine.state !== 'won'; frame++) {
    const then = performance.now(); engine.step(DT); samples.push(performance.now() - then);
    if (nextMark < marks.length && engine.time >= marks[nextMark]) { snapshots.push(engine.snapshot()); nextMark++; }
    if (engine.time >= nextMemory) { memorySamples.push({ time: engine.time, ...memory(engine) }); nextMemory += 300; }
  }
  engine.assertFinite();
  const elapsedMs = performance.now() - start, sorted = samples.sort((a, b) => a - b);
  const result = { seed, assisted, endless, requestedSeconds: seconds, completedRequestedTime: engine.time >= seconds, outcome: engine.state, final: engine.snapshot(), snapshots, elapsedMs, updateMs: { mean: sorted.reduce((s, v) => s + v, 0) / sorted.length, p50: percentile(sorted, .5), p95: percentile(sorted, .95), p99: percentile(sorted, .99), max: sorted.at(-1), over100ms: sorted.filter(v => v > 100).length }, finalInventory: { weapons: engine.weapons, passives: engine.passives }, memorySamples, finalMemory: memory(engine) };
  return { result, telemetry: engine.telemetry };
}
if (!isMainThread) {
  const result = run(workerData.seed, workerData.assisted, workerData.seconds, workerData.endless);
  parentPort.postMessage({...result,loadedEngineHash});
} else {
const sourceHash = createHash('sha256').update(await readFile(new URL('../src/gameplay/engine.js', import.meta.url))).digest('hex');
let previousGolden = null;
try { previousGolden = JSON.parse(await readFile('reports/golden_run.json','utf8')); } catch {}
const results = { sourceHash, concurrentWorkers: 3, generatedAt: new Date().toISOString(), runtime: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model, forcedGC: typeof globalThis.gc === 'function', hz: CONFIG.hz }, limitations: ['Node simulation timings exclude rendering, audio, browser input, display and OS compositor.', 'Linux runner is not the target Windows PC.', 'All content numbers remain estimated and reference version is unknown.', 'Invincibility-assisted runs establish engine continuity, not normal survival or fidelity.'], natural: [], assisted: [], stress: [], weapon: [] };
const jobs = [];
for (const assisted of [false, true]) for (const seed of seeds) jobs.push({seed, assisted, seconds:1801, endless:false});
jobs.unshift({seed:149,assisted:true,seconds:3601,endless:true,soak:true});
let soak;
async function workerLoop() {
 while (jobs.length) {
  const job = jobs.shift();
  const {result,telemetry,loadedEngineHash:workerEngineHash} = await new Promise((resolve,reject) => {
   const worker = new Worker(new URL(import.meta.url), {workerData:job});
   worker.once('message',resolve); worker.once('error',reject); worker.once('exit', code => {if(code!==0)reject(new Error('Simulation worker exit '+code));});
  });
  if(workerEngineHash!==loadedEngineHash)throw new Error('Engine changed during benchmark; results invalid. Restart after source freeze.');
  await writeFile(`reports/run_result_${job.soak?'soak':job.assisted?'assisted':'natural'}_${job.seed}.json`,JSON.stringify({...result,sourceHash},null,2));
  if(job.soak){soak={result,telemetry}; console.log(`SOAK time=${result.final.time}s wall=${Math.round(result.elapsedMs)}ms`);continue;}
  const {seed,assisted}=job;
  results[assisted ? 'assisted' : 'natural'].push(result);
  await writeFile(`reports/telemetry_${assisted ? 'assisted' : 'natural'}_${seed}.json`, JSON.stringify(telemetry, null, 2));
  if (assisted && seed === seeds[0]) {
    const candidate = {...result,sourceHash};
    await writeFile('reports/golden_run_current.json', JSON.stringify(candidate,null,2));
    if (previousGolden) {
      const keys = ['time','level','kills','damage','gold','chests','evolutionTime','attacks','hits','enemy_alive'];
      const differences = keys.filter(k => previousGolden.final[k] !== candidate.final[k]).map(k => ({metric:k,baseline:previousGolden.final[k],current:candidate.final[k]}));
      if(differences.length && !process.argv.includes('--accept-golden'))process.exitCode=1;
      await writeFile('reports/golden_diff.json',JSON.stringify({baselineSource:previousGolden.sourceHash,currentSource:sourceHash,identicalMetrics:differences.length===0,differences},null,2));
    }
    if (!previousGolden || process.argv.includes('--accept-golden')) await writeFile('reports/golden_run.json',JSON.stringify(candidate,null,2));
  }
  console.log(`${assisted ? 'ASSISTED' : 'NATURAL'} seed=${seed} time=${result.final.time}s level=${result.final.level} kills=${result.final.kills} state=${result.outcome} cpu=${Math.round(result.elapsedMs)}ms`);
}
}
await Promise.all(Array.from({length:3},workerLoop));
results.natural.sort((a,b)=>a.seed-b.seed);results.assisted.sort((a,b)=>a.seed-b.seed);
results.distribution = Object.fromEntries(['natural', 'assisted'].map(mode => [mode, Object.fromEntries(['time', 'level', 'kills', 'damage', 'gold', 'chests'].map(key => [key, distribution(results[mode].map(run => run.final[key]))]))]));
results.soak = soak.result;
await writeFile('reports/telemetry_soak.json', JSON.stringify(soak.telemetry, null, 2));
console.log(`SOAK time=${soak.result.final.time}s cpu=${Math.round(soak.result.elapsedMs)}ms`);
for (const [id, count, densePickups, synthetic] of [['A', 500, false, false], ['B', 1000, false, false], ['C', 1500, false, false], ['D', 1000, false, true], ['E', 1000, true, false]]) {
  const engine = new Engine({ seed: 43, lab: true, enemyDensity: count, enemySpeed: 35, enemyHp: 1e8 });
  if (synthetic) for (let i = 0; i < 1500; i++) engine.projectiles.push({ x: i % 100 * 8 - 400, y: Math.floor(i / 100) * 20 - 150, r: 2, type: 'synthetic' });
  if (densePickups) for (let i = 0; i < 2000; i++) engine.pickup('xp', 250 + i % 40 * 3, 150 + i % 20 * 3, 1);
  for (let i = 0; i < 600; i++) engine.step(DT);
  const durations = [], start = performance.now();
  for (let i = 0; i < 1200; i++) { if (densePickups && i % 30 === 0) engine.burst(0, 0, '#fff', 600); const then = performance.now(); engine.step(DT); durations.push(performance.now() - then); }
  const sorted = durations.sort((a, b) => a - b);
  const result = { id, requestedEnemies: count, actualEnemies: engine.enemies.length, projectiles: engine.projectiles.length, pickups: engine.pickups.length, particles: engine.particles.length, elapsedMs: performance.now() - start, updateMs: { mean: durations.reduce((s, x) => s + x, 0) / durations.length, p95: percentile(sorted, .95), p99: percentile(sorted, .99), max: sorted.at(-1), over100ms: sorted.filter(v => v > 100).length }, finite: true, note: synthetic ? 'Synthetic projectile array is retained but Whip has no projectile update system; projectile simulation/render performance NOT validated.' : 'Simulation only; no browser FPS claim.' };
  engine.assertFinite(); results.stress.push(result); console.log(`STRESS ${id} enemies=${result.actualEnemies} p95=${result.updateMs.p95.toFixed(3)}ms`);
}
for (const [weapon, level] of [...Array.from({length:8},(_,i)=>['whip',i+1]), ['bloody', 1]]) {
  const e = new Engine({ seed: 9, lab: true, level, enemyDensity: 0, enemySpeed: 0 });
  if (weapon === 'bloody') e.give('bloody', 1);
  for (let i = 0; i < 40; i++) e.spawn('skeleton', (i % 10) * 20 - 90, Math.floor(i / 10) * 15 - 25, { hp: 1e8, speed: 0, knockback: 0 });
  e.options.freezeAI = true;
  for (let i = 0; i < 1800; i++) e.step(DT);
  results.weapon.push({ weapon, level, seconds: e.time, damage: e.damage, dps: e.damage / e.time, attacks: e.metrics.attacks, attacksPerMinute: e.metrics.attacks * 2, hits: e.metrics.hits, projectileCount: e.metrics.projectilesCreated, maxRange: e.metrics.maxRange, targetDistribution: distribution(e.metrics.attackTargets), note: '40 stationary high-HP targets. Benchmarks implementation behavior, not measured original-game DPS.' });
}
await writeFile('reports/benchmark.json', JSON.stringify(results, null, 2));
const fmt = n => typeof n === 'number' ? n.toFixed(2) : String(n);
const rows = mode => results[mode].map(r => `| ${r.seed} | ${fmt(r.final.time)} | ${r.final.level} | ${r.final.kills} | ${r.final.chests} | ${r.final.evolutionTime ?? 'none'} | ${r.outcome} | ${fmt(r.updateMs.p95)} |`).join('\n');
await writeFile('benchmark_results.md', `# Measured simulation results\n\nGenerated ${results.generatedAt}. Raw evidence: [reports/benchmark.json](reports/benchmark.json), telemetry per seed, [golden run](reports/golden_run.json). Linux ${process.version}; three concurrent simulation workers (wall-clock timing includes CPU scheduling). Engine SHA256 ${sourceHash}. no original-game baseline was accessible. No fidelity pass is claimed. Existing accepted Golden baseline is retained; current replay metrics and differences are written to golden_run_current.json/golden_diff.json on repeated runs. Use --accept-golden only for an intentional baseline update.\n\n## Natural deterministic bot, no invincibility\n\n| Seed | Time (s) | Level | Kills | Chests | Evolution (s) | Outcome | Update p95 ms |\n|---|---:|---:|---:|---:|---|---|---:|\n${rows('natural')}\n\nNatural runs surviving requested time: ${results.natural.filter(r => r.completedRequestedTime).length}/5. Bot performance does not prove that human play can or cannot survive.\n\n## Assisted continuity runs, invincibility enabled\n\n| Seed | Time (s) | Level | Kills | Chests | Evolution (s) | Outcome | Update p95 ms |\n|---|---:|---:|---:|---:|---|---|---:|\n${rows('assisted')}\n\nAssisted runs reaching 30:01: ${results.assisted.filter(r => r.completedRequestedTime).length}/5. Assistance affects damage/survival; these are stability runs, not legitimate survival runs. Snapshots include 00:30, 01:00, 03:00, 05:00, 10:00, 15:00, 20:00, 25:00, 28:00, 29:00, 30:00, 30:01.\n\n## Distribution\n\nPopulation variance is used (five deterministic seeds, not a player population).\n\n| Mode / metric | Mean | Median | Min | Max | Variance |\n|---|---:|---:|---:|---:|---:|\n${Object.entries(results.distribution).flatMap(([mode, metrics]) => Object.entries(metrics).map(([key, v]) => `| ${mode} / ${key} | ${fmt(v.mean)} | ${fmt(v.median)} | ${fmt(v.min)} | ${fmt(v.max)} | ${fmt(v.variance)} |`)).join('\n')}\n\n## Weapon laboratory\n\n| Weapon | Level | DPS | Attacks/min | Hits | Max range |\n|---|---:|---:|---:|---:|---:|\n${results.weapon.map(w => `| ${w.weapon} | ${w.level} | ${fmt(w.dps)} | ${w.attacksPerMinute} | ${w.hits} | ${fmt(w.maxRange)} |`).join('\n')}\n\nStationary 40-target 30-second tests, knockback disabled; implementations only. Source-game TTK/DPS still unknown.\n\n## Comparison gate\n\nReference level, kills, movement, chest timing, scale and density measurements are unknown because source access was denied. Numerical fidelity differences cannot yet be calculated. Expansion gate remains blocked.\n`);
await writeFile('performance_report.md', `# Performance evidence\n\nMeasured ${results.generatedAt} on ${os.cpus()[0]?.model}, Linux ${process.arch}, Node ${process.version}. Fixed 60 Hz. Engine SHA256 ${sourceHash}. Natural/assisted/soak simulations ran with three worker threads; stress and DPS below ran serially after workers finished. Concurrent-run timings include scheduling contention.\n\n## Simulation stress\n\n| Test | Actual enemies | Pickups | Projectile array | Update mean ms | p95 ms | p99 ms | Max ms | >100ms steps |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n${results.stress.map(s => `| ${s.id} | ${s.actualEnemies} | ${s.pickups} | ${s.projectiles} | ${fmt(s.updateMs.mean)} | ${fmt(s.updateMs.p95)} | ${fmt(s.updateMs.p99)} | ${fmt(s.updateMs.max)} | ${s.updateMs.over100ms} |`).join('\n')}\n\nD contains 1500 synthetic retained projectiles; there is no projectile update behavior in the Whip slice. D does **not** pass the requested combined weapon-projectile stress gate. Browser rendering stress is reported separately if available. E continually injects pooled particles and contains capped XP. No enemy counts were reduced for performance. Engine configured maximum is ${CONFIG.enemyLimit}; explicit stress peak is 1500.\n\nSimulation timings exclude render, audio, input and compositor. These values cannot be called FPS or prove Windows 60 FPS. Target remains 60 FPS normal, at least 30 FPS dense.\n\n## 60-minute assisted endless soak\n\nReached ${soak.result.final.time}s; level ${soak.result.final.level}; ${soak.result.final.kills} kills. ${soak.result.completedRequestedTime ? 'Requested duration completed' : 'Requested duration did not complete'}. State ${soak.result.outcome}. Update p95 ${fmt(soak.result.updateMs.p95)}ms, max ${fmt(soak.result.updateMs.max)}ms; >100ms steps ${soak.result.updateMs.over100ms}. Invincibility was enabled; no normal-survival claim. Finite-state assertion completed.\n\n${soak.result.memorySamples.map(m => `- ${fmt(m.time)}s: heap ${fmt(m.heapMB)} MiB; live ${JSON.stringify(m.live)}; pools ${JSON.stringify(m.pooled)}; replay ${m.replay}; telemetry ${m.telemetry}.`).join('\n')}\n\nForced GC for snapshots: ${results.runtime.forcedGC}. Heap snapshots include the benchmark harness; live/pool counters are the primary retention evidence. Pool/replay retention counts provide leak screening, not a heap-retainer proof. No browser WebAudio or event-listener leak claim follows from this Node soak.\n`);
if(results.assisted.some(r=>!r.completedRequestedTime)||!soak.result.completedRequestedTime||results.stress.some(s=>s.actualEnemies!==s.requestedEnemies))process.exitCode=1;
console.log('Benchmark evidence and reports written.');
}
