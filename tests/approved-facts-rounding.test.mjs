import test from 'node:test';
import assert from 'node:assert/strict';
import {formatRatio} from '../approved-facts-domain.mjs';

test('ratio display rounds exact decimal strings to six places, ties away from zero',()=>{
 const cases=[
  ['0.39979061773644680370161884132039973692451137525231','0.399791'],
  ['1.0160908873334409751160500777479145911154121062602','1.016091'],
  ['0.123456499999999999999999','0.123456'],
  ['0.123456500000000000000000','0.123457'],
  ['-0.123456499999999999999999','-0.123456'],
  ['-0.123456500000000000000000','-0.123457'],
  ['0.00000049','0.000000'],['0.00000050','0.000001'],
  ['-0.00000049','-0.000000'],['-0.00000050','-0.000001'],
  ['9.9999995','10.000000'],
  ['999999999999999999999.9999995','1000000000000000000000.000000'],
  ['0','0.000000'],['1','1.000000'],[0,'0.000000'],[-2,'-2.000000']
 ];
 for(const [input,expected] of cases)assert.equal(formatRatio(input),expected,String(input));
});

test('missing or inexact numeric inputs are not converted to observations',()=>{
 for(const input of [null,undefined,'','not a decimal','1e-7',0.1,Number.MAX_SAFE_INTEGER+1])assert.equal(formatRatio(input),'Unavailable',String(input));
});
