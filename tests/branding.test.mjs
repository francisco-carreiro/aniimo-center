import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('Wildbook renders without visitor-facing technical data labels', () => {
  assert.match(app, /aniimo<span>wildbook<\/span>/);
  assert.match(index, /Aniimo Wildbook/);
  for (const label of ['API provenance', 'PUBLIC ANIIDEX DATASET', 'API UNAVAILABLE', 'Aniimo Tools public API', 'SOURCE REGISTRY']) {
    assert.equal(app.includes(label), false, `Unexpected visitor label: ${label}`);
  }
});

test('legacy collection and backup keys are preserved', () => {
  assert.match(app, /STORAGE='aniimo-center:v1'/);
  assert.match(app, /parseBackup/);
  assert.match(app, /STORAGE_V2='aniimo-wildbook:v2'/);
  assert.match(app, /function importBackup/);
});

test('all major views remain available after removing research page', () => {
  for (const name of ['overview','teams','aniidex','items','progression','planner','collection','workshop','matchups']) {
    assert.ok(app.includes(`'${name}'`) || app.includes(`${name}:`), `Missing ${name}`);
  }
  assert.equal(app.includes('sourceLinks('), false);
});
