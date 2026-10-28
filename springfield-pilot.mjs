import {escape as esc,money} from './domain.mjs';
import {objectsCSV} from './research-domain.mjs';
import {filterSpringfield} from './springfield-pilot-domain.mjs';
const $=id=>document.getElementById(id),PAGE=25;
let data=null,loading=null,selected=[],page=0;
function filter(){if(!data)return;page=0;selected=filterSpringfield(data.activity_quarters,{query:$('sp-search').value,quarter:$('sp-quarter').value,view:$('sp-view').value});render();}
function render(){
 const start=page*PAGE,slice=selected.slice(start,start+PAGE);
 $('sp-count').textContent=`${selected.length.toLocaleString('en-US')} activity-quarter records match. These are QPR source snapshots, not a financial sum.`;
 $('sp-rows').innerHTML=slice.map(r=>{
  const amount=k=>`${esc(money(r[k+'_to_date_cents']))}<small>This period: ${esc(money(r[k+'_period_cents']))}</small>`;
  const status=r.expended_continuity_status==='adjacent_versions_reconcile'?'Prior listed expenditure agrees':r.expended_continuity_status==='previous_quarter_unavailable'?'Prior activity quarter unavailable':'Prior listed expenditure differs or is unavailable';
  const scope=r.f31_exact_activity_key?'Exact F31 activity key':'QPR-only activity key';
  return `<tr><td><strong>${esc(r.project)} / ${esc(r.activity)}</strong><small>${esc(r.activity_type_as_reported||'Activity type unavailable')}</small></td><td>${esc(r.quarter)}<small>Award Q${esc(r.award_relative_quarter)} · Q1 may be partial</small></td><td>${amount('expended')}</td><td>${amount('obligated')}</td><td>${amount('budget')}</td><td>${esc(status)}<small>${esc(scope)}${r.linked_extension_indicator?' · linked extension; avoid automatic addition':''}</small></td><td><a href="${esc(r.source_url)}#page=${esc(r.financial_source_pages.expended)}" target="_blank" rel="noopener">QPR p. ${esc(r.financial_source_pages.expended)} ↗</a><small>${esc(r.report_status)} · published ${esc(r.report_publication_date||'date unavailable')}</small></td></tr>`;
 }).join('')||'<tr><td colspan="7">No activity records match. A missing quarter is not zero.</td></tr>';
 $('sp-page').textContent=selected.length?`${start+1}–${Math.min(start+PAGE,selected.length)} of ${selected.length}`:'0 records';
 $('sp-prev').disabled=page===0;$('sp-next').disabled=start+PAGE>=selected.length;$('sp-export').disabled=!selected.length;
}
async function open(){
 if(!loading)loading=fetch('data/springfield-pilot-v48.json').then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()});
 try{const result=await loading;if(data)return;data=result;const q=$('sp-quarter');for(const row of data.quarter_inventory){const o=document.createElement('option');o.value=row.quarter;o.textContent=`${row.quarter} · award Q${row.award_relative_quarter}${row.source_url?'':' · report not located'}`;q.append(o);}filter();}
 catch(e){$('sp-count').textContent=`Springfield pilot could not be loaded (${e.message}). No missing records were filled.`;}
}
for(const id of ['sp-search','sp-quarter','sp-view'])$(id).addEventListener(id==='sp-search'?'input':'change',filter);
$('sp-prev').addEventListener('click',()=>{if(page>0){page--;render();}});$('sp-next').addEventListener('click',()=>{if((page+1)*PAGE<selected.length){page++;render();}});
$('sp-export').addEventListener('click',()=>{if(!selected.length)return;const csv=objectsCSV(selected,Object.keys(data.activity_quarters[0]));const u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='springfield-pilot-activity-filtered.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);$('sp-count').textContent=`Downloaded ${selected.length} filtered QPR activity-quarter records.`;});
function whenVisible(){if(location.hash==='#municipal-qprs')void open();}
window.addEventListener('hashchange',whenVisible);whenVisible();
