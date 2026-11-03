// Recipe evaluation has no mutation or RNG; reward application is atomic.
export function canEvolve(rule,engine,chest){
 if(engine.weapons[rule.id])return false;
 if(rule.blacklist?.includes(engine.character))return false;
 if(rule.stage?.length&&!rule.stage.includes(engine.stage))return false;
 if(rule.character&&rule.character!==engine.character)return false;
 if(rule.chest&&!chest?.eligible)return false;
 const min=rule.chestMinTime??0;
 if(!chest?.eligibilityOverride&&(chest?.born??0)<min)return false;
 if(rule.time!=null&&engine.time<rule.time)return false;
 const requirements=rule.requires||rule.requirements||[{id:rule.base,kind:'weapon',level:rule.baseLevel},...(rule.passive?[{id:rule.passive,kind:'passive',level:rule.passiveLevel||1}]:[])];
 if(!requirements.every(r=>((r.kind==='passive'?engine.passives:engine.weapons)[r.id]||0)>=(r.level||1)))return false;
 return true;
}
export function applyEvolution(rule,engine){
 const before={weapons:{...engine.weapons},passives:{...engine.passives}};
 for(const id of rule.consume||[]) {delete engine.weapons[id];if(rule.consumePassives)delete engine.passives[id];}
 if(!engine.give(rule.id,1)){engine.weapons=before.weapons;engine.passives=before.passives;return false;}
 engine.evolutionTime??=engine.time;engine.evolutionHistory??=[];engine.evolutionHistory.push({id:rule.id,time:engine.time,type:rule.type||'evolution'});return true;
}
