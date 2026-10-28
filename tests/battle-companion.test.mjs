import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_BOSSES,BOSS_RUSH,ADDITIONAL_BUILDS} from '../assets/battle-data.js';
import {normalizeBattleProgress,battleStats,bossMatchups,counterCandidates,draftBossSquad} from '../assets/battle-core.js';
import {exportBackup,parseBackup,resolveForm,multiplier} from '../assets/wildbook-core.js';

test('documented encounter roster has 17 Alpha, 3 Omega and seven separate Rush fights',()=>{
 assert.equal(WORLD_BOSSES.length,20);
 assert.equal(WORLD_BOSSES.filter(b=>b.kind==='Alpha').length,17);
 assert.equal(WORLD_BOSSES.filter(b=>b.kind==='Omega').length,3);
 assert.equal(BOSS_RUSH.length,7);
 assert.equal(new Set([...WORLD_BOSSES,...BOSS_RUSH].map(b=>b.id)).size,27);
 assert.ok(WORLD_BOSSES.every(b=>b.name&&b.region&&b.elements?.length));
 assert.ok(WORLD_BOSSES.some(b=>b.id==='alpha-geoclaw'&&/ice prison/i.test(b.mechanics.join(' '))));
});

test('boss matchups cover every element and use directional dual-type calculation',()=>{
 const waterBoss=WORLD_BOSSES.find(b=>b.id==='omega-sherro');
 const ranks=bossMatchups(waterBoss);
 assert.equal(ranks.length,9);
 assert.equal(ranks[0].multiplier,1.6);
 const leafy=WORLD_BOSSES.find(b=>b.id==='alpha-leafy');
 assert.equal(multiplier('Fire',leafy.elements),multiplier('Fire',['Grass','Water']));
 assert.ok(Number.isFinite(bossMatchups(leafy)[0].multiplier));
});

test('battle progress only accepts known safe keys and bounded notes',()=>{
 const value=normalizeBattleProgress({
  'alpha-geoclaw':{status:'cleared',notes:'x'.repeat(1000)},
  'omega-tuckin':{status:'attempted',notes:'Find a breaker'},
  '<script>':{status:'cleared'},
  'rush-bouldus':{status:'wrong-state',notes:''},
 });
 assert.deepEqual(Object.keys(value).sort(),['alpha-geoclaw','omega-tuckin']);
 assert.equal(value['alpha-geoclaw'].notes.length,350);
 assert.equal(battleStats(WORLD_BOSSES,value).cleared,1);
 assert.equal(battleStats(WORLD_BOSSES,value).attempted,1);
});

test('candidate ranking uses actual form typing and collection ownership without inventing damage',()=>{
 const boss={id:'alpha-scorchhowl',elements:['Fire']};
 const species=[
  {name:'Sherro',element:'Water',role:'DPS',official:{forms:[{id:'basic',name:'Basic',elements:['Water'],roles:['DPS'],skills:[]}]}},
  {name:'Tubster',element:'Wind',role:'Break',official:{forms:[{id:'basic',name:'Basic',elements:['Wind'],roles:['Break'],skills:[]}]}},
  {name:'Lunara',element:'Light',role:'DPS',official:{forms:[{id:'basic',name:'Basic',elements:['Light'],roles:['DPS'],skills:[]}]}},
  {name:'Glacy',element:'Water',role:'Heal',official:{forms:[{id:'basic',name:'Basic',elements:['Water'],roles:['Heal'],skills:[]}]}},
 ];
 const own=[{species:'Sherro',form:'Basic',level:60},{species:'Glacy',form:'Basic',level:50}];
 const owned=counterCandidates(boss,species,own,{ownedOnly:true});
 assert.deepEqual(new Set(owned.map(x=>x.species.name)),new Set(['Sherro','Glacy']));
 assert.equal(owned.find(x=>x.species.name==='Sherro').match,1.6);
 const draft=draftBossSquad(boss,species,own,{ownedOnly:false});
 assert.equal(new Set(draft.picks.map(x=>x.species.name)).size,draft.picks.length);
 assert.equal(draft.picks.length,4);
 assert.equal(draft.picks[0].species.name,'Sherro');
});

test('form data missing offline cannot be presented as a verified counter',()=>{
 const boss={elements:['Fire']};
 const species=[{name:'Unknown',element:'Water',role:'DPS'}];
 const candidates=counterCandidates(boss,species,[],{ownedOnly:false});
 assert.equal(candidates[0].match,1);
 assert.equal(candidates[0].unverified,true);
});

test('v2 collection backup retains optional boss progress without breaking v2 import',()=>{
 const encounters={'omega-infergon':{status:'cleared',notes:'Take water'}};
 const b=exportBackup([{species:'Sherro',form:'Basic',level:60}],encounters);
 assert.equal(b.version,2);
 assert.deepEqual(b.encounters,encounters);
 assert.equal(parseBackup(JSON.stringify(b)).length,1);
});

test('additional editorial builds are distinct from prior ones and have necessary fields',()=>{
 assert.ok(Object.keys(ADDITIONAL_BUILDS).length>=15);
 for(const [species,build] of Object.entries(ADDITIONAL_BUILDS)){
  assert.ok(species.length>2);
  assert.ok(build.skills.length===2);
  assert.ok(build.item&&build.form==='Basic'&&build.stats.length);
  assert.match(build.quality,/Editorial/);
 }
});


test('curated offline species typing is shown as provisional rather than verified form data',()=>{
 const boss={elements:['Fire']};
 const species=[{name:'Sherro',index:13,element:'Water',role:'DPS'}];
 const candidate=counterCandidates(boss,species)[0];
 assert.equal(candidate.match,1.6);
 assert.equal(candidate.provisional,true);
 assert.equal(candidate.unverified,true);
});
