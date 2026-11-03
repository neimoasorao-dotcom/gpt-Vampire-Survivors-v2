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
// New art is authored here rather than imported from protected game files.
Object.assign(art, {
  wand: ['......CC...','.....CwwC..','....CwYC...','.....CY....','....yo.....','...yo......','..yo.......','.yo........','oo.........'],
  knife: ['.............w','...........ww.','yyyywwwwwww...','ossswwwwww....','..............'],
  axe: ['...oooo...','..oCwwCo..','.oCwwwwCo.','oCwwyywCo.','.oCwyyCo..','..o.yy....','....yy....','....yy....','....yy....','....oo....'],
  cross: ['....ooo....','....oCo....','....oCo....','.ooooCoooo.','oCCCCYCCCCo','.ooooCoooo.','....oCo....','....oCo....','....ooo....'],
  bible: ['ooooooooooo','oyppppppppo','oyPPppppppo','oypppYppppo','oypppYppppo','oypYYYYYppo','oypppYppppo','oypppYppppo','oypppYppppo','oyppppppppo','owwwwwwwwwo','ooooooooooo'],
  fireball: ['......r....','..r..rYr...','.rYr.rYYr..','rYYYrYYYr..','rYYYYYYYr..','rYYYYYwwYr.','.rYYYYwYr..','..rYYYr....','...rrr.....'],
  tracer: ['....o....','...oPo...','..oPCPo..','.oPCYCPo.','oPCYwYCPo','.oPCYCPo.','..oPCPo..','...oPo...','....o....'],
  bird: ['.....ooo......','....oCCCoo....','...oCwwCwyo...','...oCkwCoo....','....oCCCoooo..','oooooCCCwwCCo.','oCCCwwCwwCCo..','.ooCCwwCCoo...','...oooooo.....','....y..y......'],
  ebonyBird: ['.....ooo......','....opppoo....','...opPPppyo...','...opkPpoo....','....opppoooo..','ooooopppPPppo.','opppPPpPPppo..','.ooppPPppoo...','...oooooo.....','....y..y......'],
  flask: ['...CCCC...','...oCCo...','...oCCo...','..oBCCBo..','.oBCCCCBo.','oBCwwCCCBo','oBCCCCCBBBo','.oBBBBBBo.','..oooooo..'],
  medusa: ['..n..nn..n..','.nLnnLLnnLn.','..nLLLLLLn..','..ossssoo...','..ohkhkho...','..ohhhho....','...ohho.....','..oppppo....','.oppppppo...','oppppppppo..','..nnllllnn..','.nLnnLLnnLn.','..n..nn..n..'],
  mummy: ['...oooo...','..owwwwo..','..wkwkww..','..owwwwo..','...owwo...','..owwwwo..','.owwSwwwo.','owoSwwSowo','owowwwwowo','...owwo...','..owwwwo..','..ow..wo..','.oww..wwo.'],
  mudman: ['....oooo....','...osssso...','..osSssSso..','..osksskso..','...osssso...','...osssso...','..osssSsso..','.osSssssSso.','ossoSssSosso','...osssso...','...osssso...','..ossoosso..','.osss..ssso.'],
  witch: ['.....p......','....pPp.....','...pPPPp....','..ppppppp...','...ohhho....','...okhko....','....hho.....','...opppo....','..opPPPpo...','.opPPPPPpo..','opPPPPPPPpo.','..oo..oo....'],
  wraith: ['....oooo....','...opPPpo...','..opPwwPpo..','..opwkkwpo..','..opwwwwpo..','...opPpo....','..opPPPpo...','.opPPPPPpo..','opPPPPPPPpo.','..opPPPpo...','.opPooPPpo..','..oo..ooo...'],
  bracer: ['..yyyy....','.ytssyo...','oytssSyo..','oytssSyo..','.oyyyyoo..','..owwwo...'],
  spellbinder: ['ooooooo','opppppo','opYpYpo','opYYYpo','opYpYpo','owwwwwo','ooooooo'],
  duplicator: ['....P....','..PPYPP..','.PYwwwYP.','PYwwYwwYP','.PYwwwYP.','..PPYPP..','....P....'],
  crown: ['y...y...y','yy.yyy.yy','yYyYYYyYy','yYYYYYYYy','yyyyyyyyy'],
  tome: ['oooooooo','oywwwwwo','oywwwwwo','oywwwwwo','oywwwwwo','oywwwwwo','oooooooo'],
  wings: ['.C.....C.','CC.....CC','CCC...CCC','.CCC.CCC.','..CCCCC..','...CCC...','....C....'],
  armor: ['..ooo.ooo..','.owwWowww o.','owwWWWWWwwo','..owWWWWwo.','..owWWWWwo.','..owwwwwwo.','...oooooo..'],
  skull: ['..ooooo..','.owwwwwo.','owwkwkwwo','owwwwwwwo','.owwwww o.','..owwwo..','..owowo..'],
  mask: ['.yyyyyyy.','yYYyYYyYYy','yYkkYkkYy','yYYYYYYYy','.yYyyyYy.','..yyyyy..'],
});

function hash(x, y, salt = 0) {
  let v = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ salt;
  v = Math.imul(v ^ v >>> 13, 1274126177);
  return (v ^ v >>> 16) >>> 0;
}
function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return c;
}
function sprite(rows, colors = palette) {
  const c = canvas(Math.max(...rows.map(row => row.length)), rows.length), ctx = c.getContext('2d');
  rows.forEach((row, y) => [...row].forEach((pixel, x) => {
    const color = colors[pixel]; if (color) { ctx.fillStyle = color; ctx.fillRect(x, y, 1, 1); }
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
    this.characterSprites = this.makeCharacters();
    this.rotatedSprites = new Map();
    this.mirroredSprites = new Map();
    this.chunks = new Map(); this.stats = { renderMs: 0, drawCalls: 0, visibleEnemies: 0, visiblePickups: 0 };
    this.frame = 0; this.resize();
  }
  makeCharacters() {
    const styles = {
      antonio: {}, imelda: {r:'#3f5c98', R:'#7592c2', s:'#ac803d'}, pasqualina: {r:'#597644', R:'#8eaa62', s:'#5a3c30'},
      gennaro: {r:'#b28b49', R:'#d0b77b', s:'#342c2a'}, arca: {r:'#301e39', R:'#8a416a', s:'#b5b0a2'},
      porta: {r:'#718eaf', R:'#c5d5e2', s:'#b4a16b'}, lama: {r:'#4a5b38', R:'#8e9c55', s:'#a46336'},
      poe: {r:'#8d7562', R:'#b3a082', s:'#ada99b'}, clerici: {r:'#4d7691', R:'#a3c0ca', s:'#d8b990'},
      dommario: {r:'#897449', R:'#c3b170', s:'#795c3d'}, krochi: {r:'#7f272a', R:'#bf654b', s:'#a08e7a'}
    };
    const sprites = {};
    for (const [id, colors] of Object.entries(styles)) {
      const rows = [...art.player];
      if (['imelda','pasqualina','porta','clerici'].includes(id)) {
        rows[0]='....ooooooo.....'; rows[1]='...osssssso.....';
        rows[16]='...orrrrrro.....'; rows[17]='..orrrrrrrro....'; rows[18]='..orrrrrrrro....';
      }
      if (['arca','poe','dommario'].includes(id)) { rows[0]='....oooooo......'; rows[1]='...owwwwwwo.....'; rows[4]='.....wtt........'; }
      if (id==='krochi') { rows[0]='...o..oooo..o...'; rows[1]='...osssssssso...'; }
      if (id==='lama') { rows[0]='...ooooooo......'; rows[1]='..oSSSSSSSoo....'; }
      sprites[id]=sprite(rows,{...palette,...colors});
    }
    return sprites;
  }
  rotated(id, angle=0, evolved=false) {
    const frame = ((Math.round(angle / (Math.PI / 8)) % 16) + 16) % 16;
    const key = id+':'+frame+':'+Number(evolved);
    if (this.rotatedSprites.has(key)) return this.rotatedSprites.get(key);
    const source=this.sprites[id]||this.sprites.tracer, size=Math.ceil(Math.hypot(source.width,source.height))+2;
    const c=canvas(size,size),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.translate(size/2,size/2);ctx.rotate(frame*Math.PI/8);ctx.drawImage(source,-source.width/2,-source.height/2);
    if(evolved){ctx.globalCompositeOperation='source-atop';ctx.fillStyle='#e1c76b55';ctx.fillRect(-size,-size,size*2,size*2);}
    this.rotatedSprites.set(key,c);return c;
  }
  libraryChunk(cx,cy,stage) {
    const key='library:'+cx+','+cy;if(this.chunks.has(key))return this.chunks.get(key);
    const c=canvas(CHUNK,CHUNK),ctx=c.getContext('2d'),top=stage?.bounds?.minY??stage?.tilemap?.floorTop??-200,bottom=stage?.bounds?.maxY??stage?.tilemap?.floorBottom??200;
    ctx.fillStyle='#24202a';ctx.fillRect(0,0,CHUNK,CHUNK);
    for(let y=0;y<CHUNK;y+=16)for(let x=0;x<CHUNK;x+=32){const worldY=cy*CHUNK+y,v=hash(cx*8+x/32,cy*16+y/16);ctx.fillStyle=worldY<top||worldY>bottom?'#211c25':v%2?'#645948':'#5a5144';ctx.fillRect(x,y,32,16);ctx.fillStyle='#413b35';ctx.fillRect(x,y,32,1);ctx.fillRect(x,y,1,16);ctx.fillStyle='#776a53';ctx.fillRect(x+2,y+2,26,1);}
    for(const wallY of [top-32,bottom+18]){const yy=Math.round(wallY-cy*CHUNK);if(yy>-64&&yy<CHUNK+64){ctx.fillStyle='#302531';ctx.fillRect(0,yy,CHUNK,30);ctx.fillStyle='#8a7050';ctx.fillRect(0,yy,CHUNK,3);ctx.fillRect(0,yy+26,CHUNK,3);for(let x=0;x<CHUNK;x+=6){ctx.fillStyle=['#6c3b42','#42606a','#766844','#5e4167'][hash(cx,x)%4];ctx.fillRect(x+1,yy+5,4,19);ctx.fillStyle='#ad9462';ctx.fillRect(x+1,yy+8,4,1);}}}
    this.chunks.set(key,c);if(this.chunks.size>64)this.chunks.delete(this.chunks.keys().next().value);return c;
  }
  libraryObstacles(engine,ox,oy) {
    const stage=engine.definition||{}, obstacles=stage.obstacles||stage.tilemap?.obstacles||[],repeat=stage.obstacleRepeat||stage.tilemap?.repeat||stage.specialRules?.obstacleRepeat||640;
    for(let chunk=Math.floor((-ox-200)/repeat);chunk<=Math.ceil((W-ox+200)/repeat);chunk++)for(const obstacle of obstacles){const x=(obstacle.x||0)+chunk*repeat+ox,y=(obstacle.y||0)+oy,w=obstacle.w||obstacle.width||32,h=obstacle.h||obstacle.height||24;if(!this.visible(x+w/2,y+h/2,Math.max(w,h)))continue;const ctx=this.ctx;ctx.fillStyle='#211e25';ctx.fillRect(Math.round(x-2),Math.round(y-3),w+4,h+6);ctx.fillStyle='#69583f';ctx.fillRect(Math.round(x),Math.round(y),w,h);ctx.fillStyle='#9d855e';ctx.fillRect(Math.round(x),Math.round(y),w,3);ctx.fillRect(Math.round(x),Math.round(y+h-3),w,3);for(let xx=3;xx<w-3;xx+=5){ctx.fillStyle=['#813e43','#495f70','#9d8654','#676341'][hash(xx,chunk)%4];ctx.fillRect(Math.round(x+xx),Math.round(y+5),3,Math.max(1,h-10));}this.stats.drawCalls++;}
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
  mirroredSprite(source) {
    let cached = this.mirroredSprites.get(source);
    if (cached) return cached;
    cached = canvas(source.width, source.height);
    const ctx = cached.getContext('2d'); ctx.imageSmoothingEnabled = false;
    ctx.translate(source.width, 0); ctx.scale(-1, 1); ctx.drawImage(source, 0, 0);
    this.mirroredSprites.set(source, cached);
    if (this.mirroredSprites.size > 128) this.mirroredSprites.delete(this.mirroredSprites.keys().next().value);
    return cached;
  }
  image(id, x, y, { scale = 1, flip = false, flash = false, shadow = true } = {}) {
    const ctx = this.ctx, s = (flash ? this.flashes : this.sprites)[id] || this.sprites.zombie;
    const w = s.width * scale, h = s.height * scale;
    x = Math.round(x); y = Math.round(y);
    if (shadow) { ctx.fillStyle = '#17231c'; ctx.fillRect(Math.round(x - w * .32), y - 2, Math.round(w * .64), 4); }
    // Only scales proved pixel-identical use the mirror cache; fractional fallback stays unchanged.
    if (flip && (scale === 1 || scale === 1.2 || scale === 2)) {
      ctx.drawImage(this.mirroredSprite(s), x + Math.floor(w / 2) - w, y - h, w, h);
    } else if (flip) {
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
    const stage=e.definition||{}, library=stage.environment==='library'||e.stage==='library';
    const ox = Math.round(W / 2 - p.x + shakeX), oy = Math.round(H / 2 - (library?0:p.y) + shakeY);
    const minX = Math.floor(-ox / CHUNK), minY = Math.floor(-oy / CHUNK);
    for (let cy = minY; cy <= minY + 3; cy++) for (let cx = minX; cx <= minX + 4; cx++) {
      ctx.drawImage(library?this.libraryChunk(cx,cy,stage):this.chunk(cx, cy), cx * CHUNK + ox, cy * CHUNK + oy); this.stats.drawCalls++;
    }
    if(library)this.libraryObstacles(e,ox,oy);
    // Persistent floor effects appear beneath the crowd.
    for (const fx of e.effects || []) if (['zone','garlic','water','aura','borra','soul'].includes(fx.type)) {
      const x = fx.x + ox, y = fx.y + oy, r = fx.range || fx.r || 40;
      if (!this.visible(x, y, r)) continue;
      ctx.globalAlpha = .18 * Math.min(1, (fx.life || 1) * 3);
      ctx.fillStyle = ['water','borra'].includes(fx.type)?(fx.type==='borra'?'#56a6c1':'#7daabb'):fx.type==='soul'?'#652d4c':'#c2bd8b';
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha = .35; ctx.strokeStyle = '#e5dec4'; ctx.lineWidth = 1;
      ctx.beginPath();ctx.arc(x,y,Math.max(1,r-3),0,Math.PI*2);ctx.stroke();
      if(['water','borra'].includes(fx.type)){ctx.fillStyle='#b4d8d8';for(let i=0;i<8;i++){const a=i*Math.PI/4+time*.8,rr=r*(.35+((i*37)%6)*.1);ctx.fillRect(Math.round(x+Math.cos(a)*rr),Math.round(y+Math.sin(a)*rr),2,2);}}ctx.globalAlpha=1;
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
      this.image(this.sprites[item.id]?item.id:'heart', x, y, { shadow: false });
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
      const spriteId=enemy.renderAs||{ectoplasm:'ghost',fleaman:'werewolf',hag:'witch',giantMudman:'mudman',nesufritto:'wraith'}[enemy.type]||enemy.type;
      this.image(spriteId, x, y + ((Math.floor(time * (enemy.type === 'bat' ? 12 : 5) + enemy.id) % 2) ? 1 : 0), { scale, flip: enemy.x > p.x, flash: settings.flashes !== false && enemy.flash > 0 });
      if (enemy.boss && enemy.hp < enemy.maxHp) {
        ctx.fillStyle = '#1b171c'; ctx.fillRect(Math.round(x - 17), Math.round(y + 5), 34, 4);
        ctx.fillStyle = '#a83a43'; ctx.fillRect(Math.round(x - 16), Math.round(y + 6), Math.max(0, 32 * enemy.hp / enemy.maxHp), 2);
      }
      if (e.options?.hitboxes) { ctx.strokeStyle = '#e3a062'; ctx.beginPath(); ctx.arc(x, y - 8, enemy.r || 7, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (e.state !== 'dead' || Math.floor(time * 10) % 2) {
      const flicker = (e.hitCooldown || p.invulnerability || 0) > 0 && Math.floor(time * 20) % 2;
      if (!flicker) {const id=e.character||'antonio',original=this.sprites.player;this.sprites.player=this.characterSprites[id]||original;this.image('player',p.x+ox,p.y+oy,{scale:1.2,flip:p.facing<0});this.sprites.player=original;}
    }
    // Health bar belongs to the world, while XP/time/inventory are in DOM HUD.
    if (p.maxHp) {
      ctx.fillStyle = '#171719'; ctx.fillRect(Math.round(p.x+ox)-16,Math.round(p.y+oy)+7,32,5);
      ctx.fillStyle = '#5b222a'; ctx.fillRect(Math.round(p.x+ox)-15,Math.round(p.y+oy)+8,30,3);
      ctx.fillStyle = '#c34343'; ctx.fillRect(Math.round(p.x+ox)-15,Math.round(p.y+oy)+8,Math.max(0,30*p.hp/p.maxHp),3);
    }
    if(e.weapons)for(const [id,phase] of [['peachone',0],['ebony',Math.PI],['vandalier',0]])if(e.weapons[id]){const angle=time*.6+phase;this.image(id==='ebony'?'ebonyBird':'bird',p.x+ox+Math.cos(angle)*34,p.y+oy-28+Math.sin(angle)*14,{flip:Math.cos(angle)>0,shadow:false,scale:id==='vandalier'?1.2:1});}
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
    const ctx=this.ctx,x=Math.round(q.x+ox),y=Math.round(q.y+oy),r=q.r||3;
    if(!this.visible(x,y,r+20))return;
    const type=q.type||q.weapon||'', evolved=['holy','thousand','spiral','heaven','vespers','hellfire','nofuture','vandalier'].includes(type);
    let id=null,angle=Number.isFinite(q.angle)?q.angle:Math.atan2(q.vy||0,q.vx||1);
    if(['knife','thousand'].includes(type))id='knife';
    else if(['axe','spiral'].includes(type)){id='axe';if(!Number.isFinite(q.angle))angle=time*12+(q.id||0);}
    else if(['cross','heaven'].includes(type)){id='cross';if(!Number.isFinite(q.angle))angle=time*7;}
    else if(['bible','vespers'].includes(type)){id='bible';angle=0;}
    else if(['fire','hellfire'].includes(type))id='fireball';
    else if(['runetracer','nofuture'].includes(type)){id='tracer';angle=time*3;}
    else if(type==='water')id='flask';
    if(id){const img=this.rotated(id,angle,evolved),scale=Math.max(.65,Math.min(2.5,(r||4)/(id==='bible'?7:id==='fireball'?5:4)));ctx.drawImage(img,Math.round(x-img.width*scale/2),Math.round(y-img.height*scale/2),Math.round(img.width*scale),Math.round(img.height*scale));}
    else if(['peachone','ebony','vandalier'].includes(type)){
      ctx.fillStyle=type==='ebony'?'#6d447d':type==='vandalier'?'#c08c65':'#c8d9dc';ctx.fillRect(x-r-1,y-r-1,r*2+2,r*2+2);ctx.fillStyle=type==='ebony'?'#baa2ce':'#f9f2c2';ctx.fillRect(x-r+1,y-r+1,Math.max(2,r*2-2),Math.max(2,r*2-2));
      if(Number.isFinite(q.targetX)&&Number.isFinite(q.targetY)){ctx.globalAlpha=.25;ctx.strokeStyle=type==='ebony'?'#b59acb':'#d3d7b8';ctx.beginPath();ctx.arc(q.targetX+ox,q.targetY+oy,6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    }else{
      const holy=type==='holy';ctx.fillStyle=holy?'#7b8b9b':'#37527c';ctx.fillRect(x-r-2,y-r,r*2+4,r*2);ctx.fillStyle=holy?'#dce5e6':'#a2d1e2';ctx.fillRect(x-r,y-r,r*2,r*2);ctx.fillStyle='#f3edcd';ctx.fillRect(x-1,y-1,2,2);
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
    } else if (fx.type === 'lightning'||fx.type==='thunder') {
      if (settings.flashes === false) return;
      ctx.strokeStyle=fx.type==='thunder'?'#dfd1ff':'#c9d6f0';ctx.lineWidth=fx.type==='thunder'?5:3; ctx.beginPath(); ctx.moveTo(x - 13, y - 90); ctx.lineTo(x + 5, y - 55); ctx.lineTo(x - 10, y - 34); ctx.lineTo(x, y); ctx.stroke();
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
    } else if(['peachone','ebony','vandalier','nofuture'].includes(fx.type)){
      ctx.globalAlpha=Math.min(.7,(fx.life||0)*3);ctx.strokeStyle=fx.type==='ebony'?'#b38bce':fx.type==='nofuture'?'#89d4c9':'#e6d2a1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,Math.max(2,r*(.3+progress)),0,Math.PI*2);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ctx.fillRect(Math.round(x+Math.cos(a)*r*progress),Math.round(y+Math.sin(a)*r*progress),3,3);}ctx.globalAlpha=1;
    } else if ((fx.type === 'pentagram'||fx.type==='moon')) {
      ctx.globalAlpha=settings.flashes===false?.25:Math.min(.9,(fx.life||0)*2);ctx.strokeStyle=fx.type==='moon'?'#e5d3a4':'#a58aba';ctx.lineWidth=2;ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = i * Math.PI * .8 - Math.PI / 2; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();if(fx.type==='moon'){ctx.beginPath();ctx.arc(x,y,r*.7,0,Math.PI*2);ctx.stroke();for(let i=0;i<12;i++){const px=(i*83+Math.floor(time*15)*7)%W;ctx.fillStyle='#f3e4c2';ctx.fillRect(px,Math.round((progress*H+i*37)%H),2,18);}}ctx.globalAlpha=1;
    }
    this.stats.drawCalls++;
  }
}
