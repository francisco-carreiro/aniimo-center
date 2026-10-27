import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePublicCatalog, applyPublicCatalog } from '../assets/live-data.js';

test('normalizes wiki-derived species, Prismana form and element aliases',()=>{
  const raw={aniimos:[{id:'003',slug:'scorchhowl',nome:{en:'Scorchhowl',pt:'Lobocalor'},desc:{en:'Fire creature'},evoluiPara:['inferlupa'],formas:[
    {chave:'basic',nome:{en:'Basic Form'},estagio:3,elementos:['fire'],papeis:['dps'],stats:{hp:100,atk:120,brk:50,pdef:70,mdef:70,regen:80},skills:[{nome:{en:'Ignite'},custo:20,poder:70}],traits:[{nome:{en:'Flame'},desc:{en:'Burns'}}],imagem:'https://cdn.example.com/basic.png',locais:['Fang Ridge']},
    {chave:'prismana',nome:{en:'Prismana Form'},elementos:['fire','holy'],papeis:['dps'],stats:{hp:125,atk:145,brk:55,pdef:70,mdef:70,regen:80},skills:[{nome:{en:'Aurora Fire'}}],imagem:'javascript:alert(1)'}
  ]}]};
  const all=normalizePublicCatalog(raw);
  assert.equal(all.length,1);
  const [a]=all;
  assert.equal(a.name,'Scorchhowl');
  assert.equal(a.forms.length,2);
  assert.deepEqual(a.forms[1].elements,['Fire','Light']);
  assert.equal(a.forms[0].stats.total,490);
  assert.equal(a.forms[0].skills[0].name,'Ignite');
  assert.equal(a.forms[1].image,'');
  const base=[{id:'scorchhowl',name:'Scorchhowl',monogram:'SC',element:'Fire',role:'DPS',index:1}];
  const changes=applyPublicCatalog(all,base);
  assert.equal(changes.matched,1);assert.equal(changes.added,0);
  assert.equal(base[0].official.forms.length,2);
});

test('rejects invalid payloads and unsafe image protocols',()=>{
  assert.deepEqual(normalizePublicCatalog({data:'invalid'}),[]);
  assert.deepEqual(normalizePublicCatalog([{nome:'',formas:[]}]),[]);
});
