import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const root=new URL('../',import.meta.url);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const official='a473da1cfcdef681f28b9228d47d07ce1db7a960cf8f2e9a949f0bdd732e4d8a';
test('the versioned PNG is the unchanged official CECREH logo',async()=>{
  const original=await readFile(new URL('cecreh-logo.png',root));
  const favicon=await readFile(new URL('cecreh-favicon-red-a473da1c.png',root));
  assert.equal(digest(original),official);assert.equal(digest(favicon),official);assert.deepEqual(favicon,original);
});
test('each atlas page references the same versioned PNG and default ICO',async()=>{
  for(const page of ['index.html','documents.html','texas-evidence.html']){
    const html=await readFile(new URL(page,root),'utf8');
    assert.equal((html.match(/<link rel="icon" type="image\/png" href="cecreh-favicon-red-a473da1c\.png">/g)||[]).length,1,page);
    assert.equal((html.match(/<link rel="shortcut icon" type="image\/x-icon" href="favicon\.ico\?v=20261029">/g)||[]).length,1,page);
    assert.ok(!/rel=["'](?:shortcut )?icon["'][^>]*href=["']cecreh-logo\.png/i.test(html),page);
  }
});
test('default favicon is a standard square ICO containing a PNG',async()=>{
  const ico=await readFile(new URL('favicon.ico',root));
  assert.equal(ico.readUInt16LE(0),0);assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),1);
  assert.equal(ico[6],0);assert.equal(ico[7],0); // ICO encodes 256 as 0.
  const size=ico.readUInt32LE(14),offset=ico.readUInt32LE(18);
  assert.ok(size>0&&offset+size<=ico.length);
  assert.deepEqual(ico.subarray(offset,offset+8),Buffer.from([137,80,78,71,13,10,26,10]));
  assert.equal(ico.readUInt32BE(offset+16),256);assert.equal(ico.readUInt32BE(offset+20),256);
});
