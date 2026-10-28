import test from 'node:test';
import assert from 'node:assert/strict';
import {
 STARTER_REGIONS,canonicalRegionId,discoveryKey,normalizeExplorerProgress,
 buildHabitatIndex,regionStats,planExpedition
} from '../assets/explorer-core.js';
import {readFileSync} from 'node:fs';

test('starter directory has named regions and only clearly marked provisional leads',()=>{
 assert.equal(STARTER_REGIONS.length,14);
 const species=['Emberpup','Skippy','Pranky','Sparki','Scorchhowl'].map(name=>({name,element:'Fire'}));
 const regions=buildHabitatIndex([],STARTER_REGIONS,species);
 const nimbus=regions.find(r=>r.id==='nimbus-fields');
 assert.equal(nimbus.source,'starter');
 assert.ok(nimbus.leads.length>1);
 assert.ok(nimbus.leads.every(x=>x.source==='starter'));
 assert.equal(regions.find(r=>r.id==='russet-highlands').leads.length,0);
});

test('catalog habitats are indexed by actual form, element and region; alternate forms are not collapsed',()=>{
 const catalog=[{name:'Glacy',image:'https://example.com/glacy.png',forms:[
  {name:'Basic',id:'basic',habitats:['Sea of Flowers'],elements:['Water'],image:'',skills:[]},
  {name:'Snowfield',id:'snowfield',habitats:['Driftwise Meadow','The Mistwoods'],elements:['Water','Ice'],image:'',skills:[]}
 ]}];
 const regions=buildHabitatIndex(catalog,STARTER_REGIONS,[{name:'Glacy',element:'Water'}]);
 assert.deepEqual(regions.find(r=>r.id==='sea-of-flowers').leads.map(x=>x.key),[discoveryKey('Glacy','Basic')]);
 assert.deepEqual(regions.find(r=>r.id==='driftwise-meadow').leads.map(x=>x.key),[discoveryKey('Glacy','Snowfield')]);
 assert.equal(regions.find(r=>r.id==='mistwoods').source,'catalog');
 assert.equal(regions.find(r=>r.id==='mistwoods').leads[0].elements[1],'Ice');
 assert.equal(regions.find(r=>r.id==='sea-of-flowers').source,'catalog');
});

test('duplicate and aliased habitat names are normalized; unknown habitats are added without coordinates',()=>{
 const catalog=[{name:'Skippy',forms:[{name:'Basic',elements:['Water'],habitats:['Mistwoods','The Mistwoods','Crescent Bay','Crescent Bay']}]}];
 const regions=buildHabitatIndex(catalog,STARTER_REGIONS,[]);
 assert.equal(canonicalRegionId('The Mistwoods'),'mistwoods');
 assert.equal(regions.find(r=>r.id==='mistwoods').leads.length,1);
 assert.equal(regions.find(r=>r.id==='crescent-bay').leads.length,1);
 assert.equal(regions.filter(r=>r.id==='crescent-bay').length,1);
});

test('journal sanitizer bounds notes, limits keys, status and malicious data',()=>{
 const raw={visited:{'nimbus-fields':{visited:true,notes:'n'.repeat(700)},'__proto__':{visited:true},'<script>':{visited:true}},discoveries:{'glacy::basic':'caught','glacy::prismana':'seen','glacy::evil':'hacked'},wishlist:['glacy::basic','glacy::basic','bad key','glacy::prismana']};
 const p=normalizeExplorerProgress(raw);
 assert.equal(p.visited['nimbus-fields'].notes.length,350);
 assert.equal(p.discoveries['glacy::evil'],undefined);
 assert.deepEqual(p.wishlist,['glacy::basic','glacy::prismana']);
 assert.equal(Object.keys(p.visited).length,1);
});

test('regional totals count owned copies as caught without changing manual journal',()=>{
 const region={id:'sea-of-flowers',leads:[{key:'glacy::basic',species:'Glacy',form:'Basic'},{key:'glacy::prismana',species:'Glacy',form:'Prismana'}]};
 const p={discoveries:{'glacy::prismana':'seen'},visited:{'sea-of-flowers':{visited:true}}};
 const stats=regionStats(region,p,[{species:'Glacy',form:'Basic'}]);
 assert.deepEqual([stats.total,stats.caught,stats.seen,stats.percent,stats.visited],[2,1,2,50,true]);
 assert.equal(p.discoveries['glacy::basic'],undefined);
});

test('personal itinerary groups uncaught wishes by documented habitat, not imaginary distance',()=>{
 const regions=[
  {id:'nimbus-fields',name:'Nimbus Fields',icon:'☁',leads:[{key:'skippy::basic',species:'Skippy',form:'Basic'},{key:'pranky::basic',species:'Pranky',form:'Basic'}]},
  {id:'sea-of-flowers',name:'Sea of Flowers',icon:'✿',leads:[{key:'skippy::basic',species:'Skippy',form:'Basic'}]}
 ];
 const p={wishlist:['skippy::basic','pranky::basic'],discoveries:{}};
 assert.equal(planExpedition(regions,p,[])[0].name,'Nimbus Fields');
 const routes=planExpedition(regions,p,[{species:'Skippy',form:'Basic'}]);
 assert.equal(routes.length,1);
 assert.deepEqual(routes[0].pending.map(x=>x.species),['Pranky']);
});

test('Explorer is wired into navigation, backups, UI and portable builder',()=>{
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 const script=readFileSync(new URL('../scripts/build_standalone.py',import.meta.url),'utf8');
 assert.match(app,/\['explorer','Explorer'\]/);
 assert.match(app,/explorer:explorerPage/);
 assert.match(app,/backup\.exploration=normalizeExplorerProgress\(explorerProgress\)/);
 assert.match(app,/data-explore-note-save/);
 assert.match(app,/data-explore-wishlist/);
 assert.match(script,/explorer-core\.js/);
});
