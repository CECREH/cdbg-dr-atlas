import {activityColumns,placeColumns,cents,percent,selectRows,csvText} from './texas-evidence-domain.mjs';
const $=id=>document.getElementById(id);
const pageSize=20;
let data, activityPage=0, placePage=0, selectedActivities=[], selectedPlaces=[];
function addCell(tr,value,sub) { const td=document.createElement('td');td.textContent=value??'Unavailable';if(sub){const small=document.createElement('span');small.className='evidence-sub';small.textContent=sub;td.append(small);}tr.append(td);return td; }
function addSource(tr,url,status,publication) { const td=document.createElement('td'); if(url){const a=document.createElement('a');a.href=url;a.textContent='Open source page ↗';td.append(a);}else td.textContent='Source unavailable';const s=document.createElement('span');s.className='evidence-sub';s.textContent=[status,publication?`published ${publication.slice(0,10)}`:'publication date unavailable'].filter(Boolean).join(' · ');td.append(s);tr.append(td); }
function filters(){return {query:$('evidence-search').value,group:$('evidence-group').value,quarter:$('evidence-quarter').value,sort:$('evidence-sort').value};}
function emptyRow(body,columns,text){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=columns;td.textContent=text;tr.append(td);body.append(tr);}
function renderAwards() {
  const body=$('award-rows');body.replaceChildren();
  for (const r of data.whole_awards) {
    const tr=document.createElement('tr');addCell(tr,r.grant,r.start_date?`Agreement ${r.start_date}`:'Start unavailable');
    addCell(tr,r.quarter,r.horizon?`Provisional effective-quarter Q${r.horizon}`:'Calendar quarter only');
    addCell(tr,cents(r.expended_cents));addCell(tr,cents(r.obligated_cents));addCell(tr,cents(r.reported_award_cents));
    addCell(tr,percent(r.expended_obligated_ratio));addCell(tr,percent(r.expended_reported_award_ratio));
    addSource(tr,r.financial_url||r.source_url,r.status,r.publication_date);const note=document.createElement('span');note.className='evidence-sub';note.textContent=r.ratio_status;tr.lastChild.append(note);body.append(tr);
  }
}
function render(){
  selectedActivities=selectRows(data.activities,filters());selectedPlaces=selectRows(data.place_references,filters());
  activityPage=Math.min(activityPage,Math.max(0,Math.ceil(selectedActivities.length/pageSize)-1));placePage=Math.min(placePage,Math.max(0,Math.ceil(selectedPlaces.length/pageSize)-1));
  const a=$('activity-rows');a.replaceChildren();
  for(const r of selectedActivities.slice(activityPage*pageSize,(activityPage+1)*pageSize)) {
    const tr=document.createElement('tr');addCell(tr,r.reporting_group,`${r.quarter} · ${r.financial_scope}`);addCell(tr,r.activity,`Project ${r.project}`);
    addCell(tr,r.place_names||'Not established',r.place_names?'Reported names; no allocation':null);addCell(tr,cents(r.budget_to_date_cents));addCell(tr,cents(r.obligated_to_date_cents));addCell(tr,cents(r.expended_to_date_cents));addCell(tr,cents(r.expended_period_cents));addSource(tr,r.source_url,r.report_status,r.publication_date);a.append(tr);
  }
  if(!selectedActivities.length)emptyRow(a,8,'No activity records match these filters.');
  $('activity-count').textContent=`${selectedActivities.length.toLocaleString()} matching activity records`;
  $('activity-page').textContent=selectedActivities.length?`Page ${activityPage+1} of ${Math.ceil(selectedActivities.length/pageSize)}`:'No pages';
  $('activity-prev').disabled=activityPage===0;$('activity-next').disabled=(activityPage+1)*pageSize>=selectedActivities.length;
  const p=$('place-rows');p.replaceChildren();
  for(const r of selectedPlaces.slice(placePage*pageSize,(placePage+1)*pageSize)){
    const tr=document.createElement('tr');addCell(tr,r.place_name,r.census_geoid?`${r.census_name} · GEOID ${r.census_geoid} · 2024`:'Census place match unresolved');addCell(tr,r.geography_role);addCell(tr,r.activity,`${r.reporting_group} · ${r.quarter}`);
    const flags=[r.census_lsad==='57'?'Census-designated place':null,r.outside_city_explicit?'Includes areas outside place':null,r.multi_area_statement?'Multiple named areas':null].filter(Boolean);
    addCell(tr,flags.join('; ')||'Boundary not verified');addSource(tr,r.source_url,'Source-reported place',null);p.append(tr);
  }
  if(!selectedPlaces.length)emptyRow(p,5,'No place references match these filters.');
  $('place-count').textContent=`${selectedPlaces.length.toLocaleString()} matching place references`;
  $('place-page').textContent=selectedPlaces.length?`Page ${placePage+1} of ${Math.ceil(selectedPlaces.length/pageSize)}`:'No pages';
  $('place-prev').disabled=placePage===0;$('place-next').disabled=(placePage+1)*pageSize>=selectedPlaces.length;
}
function download(rows,columns,name){const url=URL.createObjectURL(new Blob([csvText(rows,columns)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
for(const id of ['evidence-search','evidence-group','evidence-quarter','evidence-sort']) $(id).addEventListener(id==='evidence-search'?'input':'change',()=>{activityPage=placePage=0;render();});
$('evidence-clear').addEventListener('click',()=>{for(const id of ['evidence-search','evidence-group','evidence-quarter'])$(id).value='';$('evidence-sort').value='identity';activityPage=placePage=0;render();});
$('activity-prev').addEventListener('click',()=>{activityPage--;render();});$('activity-next').addEventListener('click',()=>{activityPage++;render();});
$('place-prev').addEventListener('click',()=>{placePage--;render();});$('place-next').addEventListener('click',()=>{placePage++;render();});
$('activity-export').addEventListener('click',()=>download(selectedActivities,activityColumns,'texas-evidence-filtered-activities.csv'));
$('place-export').addEventListener('click',()=>download(selectedPlaces,placeColumns,'texas-evidence-filtered-places.csv'));
try {const response=await fetch('data/texas-evidence-v55.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);data=await response.json();renderAwards();render();}
catch(error){$('evidence-error').hidden=false;$('evidence-error').textContent=`Could not load Texas evidence: ${error.message}. Try reloading this page.`;$('activity-count').textContent='Evidence unavailable.';}
