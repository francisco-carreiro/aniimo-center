import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPublicCatalog} from '../assets/live-data.js';

test('offline catalog returns immediately without attempting a network request',async()=>{
 const previous={navigator:globalThis.navigator,localStorage:globalThis.localStorage,fetch:globalThis.fetch};
 let networkCalls=0;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:false}});
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(){return null},setItem(){}}});
 Object.defineProperty(globalThis,'fetch',{configurable:true,value:async()=>{networkCalls++;throw new Error('Should not fetch while offline')}});
 try {
  const result=await loadPublicCatalog({timeout:15000});
  assert.equal(result.mode,'unavailable');
  assert.deepEqual(result.items,[]);
  assert.equal(networkCalls,0);
 }finally{
  for(const [key,value] of Object.entries(previous))Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
 }
});
