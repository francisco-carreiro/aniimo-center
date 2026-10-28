/** Pure boss-companion model. No network, DOM, or local storage dependencies. */
import {multiplier,resolveForm,bestRole,offenseElements} from './wildbook-core.js';

const cleanStatus=value=>['not-started','attempted','cleared'].includes(value)?value:'not-started';
export function normalizeBattleProgress(raw){
 const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const [key,value] of Object.entries(raw).slice(0,500)){
  if(!/^(alpha|omega|rush)-[a-z-]{2,50}$/.test(key))continue;
  const status=cleanStatus(value?.status);
  const notes=typeof value?.notes==='string'?value.notes.slice(0,350):'';
  if(status!=='not-started'||notes)out[key]={status,notes};
 }
 return out;
}
export function battleStats(encounters,progress={}){
 const all=encounters.length;
 const cleared=encounters.filter(b=>progress[b.id]?.status==='cleared').length;
 const attempted=encounters.filter(b=>progress[b.id]?.status==='attempted').length;
 return {all,cleared,attempted,remaining:all-cleared,percent:all?Math.round(cleared/all*100):0};
}
export function bossMatchups(boss){
 const {ELEMENT_ORDER}=STATIC;const types=boss?.elements||[];
 return ELEMENT_ORDER.map(element=>({element,multiplier:multiplier(element,types)})).sort((a,b)=>b.multiplier-a.multiplier||a.element.localeCompare(b.element));
}
// Importing the element order from one core module would also work, but keeping
// this immutable mapping makes the helper's UI output deterministic across snapshots.
const STATIC={ELEMENT_ORDER:['Fire','Water','Grass','Lightning','Ice','Rock','Wind','Light','Dark']};

export function counterCandidates(boss,speciesList,instances=[],{ownedOnly=false,limit=12}={}){
 const candidates=[];if(!boss)return [];
 const ownByName=new Map();
 for(const unit of instances||[]){const list=ownByName.get(unit.species)||[];list.push(unit);ownByName.set(unit.species,list)}
 for(const species of speciesList||[]){
  const owned=ownByName.get(species.name)||[];
  const documented=species.official?.forms||[];
  const forms=ownedOnly?owned.map(u=>resolveForm(species,u.form)):documented.length?documented:[resolveForm(species,'Basic')];
  for(const form of forms){
   const copies=owned.filter(u=>u.form===form.name);if(ownedOnly&&!copies.length)continue;
   const role=bestRole(form,species);
   const attacks=offenseElements(form);
   // Unknown-form elemental placeholders are never advertised as verified counters.
   const provisional=!!form.unverified&&/^basic$/i.test(form.name)&&Number.isInteger(species.index)&&species.index>0;
   const match=provisional?multiplier(species.element,boss.elements):form.unverified?1:attacks.length?Math.max(...attacks.map(element=>multiplier(element,boss.elements))):1;
   const vulnerable=(form.elements||[]).some(element=>boss.elements.some(attack=>multiplier(attack,[element])>1));
   const strongest=copies.length?Math.max(...copies.map(u=>u.level||1)):0;
   const score=Math.round((match-1)*100+(role==='DPS'?22:role==='Break'?18:role==='Heal'?12:role==='Regen'?10:7)+(copies.length?14:0)+Math.min(12,Math.floor(strongest/8))-(vulnerable?15:0)-(form.unverified?18:0));
   candidates.push({species,form,role,match,score,owned:!!copies.length,highestLevel:strongest,vulnerable,unverified:!!form.unverified,provisional,
    reasons:[provisional?'Species type only (form unverified)':form.unverified?'Form element unverified':match>1?`×${Number(match.toFixed(3))} elemental counter`:match<1?'Resisted attack':'Neutral attack',role==='Break'?'BREAK specialist':role==='Heal'?'Healing support':role==='Regen'?'Energy support':role==='DPS'?'Damage role':'Team utility',copies.length?`Owned · Lv ${strongest}`:'Not in collection',vulnerable?'Exposed to enemy element':''].filter(Boolean)});
  }
 }
 const unique=new Map();for(const c of candidates){const id=`${c.species.name}::${c.form.name}`;if(!unique.has(id)||unique.get(id).score<c.score)unique.set(id,c)}
 return [...unique.values()].sort((a,b)=>b.score-a.score||a.species.name.localeCompare(b.species.name)).slice(0,limit);
}
export function draftBossSquad(boss,speciesList,instances=[],{ownedOnly=false}={}){
 const pool=counterCandidates(boss,speciesList,instances,{ownedOnly,limit:100});
 const picks=[];const names=new Set();
 const eligible=want=>pool.filter(c=>!names.has(c.species.name)&&want(c));
 const take=want=>{const candidate=eligible(want)[0];if(candidate){picks.push(candidate);names.add(candidate.species.name)}};
 take(c=>c.role==='DPS'&&c.match>1);
 if(!picks.length)take(c=>c.role==='DPS');
 take(c=>c.role==='Break');
 take(c=>c.role==='Heal'||c.role==='Regen');
 take(c=>c.role==='Support'||c.role==='Regen'||c.role==='Heal');
 while(picks.length<4&&eligible(()=>true).length)take(()=>true);
 const warnings=[];
 if(picks.length<4)warnings.push('Fewer than four compatible entries are available.');
 if(!picks.some(c=>c.match>1))warnings.push('No documented super-effective damage option in this draft.');
 if(!picks.some(c=>c.role==='Break'))warnings.push('No dedicated BREAK role in this draft.');
 if(!picks.some(c=>c.role==='Heal'||c.role==='Regen'))warnings.push('No dedicated healing or energy support in this draft.');
 if(picks.some(c=>c.unverified))warnings.push('Some form properties are unverified while the catalog is offline.');
 return {picks,warnings,ownedOnly};
}
