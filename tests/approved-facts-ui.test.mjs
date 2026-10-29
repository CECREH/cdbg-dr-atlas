import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Synthetic DOM only: this does not replace actual browser or mobile QA.
test('selected-facts controls and download data work in a synthetic DOM',async()=>{
 const data=JSON.parse(readFileSync(new URL('../data/approved-qpr-facts.json',import.meta.url)));
 class Element {constructor(){this.value='';this.textContent='';this.innerHTML='';this.hidden=false;this.disabled=false;this.handlers={};}addEventListener(k,f){this.handlers[k]=f;}trigger(k){this.handlers[k]?.({target:this});}}
 const ids=['facts-search','facts-kind','facts-sort','facts-count','facts-rows','facts-page','facts-prev','facts-next','facts-export','facts-all','facts-reset','facts-error'];
 const elements=Object.fromEntries(ids.map(k=>[k,new Element()]));elements['facts-sort'].value='quarter-desc';
 let blob=null;const original={document:globalThis.document,fetch:globalThis.fetch,create:URL.createObjectURL,revoke:URL.revokeObjectURL,timeout:globalThis.setTimeout};
 globalThis.document={getElementById:id=>elements[id],createElement:()=>({click(){}})};
 globalThis.fetch=async()=>({ok:true,json:async()=>data});URL.createObjectURL=b=>{blob=b;return 'blob:test';};URL.revokeObjectURL=()=>{};globalThis.setTimeout=f=>{f();return 0;};
 try{
  await import('../approved-facts.mjs?synthetic-dom');
  assert.match(elements['facts-count'].textContent,/29 approved source facts/);assert.equal(elements['facts-all'].disabled,false);
  assert.match(elements['facts-page'].textContent,/1–20 of 29/);elements['facts-next'].trigger('click');assert.match(elements['facts-page'].textContent,/21–29 of 29/);elements['facts-prev'].trigger('click');assert.match(elements['facts-page'].textContent,/1–20 of 29/);
  elements['facts-search'].value='Columbia';elements['facts-search'].trigger('input');assert.match(elements['facts-count'].textContent,/3 approved source facts/);
  elements['facts-search'].value='2019Q4';elements['facts-search'].trigger('input');assert.match(elements['facts-count'].textContent,/1 approved source fact/);assert.match(elements['facts-rows'].innerHTML,/7,727,877\.88/);assert.match(elements['facts-rows'].innerHTML,/0\.399791/);assert.match(elements['facts-rows'].innerHTML,/rounded to 6 decimals/);
  elements['facts-export'].trigger('click');let csv=await blob.text();assert.match(csv,/B-16-MH-45-0001/);assert.match(csv,/772787788/);assert.match(csv,/0\.39979061773644680370161884132039973692451137525231/);assert.doesNotMatch(csv,/B-13-MS-38-0001/);
  elements['facts-all'].trigger('click');csv=await blob.text();assert.match(csv,/B-13-MS-38-0001/);assert.equal(csv.trim().split(/\r?\n/).length,30);
  elements['facts-search'].value='no such jurisdiction';elements['facts-search'].trigger('input');assert.match(elements['facts-rows'].innerHTML,/No source facts match/);assert.equal(elements['facts-export'].disabled,true);
  elements['facts-reset'].trigger('click');assert.match(elements['facts-count'].textContent,/29 approved source facts/);
  elements['facts-kind'].value='recovered calendar quarter';elements['facts-kind'].trigger('change');assert.match(elements['facts-count'].textContent,/7 approved source facts/);
 }finally{globalThis.document=original.document;globalThis.fetch=original.fetch;URL.createObjectURL=original.create;URL.revokeObjectURL=original.revoke;globalThis.setTimeout=original.timeout;}
});
