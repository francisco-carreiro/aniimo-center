import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync, existsSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=relative=>readFileSync(new URL(relative,root),'utf8');
const manifest=JSON.parse(read('manifest.webmanifest'));
const sw=read('service-worker.js');
const html=read('index.html');

test('installable manifest links local icons and uses standalone mode',()=>{
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.scope,'/');
 assert.equal(manifest.start_url,'/?source=pwa');
 for(const icon of manifest.icons){
  assert.ok(existsSync(new URL(`.${icon.src}`,root)),icon.src);
  const png=readFileSync(new URL(`.${icon.src}`,root));
  assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),Number(icon.sizes.split('x')[0]));
 }
 assert.match(html,/rel="manifest"/);
 assert.match(html,/style\.min\.css/);
 assert.ok(!html.includes('style.css"'));
});

function makeServiceWorker({online=true}={}){
 const handlers=new Map();
 const stores=new Map();
 const urlOrigin='https://aniimo-center.netlify.app';
 const response=(text='ok')=>({ok:true,type:'basic',text:()=>Promise.resolve(text),clone(){return response(text)}});
 const caches={
  async open(name){
   if(!stores.has(name))stores.set(name,new Map());
   const map=stores.get(name);
   return {
    async addAll(paths){for(const path of paths)map.set(path,response(path))},
    async put(path,res){map.set(path,res)}
   };
  },
  async match(path){for(const items of stores.values()){if(items.has(path))return items.get(path)}return undefined},
  async keys(){return [...stores.keys()]},
  async delete(name){return stores.delete(name)},
 };
 const self={location:{origin:urlOrigin},clients:{async claim(){self.claimed=true}},skipWaiting(){self.skipped=true},
  addEventListener(name,fn){handlers.set(name,fn)}};
 const context={self,caches,Response:{error(){return {error:true}}},fetch:async request=>{
  if(!online)throw new Error('No connection');
  return response('live response');
 },AbortController,setTimeout,clearTimeout,URL,console};
 vm.runInNewContext(sw,context,{filename:'service-worker.js'});
 const trigger=async(type,request)=>{
  let promise,responded=false;
  const event={request,data:request,waitUntil(p){promise=p},respondWith(p){promise=p;responded=true}};
  handlers.get(type)(event);
  if(promise)await promise;
  return {responded,response:promise?await promise:null};
 };
 return {handlers,caches,stores,self,trigger,setOnline(v){online=v},response};
}

test('service worker precaches complete first-party shell and no external user data',async()=>{
 const sw=makeServiceWorker();
 await sw.trigger('install');
 const entries=sw.stores.get('wildbook-v2.0.0-shell');
 assert.ok(entries instanceof Map);
 for(const path of ['/','/index.html','/assets/app.js','/assets/style.min.css','/assets/wildbook-core.js','/assets/explorer-core.js','/assets/battle-core.js','/manifest.webmanifest'])
  assert.ok(entries.has(path),`Not precached: ${path}`);
 assert.ok([...entries.keys()].every(path=>path.startsWith('/')));
 assert.ok([...entries.keys()].every(path=>!path.includes('collection')&&!path.includes('backup')&&!path.includes('api/')));
});

test('service worker provides offline navigation and cached script, bypassing external hosts',async()=>{
 const worker=makeServiceWorker();
 await worker.trigger('install');
 worker.setOnline(false);
 const nav=await worker.trigger('fetch',{method:'GET',mode:'navigate',url:'https://aniimo-center.netlify.app/offline-trail'});
 assert.ok(nav.responded);
 assert.ok(nav.response);
 assert.equal(await nav.response.text(),'/index.html');
 const js=await worker.trigger('fetch',{method:'GET',mode:'cors',url:'https://aniimo-center.netlify.app/assets/app.js'});
 assert.ok(js.responded);
 assert.equal(await js.response.text(),'/assets/app.js');
 const external=await worker.trigger('fetch',{method:'GET',mode:'cors',url:'https://aniimo.ogoulart.dev/api/v1/aniimos.json'});
 assert.equal(external.responded,false);
});

test('service worker upgrades safely and preserves unrelated caches',async()=>{
 const worker=makeServiceWorker();
 worker.stores.set('wildbook-v1.8.0-shell',new Map());
 worker.stores.set('other-app-cache',new Map());
 await worker.trigger('install');
 await worker.trigger('activate');
 assert.ok(!worker.stores.has('wildbook-v1.8.0-shell'));
 assert.ok(worker.stores.has('other-app-cache'));
 assert.ok(worker.stores.has('wildbook-v2.0.0-shell'));
 assert.equal(worker.self.claimed,true);
 await worker.trigger('message',{type:'SKIP_WAITING'});
 assert.equal(worker.self.skipped,true);
});

test('portable edition includes the full app but no service-worker registration requirement',()=>{
 const page=read('ANIIMO-WILDBOOK.html');
 assert.match(page,/aniimo-wildbook:v2/);
 assert.match(page,/function syncAppChrome/);
 assert.match(page,/const STARTER_REGIONS\s*=/);
 assert.match(page,/function closeBuild/);
});
