import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initAnalysis} from '../analysis.mjs';

const json=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url)));
const text=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

test('readiness and analysis explain provisional clocks and baseline-only coverage',()=>{
 const html=text('index.html'),readme=text('README.md');
 assert.doesNotMatch(html,/corroborated for 28 national-panel awards|178 national dates/i);
 assert.match(html,/source-reported initial effective dates; these clocks are provisional/i);
 assert.match(html,/Many national award dates remain unverified or unresolved/i);
 assert.match(html,/Legacy baseline award coverage/);
 assert.match(html,/matrix and its download are baseline-only/);
 assert.match(html,/href="approved-facts\.html#facts"[^>]*>separate selected approved-facts layer/);
 assert.match(html,/Columbia B-16-MH-45-0001[^<]+baseline marks the initial clock unverified[^<]+three approved calendar-quarter E\/O observations/i);
 assert.match(html,/observations do not establish a complete panel or independently prove bilateral execution/i);
 assert.match(readme,/coverage matrix is a legacy baseline and excludes the separately qualified/i);
});

// Exercises the real module in a synthetic DOM. This is not browser or mobile QA.
test('trajectory and baseline coverage preserve missing, zero and source-layer scope',async()=>{
 const research=json('data/research.json'),qpr=json('data/qpr-horizons.json');
 const sample={...qpr.reports.find(r=>r.horizon===4),horizon:4,quarter:'2020Q1',allocation_cents:null,allocation_definition_source:null,expended_obligated_ratio:null,expended_allocated_ratio:null};
 qpr.reports.push(
  {...sample,grant:'SYNTHETIC-MISSING',grantee:'TEST MISSING',expended_cents:null,obligated_cents:null},
  {...sample,grant:'SYNTHETIC-BLANK',grantee:'TEST BLANK',expended_cents:'',obligated_cents:null},
  {...sample,grant:'SYNTHETIC-ZERO',grantee:'TEST ZERO',expended_cents:'0',obligated_cents:'0'},
  {...sample,grant:'SYNTHETIC-LARGE',grantee:'TEST LARGE',expended_cents:'9007199254740993',obligated_cents:'1'}
 );
 class Element{constructor(){this.value='';this.textContent='';this.innerHTML='';this.handlers={};}addEventListener(k,f){this.handlers[k]=f;}trigger(k){this.handlers[k]?.({target:this});}}
 const ids=['analysis-summary','analysis-limitations','trajectory-grant','trajectory-rows','trajectory-chart','trajectory-note','coverage-search','coverage-count','coverage-rows','category-coverage','coverage-export','trajectory-export','archive-method','semantic-method','archive-search','archive-count','archive-rows','archive-export'];
 const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));
 let blob,downloadName;const original={document:globalThis.document,create:URL.createObjectURL,revoke:URL.revokeObjectURL,timeout:globalThis.setTimeout};
 globalThis.document={getElementById:id=>elements[id],createElement:()=>({click(){downloadName=this.download;}})};
 URL.createObjectURL=b=>{blob=b;return 'blob:test';};URL.revokeObjectURL=()=>{};globalThis.setTimeout=f=>{f();return 0;};
 try{
  await initAnalysis(async name=>json(name),research,qpr);
  function select(grant){elements['trajectory-grant'].value=grant;elements['trajectory-grant'].trigger('change');return elements['trajectory-chart'].innerHTML;}
  let chart=select('B-16-MH-48-0001');assert.match(chart,/No numeric observations/);assert.doesNotMatch(chart,/\$0\.01|Largest observed value/);assert.match(elements['trajectory-rows'].innerHTML,/No validated matching report/);
  chart=select('SYNTHETIC-MISSING');assert.match(chart,/No numeric observations/);assert.doesNotMatch(chart,/<rect|\$0\.01/);assert.match(elements['trajectory-rows'].innerHTML,/Unavailable/);
  chart=select('SYNTHETIC-BLANK');assert.match(chart,/No numeric observations/);assert.doesNotMatch(chart,/<rect|\$0\.01/);assert.doesNotMatch(elements['trajectory-rows'].innerHTML,/\$0\.00/);assert.match(elements['trajectory-rows'].innerHTML,/Unavailable/);
  chart=select('SYNTHETIC-ZERO');assert.match(chart,/Largest observed value: \$0\.00/);assert.match(chart,/Expended Q4: \$0\.00/);assert.doesNotMatch(chart,/No numeric observations|\$0\.01/);
  chart=select('SYNTHETIC-LARGE');assert.match(chart,/Largest observed value: \$90,071,992,547,409\.93/);
  elements['coverage-search'].value='B-16-MH-45-0001';elements['coverage-search'].trigger('input');
  assert.match(elements['coverage-count'].textContent,/^Legacy baseline only: 1 awards · 3 award-horizon cells/);
  assert.equal((elements['coverage-rows'].innerHTML.match(/initial execution date unverified/g)||[]).length,3);
  elements['coverage-export'].trigger('click');const csv=await blob.text();assert.equal(downloadName,'baseline-coverage-filtered.csv');assert.equal((csv.match(/B-16-MH-45-0001/g)||[]).length,3);
  const facts=json('data/approved-qpr-facts.json').data.filter(r=>r.grant==='B-16-MH-45-0001');
  assert.deepEqual(facts.map(r=>[r.calendar_quarter,r.relative_quarter]).sort(),[['2017Q4',4],['2019Q4',12],['2021Q4',20]]);
  assert.ok(facts.every(r=>r.report_status==='Reviewed and Approved'));
 }finally{globalThis.document=original.document;URL.createObjectURL=original.create;URL.revokeObjectURL=original.revoke;globalThis.setTimeout=original.timeout;}
});
