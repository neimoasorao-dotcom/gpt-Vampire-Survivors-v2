/** Ordered stat layers and event hooks shared by characters, stages and future Arcanas. */
export class ModifierBus {
  constructor(){this.listeners=new Map();this.modifiers=[];this.revision=0;}
  on(event,callback){if(!this.listeners.has(event))this.listeners.set(event,new Set());this.listeners.get(event).add(callback);return()=>this.listeners.get(event)?.delete(callback);}
  emit(event,payload){for(const fn of this.listeners.get(event)||[])fn(payload);return payload;}
  add(modifier){if(!modifier||typeof modifier.stat!=='string'||!Number.isFinite(modifier.value))throw new TypeError('Invalid stat modifier');const entry={...modifier};this.modifiers.push(entry);this.revision++;return()=>{const i=this.modifiers.indexOf(entry);if(i>=0){this.modifiers.splice(i,1);this.revision++;}};}
  active(time){return this.modifiers.filter(m=>m.expires==null||m.expires>time);}
  prune(time){const old=this.modifiers.length;this.modifiers=this.modifiers.filter(m=>m.expires==null||m.expires>time);if(old!==this.modifiers.length)this.revision++;}
}
export function applyModifiers(stats,modifiers=[]){for(const m of modifiers){if(!(m.stat in stats)||!Number.isFinite(m.value))continue;if(m.op==='multiply')stats[m.stat]*=m.value;else if(m.op==='set')stats[m.stat]=m.value;else stats[m.stat]+=m.value;}return stats;}
