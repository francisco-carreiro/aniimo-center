import test from 'node:test';
import assert from 'node:assert/strict';
import {multiplier,matchupTable,newInstance,normalizeInstances,migrateLegacyCollection,parseBackup,exportBackup,collectionMirror,analyzeTeam,itemCandidates,resolveForm,suggestSquadAdditions} from '../assets/wildbook-core.js';

test('all nine elements and dual multipliers are directional',()=>{
 assert.equal(multiplier('Fire',['Grass']),1.6);
 assert.equal(multiplier('Grass',['Fire']),.625);
 assert.ok(Math.abs(multiplier('Wind', ['Dark', 'Grass'])-2.56)<1e-9);
 assert.equal(multiplier('Fire',['Water','Ice']),1);
 assert.equal(multiplier('Dark',['Dark']),1);
 assert.equal(matchupTable(['Water','Ice']).length,9);
});

test('distinct form copies retain unique IDs and independent equipment',()=>{
 const first=newInstance('Glacy','Basic',{id:'unit-a',held:'Ferocious Fang',level:60});
 const second=newInstance('Glacy','Prismana',{id:'unit-b',held:'Spirited Feather',level:40});
 const copies=normalizeInstances([first,second]);
 assert.equal(copies.length,2);
 assert.notEqual(copies[0].held,copies[1].held);
 assert.equal(collectionMirror(copies).Glacy.level,60);
});

test('original v1 collection migrates and v2 backups round-trip',()=>{
 const source={Glacy:{owned:true,form:'Prismana',level:61,held:'Ferocious Fang',cp:3321,awaken:{ATK:20}},Fulmintis:{owned:true,level:30}};
 const migrated=migrateLegacyCollection(source);
 assert.equal(migrated.length,2);
 assert.equal(migrated[0].form,'Prismana');
 assert.equal(migrated[0].awaken.ATK,20);
 const restored=parseBackup(exportBackup(migrated));
 assert.equal(restored[0].cp,3321);
 const legacy=parseBackup({format:'aniimo-center',version:1,collection:source});
 assert.equal(legacy[0].level,61);
});

test('untrusted backups are sanitized and are size limited',()=>{
 const input=[{id:'x',species:'Glacy',form:'Basic',notes:'z'.repeat(900),awaken:{ATK:100},level:500},
 {id:'x',species:'Scorchhowl',form:'Prismana'}];
 const result=normalizeInstances(input);
 assert.notEqual(result[0].id,result[1].id);
 assert.equal(result[0].level,100);
 assert.equal(result[0].awaken.ATK,20);
 assert.equal(result[0].notes.length,500);
 assert.throws(()=>parseBackup({format:'unknown'}));
});

test('team evaluation respects actual form typing and flags role gaps',()=>{
 const glacy={name:'Glacy',element:'Water',role:'Heal'};
 const basic={id:'basic',name:'Basic',elements:['Water','Ice'],roles:['Heal'],skills:[]};
 const prism={id:'prism',name:'Prismana',elements:['Water','Light'],roles:['DPS'],skills:[]};
 const enemy=['Dark'];
 assert.equal(analyzeTeam([{species:glacy,form:basic}],enemy).bestTarget,1);
 assert.equal(analyzeTeam([{species:glacy,form:prism}],enemy).bestTarget,1.6);
 assert.ok(analyzeTeam([{species:glacy,form:basic}],enemy).cautions.some(x=>/damage/.test(x)));
 assert.equal(resolveForm({official:{forms:[basic,prism]}},'prism').name,'Prismana');
});

test('role item picks are suggestions and never invent a unique BIS',()=>{
 const list=itemCandidates('Heal',[{name:'Heal item',main:'Enhanced healing',effect:'Heal bonus',focus:'Healing'},{name:'Sword',main:'Damage Amp',effect:'Attack',focus:'DPS'}]);
 assert.equal(list[0].name,'Heal item');
 assert.ok(list[0].reasons.length);
});


test('suggested squad additions fill encounter and role gaps without pretending to predict DPS',()=>{
 const roster=[
  {name:'A',role:'Heal',element:'Water'},
  {name:'B',role:'DPS',element:'Light'},
  {name:'C',role:'Break',element:'Fire'}
 ];
 const current=[{species:roster[0],form:resolveForm(roster[0],'Basic')}];
 const picks=suggestSquadAdditions(roster,current,['Dark'],['B']);
 assert.ok(picks.some(x=>x.species.name==='B'));
 assert.equal(picks[0].reasons.length>0,true);
});

test('an offline catalog preserves a saved Prismana label without inventing stats',()=>{
 const saved=resolveForm({name:'Glacy',element:'Water',role:'Heal'},'Prismana');
 assert.equal(saved.name,'Prismana');
 assert.equal(saved.stats,null);
 assert.equal(saved.unverified,true);
});
