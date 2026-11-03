import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { Engine } from '../src/gameplay/engine.js';
const full=process.argv.includes('--full');
const marks=full?[30,300,600,900,1200,1500,1740]:[.5,5,30];
const directory=await mkdtemp(join(tmpdir(),'vs-golden-source-'));
await writeFile(join(directory,'package.json'),'{"type":"module"}');
const paths=execFileSync('git',['ls-tree','-r','--name-only','golden-vslice-v1','src'],{encoding:'utf8'}).trim().split('\n');
for(const path of paths){await mkdir(join(directory,path,'..'),{recursive:true});await writeFile(join(directory,path),execFileSync('git',['show',`golden-vslice-v1:${path}`]));}
const OldEngine=(await import(pathToFileURL(join(directory,'src/gameplay/engine.js')).href)).Engine;
const current=new Engine({legacy:true,seed:149,auto:true});const original=new OldEngine({seed:149,auto:true});
for(const e of [current,original])e.options.invincible=true;
const result={date:new Date().toISOString(),baselineTag:'golden-vslice-v1',scope:full?'full29minute':'short30seconds',seed:149,assisted:true,legacy:true,sourceHash:createHash('sha256').update(await readFile('src/gameplay/engine.js')).digest('hex'),marks:[],passed:true,limitations:['Strict parity against the preserved local implementation, not original-game fidelity. Invincibility is enabled for both engines.','Node timings do not establish browser FPS.']};
let cursor=0;const start=performance.now();
for(let tick=0;tick<marks.at(-1)*60+10000&&current.time<marks.at(-1);tick++){
 original.step();current.step();
 if(current.time>=marks[cursor]){
  const old=original.snapshot(),fresh=current.snapshot();
  const differences=[];
  for(const key of Object.keys(old))if(JSON.stringify(old[key])!==JSON.stringify(fresh[key]))differences.push({key,baseline:old[key],current:fresh[key]});
  for(const [key,a,b]of [['rng',original.rng.state,current.rng.state],['position',{x:original.player.x,y:original.player.y},{x:current.player.x,y:current.player.y}],['weapons',original.weapons,current.weapons],['passives',original.passives,current.passives]])if(JSON.stringify(a)!==JSON.stringify(b))differences.push({key,baseline:a,current:b});
  const passed=differences.length===0;result.marks.push({time:marks[cursor],passed,baseline:old,current:fresh,differences});console.log(`${passed?'PASS':'FAIL'} legacy Golden ${marks[cursor]}s`);cursor++;if(!passed){result.passed=false;break;}
 }
}
if(cursor!==marks.length){result.passed=false;result.error="Required Golden timestamps not all reached";}
result.wallMs=performance.now()-start;
await mkdir('reports',{recursive:true});await writeFile(`reports/phase2-golden-${full?'full':'short'}.json`,JSON.stringify(result,null,2));
if(!result.passed)process.exitCode=1;
