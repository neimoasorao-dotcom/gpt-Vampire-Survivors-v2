import { performance, PerformanceObserver } from 'node:perf_hooks';
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Engine } from '../src/gameplay/engine.js';
const gcEvents = [];
const observer = new PerformanceObserver(list => { for (const e of list.getEntries()) gcEvents.push({ start: e.startTime, duration: e.duration, kind: e.detail?.kind, flags: e.detail?.flags }); });
observer.observe({ entryTypes: ['gc'] });
const engine = new Engine({ seed: 43, lab: true, enemyDensity: 1000, enemySpeed: 35, enemyHp: 1e8 });
for (let i = 0; i < 2000; i++) engine.pickup('xp', 250 + i % 40 * 3, 150 + i % 20 * 3, 1);
for (let i = 0; i < 600; i++) engine.step();
const frames = [];
for (let i = 0; i < 3600; i++) {
  const fullStart = performance.now();
  if (i % 30 === 0) engine.burst(0, 0, '#fff', 600);
  const start = performance.now(), cpuStart = process.cpuUsage(); engine.step(); const cpu = process.cpuUsage(cpuStart), end = performance.now();
  frames.push({ tick: engine.tick, start, end, ms: end - start, cpuMs: (cpu.user + cpu.system) / 1000, fullMs: end - fullStart });
}
engine.assertFinite();
await new Promise(resolve => setImmediate(resolve));
await new Promise(resolve => setImmediate(resolve));
observer.disconnect();
const samples = frames.map(f => f.ms).sort((a, b) => a - b);
const p = n => samples[Math.min(samples.length - 1, Math.floor(samples.length * n))];
const overlappingGC = frame => gcEvents.filter(g => g.start <= frame.end && g.start + g.duration >= frame.start);
const results = {
  generatedAt: new Date().toISOString(), sourceHash: createHash('sha256').update(await readFile(new URL('../src/gameplay/engine.js', import.meta.url))).digest('hex'),
  runtime: { node: process.version, platform: process.platform, isolation: 'Other project benchmark workers and browser render tests stopped by coordination. OS scheduler remains outside our control.' },
  simulationSeconds: engine.time, measuredSeconds: 60, measuredSteps: frames.length, actualEnemies: engine.enemies.length, pickups: engine.pickups.length, particles: engine.particles.length,
  updateMs: { mean: samples.reduce((s, v) => s + v, 0) / samples.length, p50: p(.5), p95: p(.95), p99: p(.99), max: samples.at(-1), over100ms: samples.filter(x => x > 100).length },
  fullFrameMax: Math.max(...frames.map(x => x.fullMs)), cpuAtWallMaximum: frames.reduce((a,b)=>a.ms>b.ms?a:b), gcCount: gcEvents.length, gcMaxMs: Math.max(0, ...gcEvents.map(x => x.duration)), gcEvents,
  slowFrames: frames.filter(f => f.ms > 16.67).map(f => ({ ...f, gc: overlappingGC(f) })),
  notes: ['Original E stress had 132.85ms maximum and three >100ms updates under shared resources.', 'This rerun diagnoses reproducibility only; it does not prove the historical long frames were fixed.', 'Simulation only; no Windows or browser FPS claim.']
};
await writeFile('reports/stress-isolated.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify({ ...results, gcEvents: undefined, slowFrames: results.slowFrames.length }));
