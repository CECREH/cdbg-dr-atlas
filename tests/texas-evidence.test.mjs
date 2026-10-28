import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cents,percent,selectRows,csvText,activityColumns,placeColumns} from '../texas-evidence-domain.mjs';
const data=JSON.parse(await readFile(new URL('../data/texas-evidence-v55.json',import.meta.url),'utf8'));
test('source grains, missing beneficiary values, and signed corrections are preserved',()=>{
  assert.equal(data.activities.length,406);assert.equal(data.place_references.length,84);assert.equal(data.whole_awards.length,8);
  const keys=new Set(data.activities.map(r=>[r.reporting_group,r.quarter,r.project,r.activity].join('|')));assert.equal(keys.size,406);
  assert.equal(data.activities.filter(r=>r.reporting_group==='P-17-TX-48-HIM1').length,319);
  assert.ok(data.activities.filter(r=>r.reporting_group==='P-17-TX-48-HIM1').every(r=>r.original_award===null));
  assert.ok(data.activities.every(r=>r.beneficiary_geography===null && r.beneficiary_allocation_cents===null));
  assert.ok(data.place_references.every(r=>r.beneficiary_boundary_verified===false && r.beneficiary_allocation_cents===null));
  assert.equal(data.place_references.filter(r=>!r.census_geoid).length,4);
  assert.equal(data.activities.filter(r=>BigInt(r.expended_period_cents)<0n).length,7);
});
test('award outcomes use reported values and leave conflicting or unavailable cases blank',()=>{
  for (const r of data.whole_awards) {
    for (const [name,den] of [['expended_obligated_ratio','obligated_cents'],['expended_reported_award_ratio','reported_award_cents']]) {
      if(r[name]!==null) {assert.ok(BigInt(r[den])>0n);assert.ok(Math.abs(Number(r[name])-Number(r.expended_cents)/Number(r[den]))<1e-14);}
    }
  }
  const b=data.whole_awards.find(r=>r.grant==='B-17-DM-48-0001'&&r.horizon===20);
  assert.equal(b.expended_cents,'354063340293');assert.equal(b.reported_award_cents,null);assert.equal(b.expended_reported_award_ratio,null);
  const unclear=data.whole_awards.filter(r=>r.grant==='B-16-DH-48-0001'||r.grant==='B-17-DL-48-0002');assert.ok(unclear.every(r=>r.horizon===null));
  assert.equal(unclear.find(r=>r.grant==='B-16-DH-48-0001').expended_obligated_ratio,null);
  assert.ok(data.whole_awards.filter(r=>r.status.startsWith('Submitted')).every(r=>r.expended_cents===null&&r.expended_obligated_ratio===null));
});
test('filter, zero results and sorting include exactly the intended source rows',()=>{
  const f={query:'Galveston',group:'P-17-TX-48-HIM1',quarter:'2023Q2'};
  const a=selectRows(data.activities,f), p=selectRows(data.place_references,f);
  assert.ok(a.length>0);assert.ok(p.length>0);assert.ok(a.every(r=>r.reporting_group===f.group && r.quarter===f.quarter));
  assert.equal(selectRows(data.activities,{query:'no-place-should-match-this-string'}).length,0);
  assert.equal(selectRows(data.activities,{group:'B-17-DL-48-0002'}).length,13);
  assert.equal(selectRows(data.activities,{group:'B-16-DL-48-0001',quarter:'2018Q3'}).length,10);
  assert.equal(selectRows(data.activities,{sort:'quarter'}).length,406);
});
test('currency formatting and CSV preserve missing, negative and protect text formulas',()=>{
  assert.equal(cents('354063340293'),'$3,540,633,402.93');assert.equal(cents('-24040'),'−$240.40');assert.equal(cents(null),'Unavailable');assert.equal(percent(null),'Unavailable');
  const csv=csvText([{activity:'=1+1',expended_period_cents:'-24040',beneficiary_geography:null}],['activity','expended_period_cents','beneficiary_geography']);
  assert.match(csv,/"'=1\+1","-24040",/);assert.equal(csv[0],'\ufeff');
  assert.equal(activityColumns.length,Object.keys(data.activities[0]).length);assert.equal(placeColumns.length,Object.keys(data.place_references[0]).length);
});
