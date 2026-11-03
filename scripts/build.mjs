import {build} from 'esbuild';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
const js=await build({entryPoints:['src/main.js'],bundle:true,write:false,format:'iife',target:'chrome100',minify:true,legalComments:'inline'});
const css=await readFile('src/ui/style.css','utf8');
const html=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; connect-src 'none'; font-src data:"><title>Vampire Survivors — Reconstruction</title><style>${css}</style></head><body><main id="stage"><canvas id="world" width="960" height="540" aria-label="ゲーム画面"></canvas><div id="ui"></div></main><script>${js.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile('dist/vampire_survivors.html',html);await writeFile('vampire_survivors.html',html);
console.log(`Built offline artifact: ${Buffer.byteLength(html)} bytes`);
