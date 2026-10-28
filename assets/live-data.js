// ANIIMO CENTER / public Aniimo Tools API adapter.
// Data is fetched read-only by the visitor's browser. No account, proxy, token or telemetry.
// API documentation: https://aniimo.ogoulart.dev/api/
export const ANIIMO_PUBLIC_API = 'https://aniimo.ogoulart.dev/api/v1/aniimos.json';
export const ANIIMO_PUBLIC_INFO = 'https://aniimo.ogoulart.dev/api/';
export const CACHE_NAME = 'aniimo-center:public-catalog:v2';
export const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const arr = v => Array.isArray(v) ? v : isObject(v) ? Object.values(v) : [];
const string = (v, fallback = '') => {
  if (typeof v === 'string' || typeof v === 'number') return String(v).trim();
  if (isObject(v)) return string(v.en ?? v.EN ?? v.english ?? v.name ?? v.pt ?? v.PT ?? v.value, fallback);
  return fallback;
};
const date = v => typeof v === 'string' ? v.slice(0, 24) : '';
const num = v => Number.isFinite(Number(v)) && v !== '' && v != null ? Number(v) : null;
const safeImage = raw => {
  const url = string(typeof raw === 'string' ? raw : raw?.url ?? raw?.src ?? raw?.original ?? raw?.en ?? raw?.image ?? raw?.imagem);
  try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password && url.length < 2048 ? u.href : ''; }
  catch { return ''; }
};
const elementAlias = { electric:'Lightning', electricity:'Lightning', lightning:'Lightning', electro:'Lightning', holy:'Light', light:'Light', rock:'Rock', earth:'Rock', fire:'Fire', grass:'Grass', water:'Water', wind:'Wind', ice:'Ice', dark:'Dark' };
const roleAlias = { dps:'DPS',damage:'DPS',break:'Break',breaker:'Break',sup:'Support',support:'Support',heal:'Heal',healing:'Heal',energy:'Regen',regen:'Regen',regeneration:'Regen' };
const normList = v => Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,/|]/).map(s => s.trim()) : isObject(v) ? Object.values(v) : [];
function elements(v) { return [...new Set(normList(v).map(x => elementAlias[string(x).toLowerCase()] || null).filter(Boolean))]; }
function roles(v) { return [...new Set(normList(v).map(x => roleAlias[string(x).toLowerCase()] || null).filter(Boolean))]; }
function names(v) { return [...new Set(normList(v).map(x => string(x.nome ?? x.name ?? x)).filter(Boolean))].slice(0, 48); }
function skills(v) { return normList(v).map(s => ({
  name: string(s.nome ?? s.name ?? s.titulo ?? s.title ?? s),
  type: string(s.tipo ?? s.type ?? s.skillType),
  element: elements(s.elementos ?? s.element ?? s.elemento),
  power: num(s.poder ?? s.power), cost: num(s.custo ?? s.cost),
  description: string(s.desc ?? s.descricao ?? s.description).slice(0, 600)
})).filter(s => s.name).slice(0, 50); }
function traits(v) { return normList(v).map(t => ({
  name: string(t.nome ?? t.name ?? t.titulo ?? t),
  description: string(t.desc ?? t.descricao ?? t.description ?? t.efeito).slice(0, 700)
})).filter(t => t.name).slice(0, 30); }
function statistics(v) {
  if (!isObject(v)) return null;
  const r = { HP:num(v.hp ?? v.HP), ATK:num(v.atk ?? v.ATK), BREAK:num(v.brk ?? v.break ?? v.BREAK), 'P.DEF':num(v.pdef ?? v.pDef ?? v['P.DEF']), 'M.DEF':num(v.mdef ?? v.mDef ?? v['M.DEF']), REGEN:num(v.regen ?? v.REGEN) };
  const complete=Object.values(r).filter(x=>x!==null);
  if (!complete.length) return null;
  r.total = num(v.total) ?? (complete.length===6 ? complete.reduce((a,b)=>a+b,0) : null);
  return r;
}
function displayFormName(form, index) {
  const raw = string(form.nome ?? form.name ?? form.forma ?? form.chave ?? form.key, index===0?'Basic Form':`Form ${index+1}`);
  return raw.replace(/\s*form$/i,'').trim() || 'Basic';
}
function normalizeForm(form, index, animal) {
  const label=displayFormName(form,index);
  return {
    id: string(form.chave ?? form.key ?? form.id, label.toLowerCase().replace(/\s+/g,'-')),
    name: label, stage:num(form.estagio ?? form.stage),
    elements:elements(form.elementos ?? form.elements ?? form.tipo ?? animal.elementos),
    roles:roles(form.papeis ?? form.roles ?? form.papel ?? animal.papeis),
    stats:statistics(form.stats ?? form.atributos ?? animal.stats),
    skills:skills(form.skills ?? form.habilidades), traits:traits(form.traits ?? form.tracos ?? form.traços),
    habitats:names(form.locais ?? form.habitats ?? form.locations),
    image:safeImage(form.imagem ?? form.image ?? form.artwork),
    description:string(form.desc ?? form.descricao ?? form.description).slice(0,800)
  };
}
function normalizeAnimal(animal, index) {
  if (!isObject(animal)) return null;
  const name=string(animal.nome?.en ?? animal.name?.en ?? animal.nome ?? animal.name);
  if (!name) return null;
  const forms=arr(animal.formas ?? animal.forms).filter(isObject).map((f,i)=>normalizeForm(f,i,animal));
  if (!forms.length) forms.push(normalizeForm({nome:'Basic',stats:animal.stats,elementos:animal.elementos,papeis:animal.papeis,imagem:animal.imagem,skills:animal.skills,traits:animal.traits,locais:animal.locais},0,animal));
  // Prefer Basic over implicit first form, since variants often differ in elements or roles.
  const basic=forms.find(f=>/^basic$/i.test(f.name)) ?? forms[0];
  return {
    id:string(animal.id ?? animal.numero ?? index+1), slug:string(animal.slug), name,
    portuguese:string(animal.nome?.pt), description:string(animal.desc?.en ?? animal.descricao?.en ?? animal.desc ?? animal.description).slice(0,1000),
    elements:basic.elements, roles:basic.roles, forms, image:basic.image || forms.find(f=>f.image)?.image || '',
    evolution:names(animal.evoluiPara ?? animal.evolutions ?? animal.evolui_para),
    lastChanged:date(animal.coletadoEm ?? animal.updatedAt), provider:'Aniimo Tools / official wiki-derived'
  };
}
export function normalizePublicCatalog(raw) {
  const list = Array.isArray(raw) ? raw : arr(raw?.aniimos ?? raw?.data?.aniimos ?? raw?.data ?? raw?.items ?? raw?.results);
  if (!Array.isArray(list)) return [];
  const unique=new Map();
  for(const [i,item] of list.entries()) {
    const record=normalizeAnimal(item,i);
    if(record && record.forms.length && !unique.has(record.name.toLowerCase())) unique.set(record.name.toLowerCase(),record);
  }
  return [...unique.values()].sort((a,b)=>Number(a.id)-Number(b.id)||a.name.localeCompare(b.name));
}
function readCache() {
  try { const cached=JSON.parse(localStorage.getItem(CACHE_NAME));
    if(cached?.version===2 && Array.isArray(cached.items) && cached.items.length>=30) return cached; }
  catch {} return null;
}
function saveCache(items) {
  try { localStorage.setItem(CACHE_NAME,JSON.stringify({version:2,time:Date.now(),items})); } catch {} // Quota/privacy mode: runtime still works
}
export async function loadPublicCatalog({refresh=false,timeout=15000}={}) {
  const cached=readCache();
  if(!refresh && cached && Date.now()-cached.time<CACHE_TTL_MS) return {items:cached.items,mode:'cached',cachedAt:cached.time};
  // A previously installed PWA should open immediately while truly offline.
  if(typeof navigator!=='undefined' && navigator.onLine===false){
    return cached?{items:cached.items,mode:'offline',cachedAt:cached.time}:{items:[],mode:'unavailable',error:'Offline'};
  }
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),timeout);
  try {
    const response=await fetch(ANIIMO_PUBLIC_API,{mode:'cors',cache:'no-cache',signal:abort.signal,credentials:'omit',headers:{Accept:'application/json'}});
    if(!response.ok) throw Error(`HTTP ${response.status}`);
    const text=await response.text();
    if(text.length>12_000_000) throw Error('Catalog exceeds safe size');
    const items=normalizePublicCatalog(JSON.parse(text));
    if(items.length<30) throw Error('Unexpected catalog format or insufficient records');
    saveCache(items);
    return {items,mode:'live',cachedAt:Date.now()};
  } catch(error) {
    if(cached) return {items:cached.items,mode:'offline',cachedAt:cached.time,error:String(error.message)};
    return {items:[],mode:'unavailable',error:String(error.message)};
  } finally { clearTimeout(timer); }
}
export function applyPublicCatalog(items,aniimo) {
  let added=0,matched=0;
  const byName=new Map(aniimo.map(a=>[a.name.toLowerCase(),a]));
  for(const record of items) {
    let item=byName.get(record.name.toLowerCase());
    const basic=record.forms.find(f=>/^basic$/i.test(f.name))??record.forms[0];
    if(!item){item={id:record.slug||record.name.toLowerCase().replace(/\s+/g,'-'),name:record.name,monogram:record.name.slice(0,2).toUpperCase(),index:Number(record.id)||aniimo.length+1,element:basic.elements[0]||'Lightning',role:basic.roles[0]||'Support'};aniimo.push(item);byName.set(record.name.toLowerCase(),item);added++;}
    else matched++;
    item.official=record;
    item.image=record.image;
    if(basic.elements.length) item.element=basic.elements[0];
    if(basic.roles.length) item.role=basic.roles[0];
  }
  aniimo.sort((a,b)=>(Number(a.official?.id)||a.index||99999)-(Number(b.official?.id)||b.index||99999)||a.name.localeCompare(b.name));
  return {added,matched};
}
