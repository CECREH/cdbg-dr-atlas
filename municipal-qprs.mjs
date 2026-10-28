import {escape as esc,money} from './domain.mjs';
import {downloadCSV} from './research.mjs';
import {FIELDS,municipalExport,filterMunicipal,sortMunicipal} from './municipal-qpr-domain.mjs';
const $=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('en-US'),PAGE=40;
export function initMunicipalQprs(get,fail){
 let data=null,records=[],page=0,mode='activity',loading=null;
 function option(id,values,label){const el=$(id),prior=el.value;el.innerHTML=`<option value="">${esc(label)}</option>`+[...new Set(values.filter(Boolean))].sort().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if([...el.options].some(x=>x.value===prior))el.value=prior;}
 function filter(){
  if(!data)return;page=0;mode=$('mq-mode').value;
  const source=mode==='activity'?data.rows:data.reports;
  records=sortMunicipal(filterMunicipal(source,{q:$('mq-search').value,city:$('mq-city').value,grant:$('mq-grant').value,quarter:$('mq-quarter').value,status:$('mq-status').value}),$('mq-sort').value);render();
 }
 function render(){
  const start=page*PAGE,subset=records.slice(start,start+PAGE);$('mq-count').textContent=`${fmt(records.length)} ${mode==='activity'?(records.length===1?'activity-quarter record':'activity-quarter records'):(records.length===1?'whole-grant report':'whole-grant reports')} match. Values are source snapshots, not a sum.`;
  $('mq-rows').innerHTML=subset.map(r=>{
   const a=mode==='activity',v=a?r:(r.whole_grant_values||{}),source=a?r.source_url:r.url,pages=a?r.financial_source_pages:r.whole_grant_source_pages,quarter=r.award_relative_quarter?`Award Q${r.award_relative_quarter}`:'Award quarter unavailable';
   const amount=k=>`${esc(money(v[k+'_to_date_cents']))}<small>This period: ${esc(money(v[k+'_period_cents']))}</small>`;
   const start=r.initial_execution_date&&r.initial_execution_source_url?`<a href="${esc(r.initial_execution_source_url)}#page=${esc(r.initial_execution_source_page||1)}" target="_blank" rel="noopener">Start ${esc(r.initial_execution_date)} ↗</a>${r.initial_execution_conflict?' · source conflict noted in export':''}`:'Start date unavailable';
   return `<tr><td><strong>${esc(r.city)}</strong><small>${esc(r.admin_reference||'Reference unavailable')} · administering government</small></td><td>${esc(r.grant)}<small>${a?`${esc(r.project)} / ${esc(r.activity)}`:'Whole administering grant'}</small><small>${esc(r.cohort||'Cohort unavailable')} · ${esc(r.disaster||'Disaster label unavailable')} (F31 metadata)</small><small>QPR grant award: <a href="${esc(source)}#page=${esc(r.qpr_award_header_page||1)}" target="_blank" rel="noopener">${esc(money(r.qpr_reported_grant_award_cents))} ↗</a> · report vintage</small></td><td>${esc(r.quarter)}<small>${esc(quarter)}</small><small>${start}</small></td><td class="money">${amount('expended')}</td><td class="money">${amount('obligated')}</td><td class="money">${amount('budget')}</td><td>${esc(r.report_status)}<small>${a?esc(r.qpr_activity_type||'Activity type unavailable')+' · '+esc(r.f31_exact_activity_key_match?'Exact F31 activity key':'QPR-only ID; no F31 crosswalk')+'<br>'+esc(r.period_reconciliation_status):'Overall programmed budget; not grant allocation'}</small></td><td><a href="${esc(source)}#page=${esc(pages?.expended||1)}" target="_blank" rel="noopener">QPR p. ${esc(pages?.expended||1)} ↗</a><small>Published ${esc((a?r.report_publication_date:r.publication_date)||'date unavailable')}</small></td></tr>`;
  }).join('')||'<tr><td colspan="8">No reports match. Clear a filter or search term.</td></tr>';
  $('mq-page').textContent=records.length?`${fmt(start+1)}–${fmt(Math.min(start+PAGE,records.length))} of ${fmt(records.length)}`:'0 records';$('mq-previous').disabled=page===0;$('mq-next').disabled=start+PAGE>=records.length;$('mq-export').disabled=!records.length;
 }
 async function open(){
  if(!loading)loading=get('data/municipal-qpr-evidence.json');data=await loading;
  const c=data.coverage;$('mq-coverage').textContent=`${fmt(c.validated_reports)} verified reports · ${fmt(c.validated_cities)} administering cities · ${fmt(c.validated_grants)} awards · ${fmt(c.activity_quarter_rows)} selected activity-quarter records. ${fmt(c.exact_f31_activity_key_rows)} have an exact F31 activity key; ${fmt(c.nyc_qpr_only_admin_planning_rows)} are NYC QPR-only administrative/planning IDs. 429 matched activity quarters agree with F31 for reported period expenditure and obligation; other cells were not compared. Not all reported activities are included.`;
  option('mq-city',data.reports.map(r=>r.city),'All administering cities');option('mq-grant',data.reports.map(r=>r.grant),'All awards');option('mq-quarter',data.reports.map(r=>r.quarter),'All report quarters');option('mq-status',data.reports.map(r=>r.report_status),'All review statuses');filter();
 }
 let timer;$('mq-search').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(filter,180);});
 for(const id of ['mq-mode','mq-city','mq-grant','mq-quarter','mq-status','mq-sort'])$(id).addEventListener('change',filter);
 $('mq-previous').addEventListener('click',()=>{page--;render();});$('mq-next').addEventListener('click',()=>{page++;render();});
 $('mq-export').addEventListener('click',()=>{downloadCSV(`municipal-qpr-${mode}-filtered.csv`,records.map(r=>municipalExport(r,mode)),FIELDS);$('mq-count').textContent=`Downloaded ${fmt(records.length)} ${mode==='activity'?(records.length===1?'activity-quarter record':'activity-quarter records'):(records.length===1?'whole-grant report':'whole-grant reports')} from this selection.`;});
 $('mq-clear').addEventListener('click',()=>{for(const id of ['mq-search','mq-city','mq-grant','mq-quarter','mq-status'])$(id).value='';filter();});
 return {open:()=>open().catch(fail)};
}
