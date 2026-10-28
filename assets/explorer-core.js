/** Aniimo Wildbook Explorer: pure habitat indexing and local-only journal model.
 * Official habitat strings are taken from individual catalog forms. The smaller
 * offline leads are explicitly provisional; neither source supplies coordinates.
 */
export const STARTER_REGIONS = [
  {name:'Nimbus Fields',icon:'☁',subtitle:'A first page in your travel journal',leads:['Emberpup','Flameruff','Celestis','Chirpi','Skippy','Pranky','Nimbi','Turbo','Hummin','Budclaw','Sparki','Flutternym']},
  {name:'The Argent Strait',icon:'⛵',subtitle:'Coastal trail',leads:[]},
  {name:'Forest of Falling Stars',icon:'✦',subtitle:'Woodland trail',leads:[]},
  {name:'Sea of Flowers',icon:'✿',subtitle:'Bloom-filled trail',leads:['Skippy','Pranky']},
  {name:'Beast Fang Ridge',icon:'♢',subtitle:'Rocky trail',leads:['Emberpup','Flameruff','Scorchhowl','Chirpi','Budclaw','Sparki','Flamerion','Bonesky','Fenrier','Glynsera']},
  {name:'The Mistwoods',icon:'❋',subtitle:'Misty woodland trail',leads:[]},
  {name:'Blitzwood',icon:'ϟ',subtitle:'Stormy woodland trail',leads:['Chirpi','Hummin','Sparki','Flutternym','Bolty','Blazen','Squarrel','Squashel']},
  {name:'Echoback Landing',icon:'◈',subtitle:'Waterside trail',leads:['Emberpup','Flameruff','Celestis','Susuta','Popota','Panpanta','Shelly','Sheldon']},
  {name:'Berylline Causeway',icon:'⬡',subtitle:'Highland trail',leads:['Budclaw','Shrubclaw','Wisptis','Ignitis','Baleetle','Waleetle','Bouldus']},
  {name:'Driftwise Meadow',icon:'❄',subtitle:'Meadow trail',leads:['Bonesky','Fenrier','Fentuft','Fenmane']},
  {name:'Rosetower Woods',icon:'❀',subtitle:'Rosewood trail',leads:[]},
  {name:'Russet Highlands',icon:'♧',subtitle:'Highland trail',leads:[]},
  {name:'Zephyrus Landbridge',icon:'↝',subtitle:'Windward trail',leads:[]},
  {name:'Tideblossom Coast',icon:'≈',subtitle:'Seaside trail',leads:[]},
];
const normalizeText = value => String(value??'').trim().slice(0,180);
export const regionId = name => normalizeText(name).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/^(the)\s+/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
const regionAliases = {'mistwoods':'mistwoods','berylline-vale':'berylline-causeway'};
export const canonicalRegionId = name => regionAliases[regionId(name)] || regionId(name);
export const discoveryKey = (species,form='Basic') => `${regionId(species)}::${regionId(form||'Basic')}`;
const knownStatus = ['seen','caught'];
function safeObject(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function safeKey(k){return typeof k==='string' && /^[a-z0-9-]{1,100}(::[a-z0-9-]{1,100})?$/.test(k)}
export function normalizeExplorerProgress(raw){
 const data=safeObject(raw),visited={},discoveries={},wishlist=[];
 for(const [id,record] of Object.entries(safeObject(data.visited)).slice(0,200)){
  if(!safeKey(id)||id.includes('::'))continue;
  const item=safeObject(record);
  if(item.visited||typeof item.notes==='string')visited[id]={visited:!!item.visited,notes:String(item.notes??'').slice(0,350)};
 }
 for(const [id,status] of Object.entries(safeObject(data.discoveries)).slice(0,1200)){
  if(safeKey(id)&&id.includes('::')&&knownStatus.includes(status))discoveries[id]=status;
 }
 if(Array.isArray(data.wishlist))for(const id of data.wishlist.slice(0,300)){
  if(safeKey(id)&&id.includes('::')&&!wishlist.includes(id))wishlist.push(id);
 }
 return {version:1,visited,discoveries,wishlist};
}
/** Build a directory using the exact form habitat data when present.  The starter
 * entries are used only for regions with no live documented matches. */
export function buildHabitatIndex(catalogItems=[],starters=STARTER_REGIONS,speciesIndex=[]){
 const regions=new Map();
 const register=(name,starter)=>{
  const id=canonicalRegionId(name);
  if(!id)return null;
  if(!regions.has(id))regions.set(id,{id,name:starter?.name||normalizeText(name),icon:starter?.icon||'✿',subtitle:starter?.subtitle||'New surroundings to explore',leads:[],source:'unlisted'});
  return regions.get(id);
 };
 for(const starter of starters)register(starter.name,starter);
 const seenKeys=new Set();
 for(const animal of Array.isArray(catalogItems)?catalogItems:[]){
  const species=normalizeText(animal?.name);
  if(!species||!Array.isArray(animal.forms))continue;
  for(const form of animal.forms){
   const name=normalizeText(form?.name||'Basic');
   for(const habitat of Array.isArray(form?.habitats)?form.habitats:[]){
    const region=register(habitat);if(!region)continue;
    const key=discoveryKey(species,name),rkey=region.id+'|'+key;
    if(seenKeys.has(rkey))continue;seenKeys.add(rkey);
    region.leads.push({key,species,form:name,elements:(form.elements||[]).slice(0,2),image:form.image||animal.image||'',source:'catalog'});
    region.source='catalog';
   }
  }
 }
 const byName=new Map((Array.isArray(speciesIndex)?speciesIndex:[]).map(x=>[String(x.name||'').toLowerCase(),x]));
 for(const starter of starters){
  const region=register(starter.name,starter);if(!region||region.leads.length)continue;
  for(const species of starter.leads||[]){
   const unit=byName.get(species.toLowerCase());
   const label=unit?.name||species;
   const key=discoveryKey(label,'Basic');
   if(region.leads.some(x=>x.key===key))continue;
   region.leads.push({key,species:label,form:'Basic',elements:[unit?.element].filter(Boolean),image:unit?.image||'',source:'starter'});
   region.source='starter';
  }
 }
 return [...regions.values()].map(region=>({...region,leads:region.leads.sort((a,b)=>a.species.localeCompare(b.species)||a.form.localeCompare(b.form))}))
   .sort((a,b)=>{
    const ai=starters.findIndex(x=>canonicalRegionId(x.name)===a.id),bi=starters.findIndex(x=>canonicalRegionId(x.name)===b.id);
    return (ai<0?1000:ai)-(bi<0?1000:bi)||a.name.localeCompare(b.name);
   });
}
export function regionStats(region,progress,ownedInstances=[]){
 const p=normalizeExplorerProgress(progress),leads=region?.leads||[];
 const speciesCount=new Set(leads.map(x=>x.species)).size;
 const caught=leads.filter(x=>p.discoveries[x.key]==='caught'||ownedInstances.some(u=>discoveryKey(u.species,u.form)===x.key)).length;
 const seen=leads.filter(x=>p.discoveries[x.key]||ownedInstances.some(u=>discoveryKey(u.species,u.form)===x.key)).length;
 const planned=leads.filter(x=>p.wishlist.includes(x.key)).length;
 return {total:leads.length,species:speciesCount,caught,seen,planned,percent:leads.length?Math.round(caught/leads.length*100):0,visited:!!p.visited[region?.id]?.visited};
}
export function planExpedition(regions,progress,ownedInstances=[],limit=5){
 const p=normalizeExplorerProgress(progress),results=[];
 for(const region of regions){
  const pending=(region.leads||[]).filter(x=>p.wishlist.includes(x.key)&&p.discoveries[x.key]!=='caught'&&!ownedInstances.some(u=>discoveryKey(u.species,u.form)===x.key));
  if(pending.length)results.push({id:region.id,name:region.name,icon:region.icon,pending,visited:!!p.visited[region.id]?.visited});
 }
 return results.sort((a,b)=>b.pending.length-a.pending.length||a.name.localeCompare(b.name)).slice(0,limit);
}
