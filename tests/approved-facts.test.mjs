import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {money} from '../domain.mjs';
import {objectsCSV} from '../research-domain.mjs';

const data=JSON.parse(readFileSync(new URL('../data/approved-qpr-facts.json',import.meta.url)));
const rows=data.data, key=r=>[r.grant,r.calendar_quarter,r.source_sha256].join('|');
test('selected facts have unique version identities and approved public sources',()=>{
 assert.equal(rows.length,29);assert.equal(new Set(rows.map(key)).size,29);
 for(const r of rows){assert.match(r.grant,/^B-\d{2}-[A-Z]{2}-\d{2}-\d{4}$/);assert.match(r.calendar_quarter,/^20\d{2}Q[1-4]$/);assert.match(r.source_sha256,/^[0-9a-f]{64}$/);assert.equal(r.report_status,'Reviewed and Approved');assert.ok(['http:','https:'].includes(new URL(r.source_url).protocol));assert.ok(r.financial_physical_pages.every(n=>Number.isInteger(n)&&n>0));assert.equal(r.source_publication_date,null);assert.match(r.record_scope,/beneficiary geography unresolved/);}
 assert.equal(rows.filter(r=>r.fact_kind==='recovered calendar quarter').length,7);
 assert.equal(rows.filter(r=>r.fact_kind==='reviewed calendar-quarter E/O').length,22);
});
test('precise cents, zero and above-one E/O are retained',()=>{
 const c=rows.find(r=>r.grant==='B-13-MS-17-0001'&&r.calendar_quarter==='2015Q2');assert.equal(c.expended_cents,'0');assert.equal(c.expenditure_over_obligation,'0');
 const n=rows.find(r=>r.grant==='B-13-MS-36-0001'&&r.calendar_quarter==='2017Q1');assert.ok(BigInt(n.expended_cents)>BigInt(n.obligated_cents));assert.ok(n.expenditure_over_obligation.startsWith('1.016'));
 assert.equal(money('194000003110'),'$1,940,000,031.10');
 const csv=objectsCSV([{cents:'-50',missing:null,source:'=x'}]);assert.match(csv,/'=x/);assert.match(csv,/"-50","","'=x"/);
});
test('Houston has no inherited horizon; Columbia PI blank stays distinct from zero',()=>{
 const h=rows.filter(r=>r.grant==='B-16-MH-48-0001');assert.ok(h.length);assert.ok(h.every(r=>r.relative_quarter===null));
 const c=rows.find(r=>r.grant==='B-16-MH-45-0001'&&r.calendar_quarter==='2017Q4');assert.equal(c.program_income_received_cumulative_cents,'0');assert.equal(c.program_income_drawn_cumulative_cents,'0');assert.equal(c.estimated_program_income_header_cents,null);assert.equal(c.estimated_program_income_header_status,'blank/unreported, not zero');
});
test('five unrecertified whole-grant allocation outcomes are unavailable',()=>{
 const q=JSON.parse(readFileSync(new URL('../data/qpr-horizons.json',import.meta.url)));
 const ids=['B-13-MS-22-0001','B-13-MS-25-0001','B-13-MS-40-0001','B-13-MS-38-0001','B-13-MS-29-0001'];
 for(const g of ids){const r=q.reports.find(x=>x.grant===g&&x.horizon===4);assert.ok(r);assert.equal(r.allocation_cents,null);assert.equal(r.expended_allocated_ratio,null);const w=q.six_measure_records.find(x=>x.grant===g&&x.scope==='whole_administering_grant');assert.equal(w.q4_allocation_cents,null);assert.equal(w.q4_expended_allocated_ratio,null);}
 assert.equal(q.coverage.whole_grant_allocation_ratios_available,0);
});
test('catalog correction preserves private-copy caveat and verified period',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../data/document-catalog.json',import.meta.url)));
 const d=catalog.documents.find(x=>x.documentId==='doc-dfc5fad95c1e36eeb022c376');assert.deepEqual(d.awardIds,['B-12-MT-01-0002']);assert.deepEqual(d.periods,['2013Q1']);assert.equal(d.publicCopyUrl,null);assert.match(d.accessReason,/not an approved financial observation/);assert.match(d.accessReason,/original was not imported/);assert.equal(d.identityReview.verifiedReportStatus,'Submitted - Await for Review');
});
test('public projection has no private paths, raw files, inferred allocations or publication dates',()=>{
 const s=JSON.stringify(data);assert.doesNotMatch(s,/\/Users\/|\/workspace\/|file:\/\//i);assert.doesNotMatch(s,/private reviewer|agent notes/i);assert.ok(rows.every(r=>!('allocation_cents' in r)));assert.ok(rows.every(r=>r.source_publication_date===null));
});
