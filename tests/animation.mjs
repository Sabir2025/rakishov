import assert from 'node:assert/strict';
import {initField} from '../js/animation.js';
let arcs=[],scheduled=new Map(),serial=0,draws=0;const events={},documentEvents={};
const ctx=new Proxy({clearRect(){arcs=[];draws++},arc(x,y,r){arcs.push({x,y,r})}},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const hero={addEventListener:(k,v)=>events[k]=v,removeEventListener:k=>delete events[k]};
const canvas={parentElement:hero,getContext:()=>ctx,getBoundingClientRect:()=>({width:440,height:360,left:0,top:0})};
const preference={matches:false,addEventListener(k,v){this.change=v},removeEventListener(){}};
Object.assign(globalThis,{document:{hidden:false,querySelector:()=>canvas,addEventListener:(k,v)=>documentEvents[k]=v,removeEventListener:k=>delete documentEvents[k]},devicePixelRatio:1,matchMedia:()=>preference,requestAnimationFrame:fn=>{scheduled.set(++serial,fn);return serial},cancelAnimationFrame:id=>scheduled.delete(id),addEventListener(){},removeEventListener(){}});
let time=0;function tick(n){for(let i=0;i<n;i++){time+=1000/60;const jobs=[...scheduled.values()];scheduled.clear();jobs.forEach(fn=>fn(time))}}
const stop=initField();tick(1);assert.equal(arcs[0].x,0);events.pointermove({clientX:100,clientY:100,pointerType:'mouse'});tick(45);assert.ok(Math.hypot(arcs[0].x,arcs[0].y)>1,'Pointer must displace nodes');events.pointerleave();tick(300);assert.ok(Math.hypot(arcs[0].x,arcs[0].y)<.1,'Nodes return to anchors');
preference.matches=true;preference.change();tick(1);assert.equal(scheduled.size,0,'Reduced motion must stop frame loop');assert.equal(arcs[0].x,0);preference.matches=false;preference.change();tick(1);document.hidden=true;documentEvents.visibilitychange();assert.equal(scheduled.size,0);stop();assert.equal(scheduled.size,0);console.log('PASS: cursor repulsion, spring return, reduced-motion static grid, hidden-tab pause, cleanup.');
