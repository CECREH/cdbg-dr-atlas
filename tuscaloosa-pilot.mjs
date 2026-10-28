import {catalogReferenceMarkup} from './document-reference.mjs';
import {escape as esc,money} from './domain.mjs';
import {objectsCSV} from './research-domain.mjs';
import {filterTuscaloosa} from './tuscaloosa-pilot-domain.mjs';
const $=id=>document.getElementById(id), PAGE=25;
let data=null,loading=null,selected=[],page=0;
const pct=value=>value===null||value===undefined?'Unavailable':`${(Number(value)*100).toFixed(2)}%`;
function filters(){return {q:$('ts-quarter').value,status:$('ts-status').value,search:$('ts-search').value.trim().toLowerCase()};}
function render(){
 if(!data)return;
 const f=filters();
 selected=filterTuscaloosa(data.activity_quarters,{quarter:f.q,status:f.status,query:f.search});
 const start=page*PAGE;
 $('ts-count').textContent=`${selected.length.toLocaleString('en-US')} selected activity-quarter records. QPR values are source snapshots, not a financial sum.`;
 $('ts-rows').innerHTML=selected.slice(start,start+PAGE).map(r=>`<tr><td><strong>${esc(r.project)} / ${esc(r.activity)}</strong><small>${esc(r.activity_type_as_reported||'Type unavailable')} · category ${esc(r.requested_category||'unmapped')}${r.linked_extension_indicator?' · linked extension; avoid automatic addition':''}</small></td><td>${esc(r.quarter)}<small>Award Q${esc(r.award_relative_quarter)}</small></td><td>${esc(money(r.expended_to_date_cents))}<small>Period: ${esc(money(r.expended_period_cents))}</small></td><td>${esc(money(r.obligated_to_date_cents))}<small>Period: ${esc(money(r.obligated_period_cents))}</small></td><td>${esc(r.report_status)}<small>${esc(r.expended_continuity_status)}</small></td><td><a href="${esc(r.source_url)}#page=${esc(r.financial_source_pages.expended)}" target="_blank" rel="noopener">QPR p. ${esc(r.financial_source_pages.expended)} ↗</a>${catalogReferenceMarkup(r.source_url)}<small>${esc(r.report_publication_date||'Publication date unavailable')}</small></td></tr>`).join('')||'<tr><td colspan="6">No selected activity records. An unlisted activity or missing report is not zero.</td></tr>';
 $('ts-page').textContent=selected.length?`${start+1}–${Math.min(start+PAGE,selected.length)} of ${selected.length}`:'0 records';
 $('ts-prev').disabled=page===0;$('ts-next').disabled=start+PAGE>=selected.length;$('ts-export').disabled=!selected.length;
 const quarters=data.quarter_inventory.filter(r=>(!f.q||r.quarter===f.q)&&(!f.status||r.report_status===f.status));
 $('ts-quarter-rows').innerHTML=quarters.map(r=>`<tr><td>${esc(r.quarter)}<small>Award Q${esc(r.award_relative_quarter)}</small></td><td>${esc(r.report_status)}</td><td>${esc(money(r.expended_to_date_cents))}</td><td>${esc(money(r.obligated_to_date_cents))}</td><td>${r.source_url?`<a href="${esc(r.source_url)}#page=${esc(r.financial_source_pages.expended)}" target="_blank" rel="noopener">Source p. ${esc(r.financial_source_pages.expended)} ↗</a>${catalogReferenceMarkup(r.source_url)}`:'Not located in checked indexes'}</td></tr>`).join('')||'<tr><td colspan="5">No report versions match the selected filters.</td></tr>';
 $('ts-horizons').innerHTML=data.award_horizons.map(r=>`<tr><td>Q${esc(r.horizon)} · ${esc(r.quarter)}</td><td>${esc(r.report_status)}</td><td>${esc(money(r.expended_to_date_cents))}</td><td>${esc(money(r.obligated_to_date_cents))}</td><td>${esc(money(r.qpr_reported_award_cents))}</td><td>${esc(pct(r.expended_obligated_ratio))}</td><td>${esc(pct(r.expended_over_reported_award_ratio))}</td><td><a href="${esc(r.source_url)}#page=${esc(r.expended_source_page)}" target="_blank" rel="noopener">QPR ↗</a>${catalogReferenceMarkup(r.source_url)}</td></tr>`).join('');
}
async function open(){
 if(!loading)loading=fetch('data/tuscaloosa-pilot-v52.json').then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()});
 try{const value=await loading;if(data)return;data=value;for(const r of data.quarter_inventory){const o=document.createElement('option');o.value=r.quarter;o.textContent=`${r.quarter} · award Q${r.award_relative_quarter}${r.source_url?'':' · report not located'}`;$('ts-quarter').append(o);}render();}
 catch(e){$('ts-count').textContent=`Tuscaloosa pilot could not be loaded (${e.message}). No missing records were filled.`;}
}
for(const id of ['ts-search','ts-quarter','ts-status'])$(id).addEventListener(id==='ts-search'?'input':'change',()=>{page=0;render();});
$('ts-prev').addEventListener('click',()=>{if(page>0){page--;render();}});$('ts-next').addEventListener('click',()=>{if((page+1)*PAGE<selected.length){page++;render();}});
$('ts-export').addEventListener('click',()=>{if(!selected.length)return;const headers=[...new Set(data.activity_quarters.flatMap(r=>Object.keys(r)))];const u=URL.createObjectURL(new Blob([objectsCSV(selected,headers)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='tuscaloosa-pilot-filtered.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);$('ts-count').textContent=`Downloaded ${selected.length} filtered source records.`;});
function visible(){if(['#municipal-qprs','#tuscaloosa-pilot'].includes(location.hash))void open();}
window.addEventListener('hashchange',visible);visible();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){void open();observer.disconnect();}},{rootMargin:'300px'});observer.observe($('tuscaloosa-pilot'));}else void open();
// The shared finance loader temporarily disables every control. Re-render
// after it restores their prior states so an independently loaded pilot keeps
// its correct pagination and export availability.
const financeControls=$('finance-controls');
if(financeControls&&'MutationObserver' in window)new MutationObserver(()=>{if(data&&financeControls.getAttribute('aria-busy')==='false')render();}).observe(financeControls,{attributes:true,attributeFilter:['aria-busy']});
