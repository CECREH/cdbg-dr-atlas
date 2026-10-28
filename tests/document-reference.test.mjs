import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogReferenceUrl,catalogReferenceMarkup} from '../document-reference.mjs';
test('source-record catalog search strips page fragment without changing source resource',()=>{
 const url='https://example.gov/report.pdf?version=1#page=27';
 assert.equal(new URL('https://atlas.test/'+catalogReferenceUrl(url)).searchParams.get('q'),'https://example.gov/report.pdf?version=1');
});
test('invalid source schemes and credentials fail closed',()=>{
 for(const url of [null,'javascript:alert(1)','data:text/html,x','file:///tmp/file','https://u:p@example.gov/a'])assert.equal(catalogReferenceMarkup(url),'');
});
test('catalog markup is encoded rather than interpolating source HTML',()=>{
 const markup=catalogReferenceMarkup('https://example.gov/report.pdf?q=%22%3E%3Cscript%3E');
 assert(!markup.includes('<script>'));assert(markup.includes('saved-copy status'));
});
