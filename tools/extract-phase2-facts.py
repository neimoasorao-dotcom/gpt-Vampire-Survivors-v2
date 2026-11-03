"""Select numerical observations, not prose/art/code, from the pinned community source."""
import json,re,sys,pathlib
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/vs-source-codex/site/data/detail')
def text(n):
 if isinstance(n,str):return n
 if isinstance(n,list):return ''.join(text(x)for x in n)
 if isinstance(n,dict):return n.get('t','')+text(n.get('c',[]))
 return ''
def num(s):
 m=re.match(r'\s*(\d+(?:\.\d+)?)',s);return float(m[1])if m else None
ids={'wand':'magic-wand','knife':'knife','axe':'axe','cross':'cross','bible':'king-bible','fire':'fire-wand','garlic':'garlic','water':'santa-water','runetracer':'runetracer','lightning':'lightning-ring','pentagram':'pentagram','peachone':'peachone','ebony':'ebony-wings','holy':'holy-wand','thousand':'thousand-edge','spiral':'death-spiral','heaven':'heaven-sword','vespers':'unholy-vespers','hellfire':'hellfire','soul':'soul-eater','borra':'la-borra','nofuture':'no-future','thunder':'thunder-loop','moon':'gorgeous-moon','vandalier':'vandalier'}
values={}
for id,slug in ids.items():
 path=root/('weapon.'+slug+'.json')
 if not path.exists():continue
 d=json.loads(path.read_text());stats={r['label']:[text(c)for c in r['cells']]for box in d.get('infobox',[])if box['title']=='Stats'for r in box['rows']}
 initial={};fieldmap={'Damage':'damage','Amount':'amount','Pierce':'pierce','Cooldown':'cooldown','Duration':'duration','Area':'area','Projectile Interval':'interval','Pool Limit':'poolLimit','Hitbox Delay':'hitDelay','Knockback':'knockback'}
 for label,key in fieldmap.items():
  n=num(stats.get(label,[''])[0]);
  if n is not None:initial[key]=n/100 if key=='area' and re.match(r'[\d.]+\s*%',stats[label][0]) else n
 rows=[]
 for sec in d.get('sections',[]):
  if sec['id']=='levels':
   for b in sec.get('blocks',[]):
    if b.get('k')=='table':rows=[text(row['cells'][1])for row in b['rows'][1:]if len(row.get('cells',[]))>1];break
 level=[dict(initial)];state=dict(initial); speedMultiplier=1
 for desc in rows[1:]:
  change={}
  retain=re.search(r'(\d+)% chance not to erase',desc)
  if retain:change['retain']=float(retain[1])/100
  patterns=[(r'Base Damage up by ([\d.]+)','damage',1),(r'Fires (\d+) more projectile','amount',1),(r'Passes through (\d+) more enem','pierce',1),(r'Cooldown reduced by ([\d.]+)','cooldown',-1),(r'Effect lasts ([\d.]+).*?longer','duration',1),(r'Base Area up by ([\d.]+)%','area',.01)]
  for pat,key,factor in patterns:
   m=re.search(pat,desc)
   if m:
    state[key]=round(state.get(key,0)+float(m[1].rstrip("."))*factor,4);change[key]=state[key]
  m=re.search(r'Base Speed up by ([\d.]+)%',desc)
  if m:speedMultiplier+=float(m[1])*.01;change['speedMultiplier']=round(speedMultiplier,4)
  level.append(change)
 # Use explicit maximum summary when rounding/legacy annotations conflict with per-level text.
 if len(level)>1:
  for label,key in fieldmap.items():
   maximum=num(stats.get(label,['',''])[1] if len(stats.get(label,[]))>1 else '')
   if maximum is not None:level[-1][key]=maximum/100 if key=='area' and re.match(r'[\d.]+\s*%',stats[label][1])else maximum
 values[id]={'levels':level,'blockedByWalls':stats.get('Blocked by walls',['No'])[0]=='Yes','source':f'https://github.com/prabinpebam/survivors-companion/blob/5e345c547ebe39c429d99032aae8e688fa15bfd4/site/data/detail/weapon.{slug}.json','status':'estimated','provenance':'community_documented','confidence':.65}
pathlib.Path('src/data/researched-weapon-values.js').write_text('// Independently expressed numerical facts. Community source attribution: research/phase2_sources.md.\nexport const RESEARCHED_WEAPON_VALUES='+json.dumps(values,ensure_ascii=False,separators=(',',':'))+';\n')
wavefacts={}
for id,slug in [('forest','mad-forest'),('library','inlaid-library')]:
 d=json.loads((root/('stage.'+slug+'.json')).read_text());rows=[]
 for sec in d['sections']:
  if sec['id']=='waves':
   for block in sec['blocks']:
    if block.get('k')=='table':
     for row in block['rows']:
      cs=[text(c).strip()for c in row['cells']]
      if len(cs)<5 or not re.match(r'\d+:\d+',cs[0]):continue
      clock=cs[0].replace('+','').split(':');seconds=int(clock[0])*60+int(clock[1]);boss=cs[4];firstboss=boss.split('Level:')[0].strip();firstboss=firstboss.split('\n')[0].strip()
      chance=re.findall(r'(\d+(?:\.\d+)?)%',boss)
      rows.append({'start':seconds,'enemyNames':cs[1].replace('(x2)','').strip().splitlines(),'minimum':num(cs[2]),'interval':num(cs[3]),'bossName':firstboss if firstboss!='-' else None,'evolutionEligible':'Evolution: Yes'in boss,'chest':'Level:'in boss,'chestProbabilities':[float(v)/100 for v in chance[:3]],'eventNames':[t for t in ['Bat Swarm','Flower Wall','Flea Swarm']if t in (cs[5]if len(cs)>5 else'') ]})
 wavefacts[id]=rows
pathlib.Path('src/data/stage-reference.js').write_text('// Factual timetable; numeric unit conversions and spawn reconstruction remain estimated. Attribution: research/phase2_sources.md.\nexport const STAGE_REFERENCE='+json.dumps(wavefacts,separators=(',',':'))+';\n')
print('Extracted',len(values),'weapon tables and',sum(map(len,wavefacts.values())),'stage rows')
