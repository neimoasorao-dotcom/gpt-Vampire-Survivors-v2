import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('distribution is one offline document with bundled script and restrictive network CSP',async()=>{const html=await readFile('dist/vampire_survivors.html','utf8');assert(html.startsWith('<!doctype html>'));assert.equal((html.match(/<script>/g)||[]).length,1);assert.equal((html.match(/<\/script>/g)||[]).length,1);assert.match(html,/connect-src 'none'/);assert(!/<(?:script|link|img|audio|video)[^>]+(?:src|href)\s*=\s*["']https?:/i.test(html));assert(!/<script[^>]+src=/i.test(html));assert.equal(html,await readFile('vampire_survivors.html','utf8'));assert.match(html,/Yu Gothic|Meiryo/);});
