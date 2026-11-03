import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/gameplay/engine.js';
import {ReplayRunner,validateReplay} from '../src/core/replay.js';
test('exact tick input and menu replay reproduces combat and RNG output',()=>{const e=new Engine({seed:90});for(let i=0;i<7200;i++){if(e.state==='levelup')e.choose(e.choices[0].id);if(e.state==='chest')e.closeChest();e.step(1/60,{x:i%240<120?1:-1,y:0});}const record=e.exportReplay();const replay=new Engine({seed:record.seed});const runner=new ReplayRunner(replay,record);for(let i=0;i<7200;i++)runner.step();assert.deepEqual(replay.snapshot(),e.snapshot());assert.equal(replay.rng.state,e.rng.state);assert.deepEqual(replay.weapons,e.weapons);});
test('replay rejects invalid event order and nonfinite positions',()=>{assert.throws(()=>validateReplay({version:1,seed:1,events:[{tick:0,type:'move',x:NaN,y:0}]}));assert.throws(()=>validateReplay({version:1,seed:1,events:[{tick:3,type:'pause'},{tick:2,type:'resume'}]}));});
