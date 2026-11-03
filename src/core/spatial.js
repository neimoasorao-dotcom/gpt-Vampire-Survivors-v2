export class SpatialHash{
 constructor(size=48){this.size=size;this.cells=new Map();this.queries=0;this.checks=0;this.pool=[];}
 clear(){for(const a of this.cells.values()){a.length=0;this.pool.push(a);}this.cells.clear();this.queries=0;this.checks=0;}
 insert(e){const x=Math.floor(e.x/this.size),y=Math.floor(e.y/this.size),key=x+','+y;let a=this.cells.get(key);if(!a){a=this.pool.pop()||[];this.cells.set(key,a);}a.push(e);}
 query(x,y,r,fn){this.queries++;const z=this.size;for(let yy=Math.floor((y-r)/z);yy<=Math.floor((y+r)/z);yy++)for(let xx=Math.floor((x-r)/z);xx<=Math.floor((x+r)/z);xx++){const a=this.cells.get(xx+','+yy);if(a)for(const e of a){this.checks++;fn(e);}}}
}
