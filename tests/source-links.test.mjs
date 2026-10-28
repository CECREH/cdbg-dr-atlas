import test from 'node:test';
import assert from 'node:assert/strict';
import {financialSourceDetails,financialSourceMarkup,ATLAS_SOURCE_COMMIT} from '../source-links.mjs';
test('national uses exact pinned release and distinct original record and JSON pointer',()=>{
 const s=financialSourceDetails('national',68623,1234,'B-19-UV-15-0002');
 assert.equal(s.releasedRecordPointer,'/rows/1234');assert.equal(s.sourceCsvRecord,68623);
 assert.equal(s.releasedFileUrl,`https://github.com/CECREH/cdbg-dr-atlas/blob/${ATLAS_SOURCE_COMMIT}/data/finance-national.json`);
 assert.match(s.originalAvailability,/not the raw input/);assert.match(s.comparatorExactRowStatus,/not yet verified/);
 assert.equal(s.catalogUrl,'documents.html?q=B-19-UV-15-0002');
});
test('no fabricated chunk mapping at 20k boundaries or last row',()=>{
 for(const n of [1,19999,20000,20001,128382,130605]){
  const s=financialSourceDetails('national',n,n-1,'');
  assert.equal(s.releasedRecordPointer,`/rows/${n-1}`);assert.equal(s.comparatorChunk,undefined);
 }
});
test('Texas does not present GLO corroboration as the source workbook',()=>{
 const s=financialSourceDetails('texas',22,0,'B-17-DM-48-0001');
 assert.equal(s.comparatorMetadataUrl,null);assert.match(s.originalAvailability,/independent corroboration/);
 assert.match(s.releasedFileUrl,/finance-texas.json$/);
});
test('invalid positions remain unavailable and unknown snapshots fail closed',()=>{
 for(const n of [null,-1,NaN,Infinity,1.5,'10']){
  const s=financialSourceDetails('national',n,n,'');assert.equal(s.sourceCsvRecord,null);assert.equal(s.releasedRecordPointer,null);
 }
 assert.equal(financialSourceDetails('national',0,0).sourceCsvRecord,null);
 assert.throws(()=>financialSourceDetails('../private',1,0));
});
test('grant search is encoded, markup escapes evidence and never exposes activity identifiers',()=>{
 const s=financialSourceDetails('national',1,0,'"><script>alert(1)</script>&');
 assert.ok(s.catalogUrl.includes('%3Cscript%3E'));assert.ok(!financialSourceMarkup(s).includes('<script>'));
 s.originalAvailability='<img onerror="alert(1)">';assert.ok(financialSourceMarkup(s).includes('&lt;img'));
 assert.ok(!Object.keys(s).some(k=>/activity/i.test(k)));
});
