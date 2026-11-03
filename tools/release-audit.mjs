import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const required=['dist/vampire_survivors.html','reference_target.md','research/versions.md','spec.md','architecture.md','feature_matrix.md','gap_report.md','quality_report.md','evidence.json','estimated_values.md','benchmark_results.md','performance_report.md','test_report.md'];
const files=[];async function walk(path){for(const f of await readdir(path)){const p=path+'/'+f;if((await stat(p)).isDirectory())await walk(p);else files.push(p);}}await walk('src');
const sourceMarkers=[];for(const path of files){const text=await readFile(path,'utf8');if(/\b(?:TODO|FIXME|placeholder|mock|dummy)\b|Coming Soon|Not implemented/i.test(text))sourceMarkers.push(path);}
const missing=[];for(const path of required){try{await stat(path);}catch{missing.push(path);}}
const artifact=await readFile(required[0]);const evidence=JSON.parse(await readFile('evidence.json','utf8'));const gaps=await readFile('gap_report.md','utf8');
let browser;try{browser=JSON.parse(await readFile('reports/browser-smoke-results.json','utf8'));}catch{}
const hash=createHash('sha256').update(artifact).digest('hex');
const report={generatedAt:new Date().toISOString(),artifact:required[0],bytes:artifact.length,sha256:hash,requiredFilesMissing:missing,productionSourceMarkers:sourceMarkers,referenceVersion:evidence.referenceVersion,p1GapRows:gaps.split('\n').filter(line=>/^\|/.test(line)&&/\| P1/.test(line)).length,browserSmokeArtifactHash:browser?.sha256??browser?.artifactSha256??null,status:'blocked',release:false,reason:'Reference target/comparison and significant full-scope systems remain unresolved. Functional test success does not waive the fidelity gate.'};
await writeFile('reports/release-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
if(missing.length||sourceMarkers.length)process.exitCode=1;
