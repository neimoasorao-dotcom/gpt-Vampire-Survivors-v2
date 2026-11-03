# Renderer phase attribution and conservative mirror-cache comparison

Date:2026-11-03T09:19:37.704Z. Instrumented only in the diagnostic bundle; app source unchanged:true. Pixel parity:0/518400 changed pixels, maximumchanneldifference0.

1500 moving enemies + six actual weapon behaviors, Amount12/Cooldown0.3/Duration2/Area1.1,400XP,600pooledparticles. Invincible,1e9enemyHP; no entity reduction.

| Phase | Mean ms | p50 ms | p95 ms | Max ms |
|---|---:|---:|---:|---:|
| enemies | 6.768 | 5.800 | 13.000 | 35.500 |
| pickups | 1.097 | 0.600 | 3.600 | 8.300 |
| projectiles | 0.951 | 0.500 | 2.900 | 7.500 |
| damageText | 0.807 | 0.400 | 2.500 | 12.400 |
| particles | 0.581 | 0.200 | 1.700 | 10.900 |
| effects | 0.431 | 0.100 | 1.300 | 31.000 |
| terrain | 0.200 | 0.100 | 0.800 | 8.600 |
| player | 0.040 | 0.000 | 0.100 | 1.400 |
| debugVignette | 0.006 | 0.000 | 0.100 | 0.100 |
| floorEffects | 0.004 | 0.000 | 0.000 | 0.100 |
| setup | 0.004 | 0.000 | 0.000 | 0.500 |
| companions | 0.002 | 0.000 | 0.000 | 0.100 |
| stagePickups | 0.001 | 0.000 | 0.000 | 0.200 |
| lights | 0.001 | 0.000 | 0.000 | 0.100 |

Control render p95:32.30ms; diagnostic render p95:21.10ms. Runs are sequential on a shared runner, so this is not an A/B optimization result. Longdiagnosticdraws>33.33ms:5; main-threadGCtraceevents:4584; traceerror:none.

Raw per-frame phase distributions, GC overlap windows and cache sizes: [phase2-render-profile.json](phase2-render-profile.json). Tracing/markers have overhead. Large canvas submission times do not by themselves identify backend vs scheduler causes. The target FPS criteria remain unchanged.

## Accepted narrow optimization

After the two general fractional-scale cache experiments failed exact parity, the accepted cache was restricted to flipped sprites at exactly1,1.2 and2. Scale2.3 and all unsupported scales use the previous transform path unchanged. The sourceCanvas-keyed cache is bounded to128entries. The actual optimized app Renderer passed all32normal/flash/flip/shadow cases with0differentpixels, and the complete heavy-E frame also had0/518400differentpixels. See [phase2-flip-cache.json](phase2-flip-cache.json).

In the sequential diagnostic comparison, the preserved old image path took11.089ms mean in the enemy phase; the accepted cache took6.768ms. Total draw mean16.034→10.913ms, p9532.3→21.1ms. Both paths had identical phase markers, but tracing, pass order and runner variation still limit causal interpretation. The separate final stress test is the uninstrumented performance observation; it retains all1500enemies and real projectiles.
