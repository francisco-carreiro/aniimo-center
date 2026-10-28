/** Aniimo Wildbook: pure local collection, element and build-model utilities.
 * No account and no network dependency. Guide estimates are explicitly not DPS simulations.
 */
export const ELEMENT_ORDER=['Fire','Water','Grass','Lightning','Ice','Rock','Wind','Light','Dark'];
// AniimoVerse 2026-08-10, rows = attack / columns = defend; Rock is also called Earth.
// The community's dual-element rule multiplies the two defending multipliers.
const ROWS=[
 [.625,.625,1.6,1,1.6,.625,1,.625,1],
 [1.6,.625,.625,1,.625,1.6,1,.625,1],
 [.625,1.6,.625,1,1,1.6,1,.625,1],
 [1,1.6,1,.625,.625,.625,1.6,1,1],
 [.625,1.6,1,1.6,.625,.625,1,1,1],
 [1.6,.625,.625,1,1.6,.625,1,1,.625],
 [1,1,1.6,.625,1,1,.625,1,1.6],
 [1,1,1,.625,1,1,1.6,.625,1.6],
 [1,.625,1.6,1.6,1,1,.625,1.6,1]
];
export const TYPE_MATRIX=Object.fromEntries(ELEMENT_ORDER.map((name,i)=>[name,Object.fromEntries(ELEMENT_ORDER.map((def,j)=>[def,ROWS[i][j]]))]));
export const normElement=value=>({Earth:'Rock',Electric:'Lightning',Holy:'Light'}[value]||value);
export function multiplier(attacker,defending){
 const attack=normElement(attacker);
 if(!TYPE_MATRIX[attack])return 1;
 const defs=[...new Set((Array.isArray(defending)?defending:[defending]).map(normElement).filter(x=>TYPE_MATRIX[attack][x]!=null))].slice(0,2);
 return defs.length?defs.reduce((n,v)=>n*TYPE_MATRIX[attack][v],1):1;
}
export function matchupTable(defending){return ELEMENT_ORDER.map(element=>({element,value:multiplier(element,defending)})).sort((a,b)=>b.value-a.value||a.element.localeCompare(b.element));}
export function resolveForm(species,formId){const forms=species?.official?.forms||[];
 const exact=forms.find(f=>f.id===formId||f.name===formId);if(exact)return exact;
 // Keep the player's selected form even when the external catalog is offline.
 // Fallback properties are only a placeholder and must not be presented as verified form stats.
 const wanted=typeof formId==='string'&&formId.trim()?formId:'Basic';
 if(forms.length&&wanted==='Basic')return forms.find(f=>/^basic$/i.test(f.name))||forms[0];
 return {id:wanted==='Basic'?'basic':wanted,name:wanted,elements:wanted==='Basic'?(forms.find(f=>/^basic$/i.test(f.name))?.elements||[species?.element||'Fire']):[species?.element||'Fire'],
 roles:[species?.role||'Support'],skills:[],traits:[],stats:null,habitats:[],image:'',unverified:true};}
export function formOptions(species){const f=species?.official?.forms||[];return f.length?f:[resolveForm(species,'basic')];}
const integer=(v,min,max,fallback=min)=>{const x=Number(v);return Number.isFinite(x)?Math.max(min,Math.min(max,Math.trunc(x))):fallback};
const cleanText=(v,max=180)=>String(v??'').slice(0,max);
const stats=['HP','ATK','BREAK','P.DEF','M.DEF','REGEN'];
export function newInstance(species,form='Basic',seed={}){
 const safeSpecies=cleanText(species,100),safeForm=cleanText(form,90);
 const id=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():`unit-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
 return cleanInstance({id,species:safeSpecies,form:safeForm,owned:true,level:1,cp:0,star:0,spent:0,budget:0,potential:'Unknown',held:'',heldLevel:0,notes:'',awaken:{},...seed});
}
export function cleanInstance(x){if(!x||typeof x!=='object'||Array.isArray(x))return null;
 const species=cleanText(x.species||x.name,100).trim();if(!species)return null;
 const id=cleanText(x.id,130).trim()||`legacy-${species.toLowerCase().replace(/[^a-z0-9]/g,'-')}`;
 return {id,species,form:cleanText(x.form||'Basic',90)||'Basic',nickname:cleanText(x.nickname,65),owned:true,
 level:integer(x.level,1,100,1),cp:integer(x.cp,0,999999,0),star:integer(x.star,0,12,0),spent:integer(x.spent,0,200,0),budget:integer(x.budget,0,200,0),
 potential:cleanText(x.potential||'Unknown',50),held:cleanText(x.held,140),heldLevel:integer(x.heldLevel,0,15,0),notes:cleanText(x.notes,500),
 awaken:Object.fromEntries(stats.map(stat=>[stat,integer(x.awaken?.[stat],0,20,0)]))};}
export function normalizeInstances(entries){const result=[],ids=new Set();if(!Array.isArray(entries))return result;
 for(const entry of entries.slice(0,800)){const unit=cleanInstance(entry);if(!unit)continue;
 if(ids.has(unit.id))unit.id=`${unit.id}-${result.length+1}`;
 ids.add(unit.id);result.push(unit);
 }return result;
}
export function migrateLegacyCollection(collection){if(!collection||typeof collection!=='object'||Array.isArray(collection))return [];
 return normalizeInstances(Object.entries(collection).filter(([name,p])=>p&&typeof p==='object'&&p.owned!==false&&name).map(([species,p])=>({...p,species,id:`legacy-${species.toLowerCase().replace(/[^a-z0-9]/g,'-')}`,form:p.form||'Basic'})));
}
export function parseBackup(json){const b=typeof json==='string'?JSON.parse(json):json;
 if(!b||typeof b!=='object')throw Error('Invalid Wildbook backup');
 if(b.format==='aniimo-wildbook'&&b.version===2&&Array.isArray(b.instances))return normalizeInstances(b.instances);
 if(b.format==='aniimo-center'&&b.version===1&&b.collection&&typeof b.collection==='object')return migrateLegacyCollection(b.collection);
 throw Error('Unsupported backup. Choose a Wildbook v2 or original Center v1 JSON.');
}
export function exportBackup(instances,encounters={}){return {format:'aniimo-wildbook',version:2,exportedAt:new Date().toISOString(),instances:normalizeInstances(instances),encounters};}
export function collectionMirror(instances){const result={};for(const unit of instances){if(!result[unit.species])result[unit.species]={...unit,owned:true};}return result;}
export function bestRole(form,species){return form?.roles?.[0]||species?.role||'Support';}
export function offenseElements(form){const fromSkills=(form?.skills||[]).filter(s=>Number(s.power)>0).flatMap(s=>s.element||[]);
 const innate=form?.elements||[];return [...new Set([...innate,...fromSkills].map(normElement))].filter(x=>TYPE_MATRIX[x]);}
export function analyzeTeam(positions,target=['Fire']){
 const selected=positions.filter(p=>p&&p.species&&p.form);
 const roles=selected.map(p=>bestRole(p.form,p.species));
 const roleStatus={damage:roles.includes('DPS'),breaker:roles.includes('Break'),sustain:roles.includes('Heal')||roles.includes('Regen'),support:roles.includes('Support')};
 const attack=[...new Set(selected.flatMap(p=>offenseElements(p.form)))];
 const coverage=ELEMENT_ORDER.map(element=>({element,best:attack.length?Math.max(...attack.map(atk=>multiplier(atk,element))):0}));
 const threats=ELEMENT_ORDER.map(element=>({element,exposure:selected.reduce((sum,p)=>sum+Math.max(-2,Math.min(2,Math.log2(multiplier(element,p.form.elements||[])))),0),weak:selected.filter(p=>multiplier(element,p.form.elements||[])>1).length})).sort((a,b)=>b.exposure-a.exposure||b.weak-a.weak);
 const targetArray=(Array.isArray(target)?target:[target]).filter(Boolean);
 const bestTarget=attack.length?Math.max(...attack.map(atk=>multiplier(atk,targetArray))):0;
 const uniqueNames=new Set(selected.map(p=>p.species.name));
 const cautions=[];
 if(selected.length<4)cautions.push('Choose four companions to complete the squad.');
 if(uniqueNames.size<selected.length)cautions.push('Repeated species selected; verify whether your mode permits duplicates.');
 if(!roleStatus.damage)cautions.push('No dedicated damage dealer.');
 if(!roleStatus.breaker)cautions.push('No specialist BREAK role.');
 if(!roleStatus.support)cautions.push('No explicit support role; check whether your kit compensates.');
 if(!roleStatus.sustain)cautions.push('No dedicated heal or regeneration role.');
 if(bestTarget<1)cautions.push('Not enough documented offensive elements to evaluate this matchup.');
 return {selected,roles,roleStatus,attack,coverage,threats,bestTarget,target:targetArray,cautions};
}
const focusByRole={DPS:['Damage Amp'],Break:['BREAK'],Heal:['Enhanced healing','HP'],Regen:['REGEN'],Support:['REGEN','HP','Damage Amp']};
export function itemCandidates(role,items,curated=null,skills=[]){
 const signal=(skills||[]).map(s=>(s.name||'')+' '+(s.description||'')).join(' ').toLowerCase();
 const preferred=focusByRole[role]||['HP','REGEN'];
 return items.map(item=>{let rank=0,reasons=[];
 if(preferred.includes(item.main)){rank+=3;reasons.push(`Matches ${role} role`)}
 if(curated&&[curated.item,curated.altItem].includes(item.name)){rank+=5;reasons.push('Appears in researched build')}
 if(/crit/.test(signal)&&/crit/i.test(item.effect)){rank+=2;reasons.push('Skills mention critical hits')}
 if(/heal|restore hp/i.test(signal)&&/heal/i.test(item.focus+' '+item.effect)){rank+=2;reasons.push('Supports healing kit')}
 if(/break|stagger/i.test(signal)&&item.main==='BREAK'){rank+=1;reasons.push('Supports BREAK kit')}
 return {...item,rank,reasons};}).sort((a,b)=>b.rank-a.rank||a.name.localeCompare(b.name)).slice(0,5);
}
export function suggestSquadAdditions(roster,positions,target,ownedSpecies=[],limit=5){
 const selected=positions.filter(x=>x?.species&&x?.form);
 const current=analyzeTeam(selected,target);
 const seen=new Set(selected.map(x=>x.species.name));
 const owned=new Set(ownedSpecies);
 const want=new Set(Object.entries(current.roleStatus).filter(([,yes])=>!yes).map(([name])=>name));
 const rolesNeeded={damage:'DPS',breaker:'Break',sustain:'Heal',support:'Support'};
 if(want.has('sustain'))rolesNeeded.sustain='Regen';
 const candidates=[];
 for(const species of roster){if(!species?.name||seen.has(species.name))continue;
  for(const form of formOptions(species)){
   const role=bestRole(form,species),moveElements=offenseElements(form);
   const offense=moveElements.length?Math.max(...moveElements.map(x=>multiplier(x,target))):0;
   const defensive=multiplier(current.threats[0]?.element||'Fire',form.elements||[]);
   const missingRole=Object.entries(rolesNeeded).some(([key,r])=>want.has(key)&&(role===r||(key==='sustain'&&role==='Heal')));
   const reasons=[];let score=0;
   if(missingRole){score+=4;reasons.push('Fills a missing team role')}
   if(offense>1){score+=3+(offense>1.6?1:0);reasons.push('Hits encounter elements effectively')}
   if(defensive<1){score+=2;reasons.push('Resists a leading team threat')}
   if(owned.has(species.name)){score+=1;reasons.push('Already in your collection')}
   if(!score)continue;
   candidates.push({species,form,role,score,reasons,offense,owned:owned.has(species.name)});
  }
 }
 return candidates.sort((a,b)=>b.score-a.score||(b.owned?1:0)-(a.owned?1:0)||a.species.name.localeCompare(b.species.name)).slice(0,limit);
}
