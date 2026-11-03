/** Original, code-authored pixel artwork. No game assets or external resources. */
const W = 960, H = 540, CHUNK = 256;
const palette = {
  '.': null, o: '#161b21', b: '#272a34', s: '#573c38', t: '#996447', h: '#d6aa76',
  w: '#e5dfba', g: '#8f9a86', d: '#4a5951', r: '#6e2432', R: '#b54746',
  y: '#c8a34d', Y: '#f3df9b', p: '#704275', P: '#ac7498', l: '#789453',
  L: '#aec47c', S: '#9b8370', n: '#314730', B: '#657f99', C: '#a1c9ca', k: '#101419'
};
const art = {
  player: [
    '.....oooo.......','....osssso......','....oshhso......','....ohhhho......',
    '.....htt........','....orrrro......','...orRrrRro.....','..owrRrrRrwo....',
    '..ohorrrrohho...','..ohorrrro.hh...','...oorrrroo.....','....oyyyyo......',
    '....obbbbo......','....obbbbo......','....obobbo......','....ob.obbo.....',
    '...obb..obo.....','...obb..obo.....','...ooo..ooo.....','..oooo..oooo....'
  ],
  zombie: [
    '.....oooo.....','....ollllo....','....olLlLo....','....olkllo....','.....ollo.....',
    '....oddddo....','...oddgdddo...','..olodddollo..','..oloRddo.llo.',
    '.....ddd......','.....bdd......','....obdbo.....','....oboob.....','....oboob.....','...ooooooo....'
  ],
  skeleton: [
    '....oooo....','...owwwwo...','...wkwkww...','...owwwwo...','....owwo....',
    '..o..ww..o..','.owoowwoowo.','.wo.wwww.ow.','.w..owwo..w.','....owwo....',
    '....owwo....','...ow..wo...','...wo..ow...','..ow....wo..','..oo....oo..'
  ],
  bat: [
    'o.............o','oo...........oo','opo..ooooo..opo','oppo.opppo.oppo',
    'opppoPRRRPoppPo','.opppPPPPppppo.','..opppPPppppo..','...oopPpPoo....','.....o.o.......'
  ],
  ghost: [
    '.....oooo.....','...oowwwwoo...','..owwCCwwwwo..','.owwCwwwwwCwo.',
    '.owCkCwCkCwwo.','.owCwCwCwCwwo.','.owCCwwwwCCwo.','.owwCCwwCCwwo.',
    '..owCCCCCCwo..','..owCCCwCCwo..','.owCCwwwwCCwo.','.owoowwwwoowo.','..o..oooo..o..'
  ],
  plant: [
    '.......rr.......','.....rrRRrr.....','....rRYwwYRr....','...rRYwwwwYRr...',
    '...rYwkwwkwYr...','...rYwwYYwwYr...','....rYwYYwYr....','.....rrRRrr.....',
    '..nn...ll...nn..','.nlln..ll..nlln.','..nlln.ll.nlln..','...nlllllllln...',
    '....nnllllnn....','......nlln......','.....nnllnn.....','....nnllllnn....'
  ],
  mantis: [
    '....n........n....','...nLnn....nnLn...','....nLLnnnnLLn....','.....nLLllLLn.....',
    '....nLkLllLkLn....','....nLLllllLLn....','.....nnlYYlnn.....','.......nlln.......',
    '..nn..nnllnn..nn..','.nLLnnLLLLLLnnLLn.','nLLn.nLLllLLn.nLLn','nLn..nLLllLLn..nLn',
    'nn...nLLllLLn...nn','.....nLLllLLn.....','.....nnLLLLnn.....','......nLLlln......',
    '.....nLLnnLLn.....','....nLLn..nLLn....','...nLLn....nLLn...','...nnn......nnn...'
  ],
  werewolf: [
    '...oo......oo...','...osooooooso...','..ossgssgssso...','..ossksskssso...',
    '...osswwsso.....','....ossso.......','...osgggsso.....','..osgggggsso....',
    '.ossoSggSosso...','owwoosgsooowwo..','....osssso......','....osssso......',
    '...ossoosso.....','...ossoosso.....','..oss....sso....','..oww....wwo....'
  ],
  reaper: [
    '........oooo........','.......orrrro.......','......orRrrrro......','.....orRrrRrrro.....',
    '.....orRwwRrrro.....','.....orwkkwrrro.....','.....orwwwwrrro.....','......orwwrrro......',
    '.....orrrrrrrro.....','....orRrrrrRrrro....','...orRrrrrrrRrrro...',
    '..orRrrrrrrrrRrrro..','.oworRrrrrrrrrRowo..','.owo.orrrrrrrro.owo.',
    '.....orRrrrrRro.....','.....orRrrrrRro.....','....orRrrrrrrRro....','....orRrrrrrrRro....',
    '...orRrrrrrrrrRro...','...orRrrrrrrrrRro...','..orRrrrrrrrrrrRro..','..orrRrrRrrRrrRrro..',
    '..oooRrrRrrRrrRooo..','.....ooo..ooo.......'
  ],
  chest: [
    '..oooooooooo..','.oyyyyyyyyyyo.','oyttttttttttyo','oytttyyyttttyo','oyyyyyyyyyyyyo',
    'oytttyYyttttyo','oytttykyttttyo','oytttyyyttttyo','oyttttttttttyo','.oyyyyyyyyyyo.','..oooooooooo..'
  ],
  heart: ['.rrr.rrr.','rRRRrRRRr','rRRRRRRRr','rRRRRRRRr','.rRRRRRr.','..rRRRr..','...rRr...','....r....'],
  spinach: ['.....l.....','....lLl....','..llLLLll..','.lLLLLLLLl.','.lLLLLLLLl.','..lLLLLLl..','...lLLLl...','....lll....','.....l.....'],
  chicken: ['......oooo....','...ooohttho...','..ohhhhhhhho..','.ohhYhhhhhhho.','.ohhhhhhhhhho.','..ohhhhhhho...','...ooohoo.....','......owwo....','.......owo....'],
  coin: ['..yyy..','.yYYYy.','yYYyYYy','yYyyyYy','yYYyYYy','.yYYYy.','..yyy..'],
  bag: ['...yyy...','...oyo...','..oyyyo..','.oytytyo.','oytttttyo','oyttyttyo','.oyyyyyo.'],
  clover: ['.ll.ll.','lLLlLLl','lLLLLLl','.lLLLl.','lLLlLLl','.ll.ll.','...l...'],
  vacuum: ['...ooo...','..opPpo..','.opPPPpo.','opPPYPPpo','.opPPPpo.','..opPpo..','...ooo...'],
  rosary: ['....Y....','....Y....','..YYYYY..','....Y....','....Y....','...ooo...','..owwwo..','.owwYwwo.','..owwwo..','...ooo...'],
  clock: ['...yyy...','.yywwwyy.','ywYwywwYy','ywwwywwwy','ywwwwYwwy','.yywwwyy.','...yyy...'],
  torch: ['.....r.....','....rYr....','...rYYYr...','...rYYr....','....Yr.....','....y......','...oso.....','...oso.....','...oso.....','...oso.....','...ooo.....']
};
function hash(x, y, salt = 0) {
  let v = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ salt;
  v = Math.imul(v ^ v >>> 13, 1274126177);
  return (v ^ v >>> 16) >>> 0;
}
function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return c;
}
function sprite(rows) {
  const c = canvas(Math.max(...rows.map(row => row.length)), rows.length), ctx = c.getContext('2d');
  rows.forEach((row, y) => [...row].forEach((pixel, x) => {
    const color = palette[pixel]; if (color) { ctx.fillStyle = color; ctx.fillRect(x, y, 1, 1); }
  }));
  return c;
}
function flashSprite(source) {
  const c = canvas(source.width, source.height), ctx = c.getContext('2d');
  ctx.drawImage(source, 0, 0); ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = '#fff2c6'; ctx.fillRect(0, 0, c.width, c.height); return c;
}

export class Renderer {
  constructor(target) {
    this.canvas = target; this.ctx = target.getContext('2d', { alpha: false });
    this.sprites = Object.fromEntries(Object.entries(art).map(([key, rows]) => [key, sprite(rows)]));
    this.flashes = Object.fromEntries(Object.entries(this.sprites).map(([key, value]) => [key, flashSprite(value)]));
    this.chunks = new Map(); this.stats = { renderMs: 0, drawCalls: 0, visibleEnemies: 0, visiblePickups: 0 };
    this.frame = 0; this.resize();
  }
  resize() {
    if (this.canvas.width !== W) this.canvas.width = W;
    if (this.canvas.height !== H) this.canvas.height = H;
    this.ctx.imageSmoothingEnabled = false;
  }
  chunk(cx, cy) {
    const key = `${cx},${cy}`;
    if (this.chunks.has(key)) return this.chunks.get(key);
    const c = canvas(CHUNK, CHUNK), ctx = c.getContext('2d');
    ctx.fillStyle = '#263829'; ctx.fillRect(0, 0, CHUNK, CHUNK);
    // A restrained, tile-scaled ground pattern keeps entities legible at high density.
    for (let y = 0; y < CHUNK; y += 16) for (let x = 0; x < CHUNK; x += 16) {
      const v = hash(cx * 16 + x / 16, cy * 16 + y / 16);
      ctx.fillStyle = ['#293b2b', '#263729', '#2c3d2c', '#293a2b'][v % 4];
      ctx.fillRect(x, y, 16, 16);
      ctx.fillStyle = '#34462e'; ctx.fillRect(x + (v >>> 4) % 12, y + (v >>> 8) % 12, 2, 1);
      ctx.fillStyle = '#1f3026'; ctx.fillRect(x + (v >>> 12) % 14, y + (v >>> 16) % 14, 2, 2);
      if (v % 13 === 0) {
        ctx.fillStyle = '#4b5837'; ctx.fillRect(x + 4, y + 4, 1, 3); ctx.fillRect(x + 3, y + 5, 3, 1);
      }
    }
    // Open pale paths are visual ground detail, not invisible collision obstacles.
    for (let i = 0; i < 7; i++) {
      const v = hash(cx, cy, i * 34567), x = v % 240, y = (v >>> 9) % 240;
      if (v % 6 === 0) {
        ctx.fillStyle = '#374032'; ctx.fillRect(x, y, 18, 12); ctx.fillRect(x + 3, y - 2, 11, 16);
        ctx.fillStyle = '#424a37'; ctx.fillRect(x + 3, y + 2, 9, 2); ctx.fillRect(x + 13, y + 5, 4, 3);
      } else if (v % 6 === 1) {
        ctx.fillStyle = '#1e2b22'; ctx.fillRect(x + 1, y + 11, 15, 4);
        ctx.fillStyle = '#53584a'; ctx.fillRect(x + 4, y + 1, 8, 13); ctx.fillRect(x + 2, y + 4, 12, 5);
        ctx.fillStyle = '#767869'; ctx.fillRect(x + 5, y + 2, 2, 10); ctx.fillRect(x + 3, y + 5, 9, 1);
        ctx.fillStyle = '#363f34'; ctx.fillRect(x + 9, y + 8, 2, 5);
      } else if (v % 6 === 2) {
        ctx.fillStyle = '#1c2d22'; ctx.fillRect(x, y + 9, 14, 5);
        ctx.fillStyle = '#46503a'; ctx.fillRect(x + 4, y, 7, 10);
        ctx.fillStyle = '#5a6245'; ctx.fillRect(x + 5, y + 1, 5, 4);
        ctx.fillStyle = '#333e2e'; ctx.fillRect(x + 3, y + 8, 10, 4);
      } else if (v % 6 === 3) {
        ctx.fillStyle = '#809064'; ctx.fillRect(x + 3, y + 4, 1, 3); ctx.fillRect(x + 7, y + 2, 1, 4);
        ctx.fillStyle = '#b29d6d'; ctx.fillRect(x + 2, y + 3, 3, 2); ctx.fillRect(x + 6, y + 1, 3, 2);
      } else if (v % 6 === 4) {
        ctx.fillStyle = '#465344'; ctx.fillRect(x, y, 4, 2); ctx.fillRect(x + 2, y + 2, 3, 2);
      }
    }
    // Sparse dark roots, built into the terrain cache rather than rendered as entities.
    if (hash(cx, cy, 99) % 4 === 0) {
      const x = 48 + hash(cx, cy, 100) % 130, y = 50 + hash(cx, cy, 101) % 130;
      ctx.fillStyle = '#17281e'; ctx.fillRect(x - 10, y + 22, 35, 8);
      ctx.fillStyle = '#2c2b24'; ctx.fillRect(x + 4, y, 9, 29); ctx.fillRect(x - 3, y + 10, 7, 5);
      ctx.fillRect(x - 9, y + 4, 6, 8); ctx.fillRect(x + 12, y + 6, 12, 5);
      ctx.fillStyle = '#45432d'; ctx.fillRect(x + 6, y + 2, 2, 22); ctx.fillRect(x - 8, y + 4, 3, 3);
      ctx.fillStyle = '#31402b'; ctx.fillRect(x + 1, y - 6, 15, 8); ctx.fillRect(x - 8, y - 1, 12, 7);
      ctx.fillRect(x + 15, y - 3, 16, 9);
    }
    this.chunks.set(key, c);
    if (this.chunks.size > 64) this.chunks.delete(this.chunks.keys().next().value);
    return c;
  }
  visible(x, y, radius = 35) { return x > -radius && x < W + radius && y > -radius && y < H + radius; }
  image(id, x, y, { scale = 1, flip = false, flash = false, shadow = true } = {}) {
    const ctx = this.ctx, s = (flash ? this.flashes : this.sprites)[id] || this.sprites.zombie;
    const w = s.width * scale, h = s.height * scale;
    x = Math.round(x); y = Math.round(y);
    if (shadow) { ctx.fillStyle = '#17231c'; ctx.fillRect(Math.round(x - w * .32), y - 2, Math.round(w * .64), 4); }
    if (flip) {
      ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.drawImage(s, -Math.floor(w / 2), -h, w, h); ctx.restore();
    } else ctx.drawImage(s, x - Math.floor(w / 2), y - h, w, h);
    this.stats.drawCalls++;
  }
  gem(x, y, value = 1, time = 0) {
    const ctx = this.ctx, large = value >= 5, r = large ? 4 : 3;
    const colors = value >= 20 ? ['#691d28', '#b84342', '#f5a785'] : value >= 5 ? ['#1c563e', '#35a16f', '#8cdec4'] : ['#193666', '#3374bc', '#9ed9ef'];
    x = Math.round(x); y = Math.round(y);
    ctx.fillStyle = colors[0]; ctx.fillRect(x - r, y - 1, r * 2 + 1, 3); ctx.fillRect(x - 1, y - r, 3, r * 2 + 1);
    ctx.fillStyle = colors[1]; ctx.fillRect(x - r + 1, y - 1, r * 2 - 1, 3); ctx.fillRect(x - 1, y - r + 1, 3, r * 2 - 1);
    ctx.fillStyle = colors[2]; ctx.fillRect(x - 1, y - r + 1, 1, 3);
    if (Math.floor(time * 3 + x) % 8 === 0) { ctx.fillStyle = '#daeeee'; ctx.fillRect(x + r + 1, y - r, 1, 3); ctx.fillRect(x + r, y - r + 1, 3, 1); }
    this.stats.drawCalls++;
  }
  draw(engine, settings = {}) {
    const start = performance.now(), ctx = this.ctx;
    const e = engine || { time: this.frame / 60, player: { x: 0, y: 0, facing: 1 }, enemies: [], pickups: [], projectiles: [], effects: [], texts: [] };
    const p = e.player, time = e.time || 0;
    this.stats.drawCalls = 0; this.stats.visibleEnemies = 0; this.stats.visiblePickups = 0;
    let shakeX = 0, shakeY = 0;
    if (settings.shake !== false && (e.hitCooldown || p.invulnerability || 0) > .35) {
      shakeX = Math.sin(time * 96) * 2; shakeY = Math.cos(time * 108) * 2;
    }
    const ox = Math.round(W / 2 - p.x + shakeX), oy = Math.round(H / 2 - p.y + shakeY);
    const minX = Math.floor(-ox / CHUNK), minY = Math.floor(-oy / CHUNK);
    for (let cy = minY; cy <= minY + 3; cy++) for (let cx = minX; cx <= minX + 4; cx++) {
      ctx.drawImage(this.chunk(cx, cy), cx * CHUNK + ox, cy * CHUNK + oy); this.stats.drawCalls++;
    }
    // Persistent floor effects appear beneath the crowd.
    for (const fx of e.effects || []) if (['zone', 'garlic', 'water', 'aura'].includes(fx.type)) {
      const x = fx.x + ox, y = fx.y + oy, r = fx.range || fx.r || 40;
      if (!this.visible(x, y, r)) continue;
      ctx.globalAlpha = .18 * Math.min(1, (fx.life || 1) * 3);
      ctx.fillStyle = fx.type === 'water' ? '#8fc9d9' : '#c2bd8b';
      ctx.beginPath(); ctx.ellipse(x, y, r, r * .6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = .35; ctx.strokeStyle = '#e5dec4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(x, y, r - 3, r * .6 - 2, 0, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
    }
    for (const light of e.lights || []) {
      if (!light.alive) continue;
      const x = light.x + ox, y = light.y + oy;
      if (!this.visible(x, y, 20)) continue;
      this.image('torch', x, y, { shadow: true });
      if (settings.flashes !== false) {
        ctx.fillStyle = Math.floor(time * 7 + light.x) % 2 ? '#e9c46a' : '#f2da91';
        ctx.fillRect(Math.round(x - 1), Math.round(y - 20), 2, 4);
      }
    }
    for (const item of e.stagePickups || []) {
      if (item.collected) continue;
      const x = item.x + ox, y = item.y + oy;
      if (!this.visible(x, y, 20)) continue;
      ctx.fillStyle = '#171e1c'; ctx.fillRect(Math.round(x - 8), Math.round(y - 8), 16, 12);
      this.image(item.id === 'spinach' ? 'spinach' : 'heart', x, y, { shadow: false });
    }
    for (const item of e.pickups || []) {
      const x = item.x + ox, y = item.y + oy;
      if (!this.visible(x, y, 15)) continue;
      this.stats.visiblePickups++;
      if (['xp', 'gem', 'blue', 'green', 'red'].includes(item.type)) {
        this.gem(x, y, item.type === 'green' ? 5 : item.type === 'red' ? 20 : item.value, time);
      } else {
        let id = { floorChicken: 'chicken', floor_chicken: 'chicken', coinBag: 'bag', richBag: 'bag', orologion: 'clock', littleClover: 'clover', nft: 'torch' }[item.type] || item.type;
        if (item.type === 'chest') {
          ctx.fillStyle = '#c7ac5a';
          for (let i = 0; i < 3; i++) { const dx = Math.round(Math.sin(time * 2 + i * 2.1) * 12), dy = Math.round(Math.cos(time * 2.3 + i) * 8); ctx.fillRect(Math.round(x + dx), Math.round(y - 10 + dy), 1, 3); }
        }
        this.image(id, x, y, { shadow: true });
      }
    }
    // Entities do not allocate draw lists each frame. Crowd overlap remains intentional.
    for (const enemy of e.enemies || []) {
      if (enemy.hp <= 0) continue;
      const x = enemy.x + ox, y = enemy.y + oy;
      if (!this.visible(x, y, 60)) continue;
      this.stats.visibleEnemies++;
      const scale = enemy.visualScale || (enemy.type === 'mantis' ? 2 : enemy.type === 'reaper' ? 1.5 : 1);
      this.image(enemy.type, x, y + ((Math.floor(time * (enemy.type === 'bat' ? 12 : 5) + enemy.id) % 2) ? 1 : 0), { scale, flip: enemy.x > p.x, flash: settings.flashes !== false && enemy.flash > 0 });
      if (enemy.boss && enemy.hp < enemy.maxHp) {
        ctx.fillStyle = '#1b171c'; ctx.fillRect(Math.round(x - 17), Math.round(y + 5), 34, 4);
        ctx.fillStyle = '#a83a43'; ctx.fillRect(Math.round(x - 16), Math.round(y + 6), Math.max(0, 32 * enemy.hp / enemy.maxHp), 2);
      }
      if (e.options?.hitboxes) { ctx.strokeStyle = '#e3a062'; ctx.beginPath(); ctx.arc(x, y - 8, enemy.r || 7, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (e.state !== 'dead' || Math.floor(time * 10) % 2) {
      const flicker = (e.hitCooldown || p.invulnerability || 0) > 0 && Math.floor(time * 20) % 2;
      if (!flicker) this.image('player', p.x + ox, p.y + oy, { scale: 1.2, flip: p.facing < 0 });
    }
    // Health bar belongs to the world, while XP/time/inventory are in DOM HUD.
    if (p.maxHp) {
      ctx.fillStyle = '#171719'; ctx.fillRect(W / 2 - 16, H / 2 + 7, 32, 5);
      ctx.fillStyle = '#5b222a'; ctx.fillRect(W / 2 - 15, H / 2 + 8, 30, 3);
      ctx.fillStyle = '#c34343'; ctx.fillRect(W / 2 - 15, H / 2 + 8, Math.max(0, 30 * p.hp / p.maxHp), 3);
    }
    for (const projectile of e.projectiles || []) this.projectile(projectile, ox, oy, time);
    for (const fx of e.effects || []) this.effect(fx, ox, oy, time, settings);
    for (const particle of e.particles || []) {
      const x = Math.round(particle.x + ox), y = Math.round(particle.y + oy);
      if (!this.visible(x, y, 4)) continue;
      ctx.globalAlpha = Math.min(1, particle.life * 4); ctx.fillStyle = particle.color || '#c6bfa1';
      ctx.fillRect(x, y, particle.size || 2, particle.size || 2); this.stats.drawCalls++;
    }
    ctx.globalAlpha = 1;
    if (settings.damageNumbers !== false) {
      ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'miter'; ctx.lineWidth = 3;
      for (const text of e.texts || []) {
        const x = Math.round(text.x + ox), y = Math.round(text.y + oy);
        if (!this.visible(x, y, 20)) continue;
        ctx.globalAlpha = Math.min(1, text.life * 4); ctx.strokeStyle = '#171719';
        const value = String(text.value ?? text.text ?? '');
        ctx.strokeText(value, x, y); ctx.fillStyle = text.crit ? '#f4ca64' : text.color || '#e4d9bb'; ctx.fillText(value, x, y); this.stats.drawCalls += 2;
      }
      ctx.globalAlpha = 1;
    }
    if (e.options?.grid) {
      ctx.strokeStyle = '#8bc2a044'; ctx.lineWidth = 1;
      for (let x = ox % 64; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = oy % 64; y < H; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }
    // Pixel vignette, a small luminosity falloff with no blur over game objects.
    ctx.fillStyle = '#0c171219'; ctx.fillRect(0, 0, W, 16); ctx.fillRect(0, H - 16, W, 16);
    ctx.fillRect(0, 0, 12, H); ctx.fillRect(W - 12, 0, 12, H);
    this.stats.renderMs = performance.now() - start; this.stats.render_ms = this.stats.renderMs;
    this.stats.draw_calls = this.stats.drawCalls; this.frame++;
  }
  projectile(q, ox, oy, time) {
    const ctx = this.ctx, x = Math.round(q.x + ox), y = Math.round(q.y + oy), r = q.r || 3;
    if (!this.visible(x, y, r + 15)) return;
    if (q.type === 'knife') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(q.vy || 0, q.vx || 1));
      ctx.fillStyle = '#232523'; ctx.fillRect(-7, -2, 14, 4); ctx.fillStyle = '#e4dfbd'; ctx.fillRect(-2, -1, 9, 2);
      ctx.fillStyle = '#916d39'; ctx.fillRect(-6, -1, 4, 2); ctx.restore();
    } else if (q.type === 'axe') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(time * 12 + (q.id || 0));
      ctx.fillStyle = '#806047'; ctx.fillRect(-1, -8, 2, 16); ctx.fillStyle = '#cad2c3'; ctx.fillRect(-6, -7, 11, 5); ctx.fillRect(-7, -6, 2, 5); ctx.restore();
    } else if (q.type === 'bible') {
      ctx.fillStyle = '#1c1824'; ctx.fillRect(x - 5, y - 7, 10, 14); ctx.fillStyle = '#674367'; ctx.fillRect(x - 4, y - 6, 8, 12);
      ctx.fillStyle = '#d3ba70'; ctx.fillRect(x - 1, y - 4, 2, 8); ctx.fillRect(x - 3, y - 2, 6, 2);
    } else if (q.type === 'cross') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(time * 7); ctx.fillStyle = '#d4e4da'; ctx.fillRect(-1, -7, 3, 14); ctx.fillRect(-7, -1, 14, 3); ctx.restore();
    } else {
      ctx.fillStyle = q.type === 'fire' ? '#a74b36' : '#37527c'; ctx.fillRect(x - r - 2, y - r, r * 2 + 4, r * 2);
      ctx.fillStyle = q.type === 'fire' ? '#e4ad56' : '#a2d1e2'; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.fillStyle = '#f3edcd'; ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    this.stats.drawCalls++;
  }
  effect(fx, ox, oy, time, settings) {
    const ctx = this.ctx, x = Math.round(fx.x + ox), y = Math.round(fx.y + oy), r = fx.range || fx.r || 30;
    if (!this.visible(x, y, r + 20)) return;
    const progress = 1 - Math.max(0, fx.life || 0) / (fx.maxLife || .3);
    if (fx.type === 'whip' || fx.type === 'bloody') {
      const dir = fx.dir || 1, range = fx.range || 95, alpha = Math.min(1, (fx.life || .1) * 12);
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y - 12); ctx.scale(dir, 1);
      ctx.lineJoin = 'miter'; ctx.lineCap = 'square';
      const height = (fx.height || 28) / 2;
      const points = [[3, 1], [range * .25, -height * .5], [range * .6, -height], [range, -height * .55], [range * .9, height * .3], [range * .5, height * .5], [range * .2, height * .25]];
      for (const [width, color] of [[5, '#392a25'], [3, fx.type === 'bloody' ? '#a92f3d' : '#c3a77b'], [1, fx.type === 'bloody' ? '#f7b5b6' : '#fff2cf']]) {
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); points.forEach(([px, py], i) => i ? ctx.lineTo(Math.round(px), Math.round(py)) : ctx.moveTo(px, py)); ctx.stroke();
      }
      ctx.fillStyle = '#fff3cf'; ctx.fillRect(Math.round(range - 3), Math.round(-height * .5 - 3), 2, 7); ctx.fillRect(Math.round(range - 6), Math.round(-height * .5), 8, 1);
      ctx.restore();
    } else if (fx.type === 'lightning') {
      if (settings.flashes === false) return;
      ctx.strokeStyle = '#c9d6f0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 13, y - 90); ctx.lineTo(x + 5, y - 55); ctx.lineTo(x - 10, y - 34); ctx.lineTo(x, y); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();
    } else if (['hit', 'death', 'crit', 'pickup', 'chest', 'evolution'].includes(fx.type)) {
      const golden = ['pickup', 'chest', 'evolution'].includes(fx.type), count = golden ? 10 : 5;
      ctx.globalAlpha = Math.min(1, (fx.life || .1) * 6);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + ((fx.x || 0) % 4);
        const distance = (golden ? 7 : 3) + progress * (golden ? 30 : 12);
        const px = Math.round(x + Math.cos(angle) * distance), py = Math.round(y - 9 + Math.sin(angle) * distance);
        ctx.fillStyle = golden ? '#d5ba70' : i % 2 ? '#c4ba9f' : '#936b5a'; ctx.fillRect(px, py, 2, 2);
      }
      ctx.globalAlpha = 1;
    } else if (fx.type === 'fire') {
      for (let i = 0; i < 12; i++) {
        const px = Math.round(x + (fx.dir || 1) * i * 9), py = Math.round(y - 14 + Math.sin(i * 2 + time * 25) * (i + 2));
        ctx.fillStyle = i % 2 ? '#c45736' : '#e0a144'; ctx.fillRect(px, py, 7, 6);
        ctx.fillStyle = '#efdba0'; ctx.fillRect(px + 1, py + 2, 3, 2);
      }
    } else if ((fx.type === 'rosary' || fx.type === 'playerHit') && settings.flashes !== false) {
      ctx.globalAlpha = Math.min(.14, (fx.life || 0) * .15); ctx.fillStyle = fx.type === 'rosary' ? '#fff4d4' : '#b52536';
      ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    } else if (fx.type === 'pentagram' && settings.flashes !== false) {
      ctx.strokeStyle = '#a58aba'; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = i * Math.PI * .8 - Math.PI / 2; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    }
    this.stats.drawCalls++;
  }
}
