import {money, selectDemo, eligiblePoint, inRegion, project, REGIONS, safeUrl, MONEY_FIELDS} from './core.mjs';

const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const number = value => Number(value).toLocaleString('en-US');
let meta, demo, sources, geography, result, page=1, requestId=0, layer='admin', debounce;
let filters = {};
let mapZoom=1,mapCenter=null,drag=null,dragged=false;
const apiUrl = path => new URL(`./api/${path}`, location.href);
async function json(url) {const response=await fetch(url,{cache:'no-store',headers:String(url).includes('/api/')?{'X-Atlas-Local':'1'}:{}});if(!response.ok)throw new Error(`Could not load ${url} (${response.status}).`);return response.json();}
function showError(message) { $('app-error').hidden=false; $('app-error').textContent=message; }
function view() {
  const id=['explore','sources','readiness'].includes(location.hash.slice(1))?location.hash.slice(1):'explore';
  document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==id);
  document.querySelectorAll('[data-view]').forEach(el=>{if(el.dataset.view===id)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
}
function populateEntities() {
  const current=$('entity').value;
  const allowed=meta.entities.filter(e=>e.snapshots.includes($('snapshot').value));
  $('entity').innerHTML='<option value="">All administering entities</option>'+allowed.map(e=>`<option value="${escape(e.id)}">${escape(e.name)}</option>`).join('');
  if(allowed.some(e=>e.id===current))$('entity').value=current;
  const snapshot=meta.snapshots.find(s=>s.id===$('snapshot').value);
  for(const id of ['quarter-from','quarter-to']) {
    const previous=$(id).value;
    $(id).innerHTML=`<option value="">${id==='quarter-from'?'First observed':'Last observed'}</option>`+snapshot.quarters.map(q=>`<option>${escape(q)}</option>`).join('');
    if(snapshot.quarters.includes(previous))$(id).value=previous;
  }
}
function getFilters() {return {snapshot:$('snapshot').value,q:$('search').value.trim(),entity:$('entity').value,cohort:$('cohort').value,scope:$('scope').value,from:$('quarter-from').value,to:$('quarter-to').value,page};}
async function refresh() {
  const ticket=++requestId; filters=getFilters();
  if(meta.mode==='public'){renderPublic();return;}
  if(filters.from && filters.to && filters.from>filters.to) {
    $('filter-message').textContent='The starting quarter must be on or before the ending quarter.';
    $('quarter-from').setAttribute('aria-invalid','true');
    $('stats').innerHTML=''; $('records').innerHTML=''; $('results-count').textContent='Invalid quarter range';
    $('previous').disabled=true; $('next').disabled=true; $('page-info').textContent=''; $('total-note').textContent='';
    result={entityIds:[]}; renderMap(); return;
  }
  $('quarter-from').removeAttribute('aria-invalid');
  $('filter-message').textContent='Loading selected records…';
  try {
    let next;
    if(meta.mode==='private') {const url=apiUrl('records');Object.entries(filters).forEach(([k,v])=>url.searchParams.set(k,v));next=await json(url);}
    else next=selectDemo(demo,filters);
    if(ticket!==requestId)return;
    $('app-error').hidden=true;
    result=next;page=result.page;
    const snapshot=meta.snapshots.find(s=>s.id===filters.snapshot);
    $('filter-message').textContent=`${snapshot.label} · ${snapshot.vintage} · ${meta.mode==='private'?'Restricted local records':'Synthetic records only'}`;
    $('stats').innerHTML=[['Records',result.summary.records,'activity-quarter observations'],['Administering entities',result.summary.entities,'identity, not beneficiary location'],['Original awards',result.summary.awards,'within the selected snapshot'],['Activity keys',result.summary.activities,'award + project + activity']].map(([label,n,note])=>`<div class="stat"><span>${label}</span><strong>${number(n)}</strong><small>${note}</small></div>`).join('');
    $('results-count').textContent=`${number(result.total)} ${meta.mode==='private'?'local':'synthetic'} records · ${number(result.summary.quarters)} observed quarters`;
    $('records').innerHTML=result.rows.map((r,i)=>`<tr><td><button type="button" class="record-open" data-record="${i}" aria-label="Open record ${escape(r.grant_id)} ${escape(r.activity_number)} ${escape(r.calendar_quarter)}">${escape(r.entity_name)}</button><small>${escape(r.grant_id)}</small></td><td>${escape(r.activity_number)}<small>Project ${escape(r.project_number)} · ${escape(r.activity_type)}</small></td><td>${escape(r.calendar_quarter)}${r.endpoint_flag?'<small>Endpoint may be partial</small>':''}</td><td><span class="tag gray">${escape(r.cohort)}</span></td><td class="number ${r.expended_cents && BigInt(r.expended_cents)<0n?'negative':''}">${money(r.expended_cents)}</td><td><span class="evidence-badge">${meta.mode==='private'?'Admin identity only':'Synthetic'}</span><small>Beneficiary unresolved</small></td></tr>`).join('');
    $('empty-results').hidden=result.total!==0;
    $('page-info').textContent=result.total?`Showing ${number((page-1)*result.pageSize+1)}–${number(Math.min(page*result.pageSize,result.total))} of ${number(result.total)}`:'0 records';
    $('previous').disabled=page<=1;$('next').disabled=page*result.pageSize>=result.total;
    $('total-note').textContent=`${meta.mode==='private'?'Reported':'Synthetic'} net expenditure across the filtered records: ${money(result.summary.expended_cents)}. ${result.summary.expended_cents_missing || 0} unavailable source cells. This is an observed-window sum, not an allocation, certified award-to-date total or execution ratio.`;
    renderMap();
  }catch(error){if(ticket===requestId){showError('The selected records could not be loaded. No substitute data have been inserted. '+error.message);$('filter-message').textContent='Data load failed.';$('records').innerHTML='';$('stats').innerHTML='';$('total-note').textContent='';$('results-count').textContent='Unavailable';result={entityIds:[]};renderMap();}}
}
function chooseReference(id) {
  $('entity').value=id;
  const region={'02':'alaska','15':'hawaii','60':'samoa','66':'pacific','69':'pacific','72':'caribbean','78':'caribbean'}[id] || 'conus';
  $('map-region').value=region;mapZoom=1;mapCenter=null;page=1;refresh();
}
function renderPublic() {
  const q=filters.q.toLowerCase();
  const matches=meta.entities.filter(e=>(!filters.entity||e.id===filters.entity)&&(!q||`${e.name} ${e.id}`.toLowerCase().includes(q)));
  page=Math.max(1,Math.min(page,Math.ceil(matches.length/20)||1));
  result={entityIds:[],scopeIds:[],referenceIds:matches.map(e=>e.id),total:matches.length,page,pageSize:20,rows:[]};
  $('filter-message').textContent='Public reference geography · Census 2023 · no financial records, grant-coverage inference or synthetic values.';
  $('stats').innerHTML=[['Official source entries',sources.length,'links, units and required joins'],['Reference areas',matches.length,'states, D.C. and territories'],['Financial records published','0','not available in this release'],['Milestone ratios','—','Q4 / Q12 / Q20 unavailable']].map(([label,n,note])=>`<div class="stat"><span>${label}</span><strong>${n}</strong><small>${note}</small></div>`).join('');
  $('results-count').textContent=`${matches.length} reference areas · 0 financial records`;
  $('records').innerHTML=matches.slice((page-1)*20,page*20).map(e=>`<tr><td><button type="button" class="record-open" data-reference="${e.id}">${escape(e.name)}</button></td><td>${e.id}</td><td>2023</td><td>Reference only</td><td>Unavailable</td><td><a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html" target="_blank" rel="noopener noreferrer">Census source ↗</a></td></tr>`).join('');
  $('empty-results').hidden=matches.length!==0;
  $('page-info').textContent=matches.length?`Showing ${(page-1)*20+1}–${Math.min(page*20,matches.length)} of ${matches.length}`:'0 reference areas';
  $('previous').disabled=page<=1;$('next').disabled=page*20>=matches.length;
  $('total-note').textContent='A listed or highlighted geography is a Census reference area only. It does not indicate a CDBG-DR award, spending, activity location or beneficiary coverage. No financial totals or execution ratios are available.';
  renderMap();
}
function mapBounds() {
  const b=REGIONS[$('map-region').value].bounds;
  const center=mapCenter || [(b[0]+b[2])/2,(b[1]+b[3])/2];
  const w=(b[2]-b[0])/mapZoom,h=(b[3]-b[1])/mapZoom;
  return [center[0]-w/2,center[1]-h/2,center[0]+w/2,center[1]+h/2];
}
function navigateMap(action) {
  const b=mapBounds(),center=[(b[0]+b[2])/2,(b[1]+b[3])/2];
  if(action==='in')mapZoom=Math.min(8,mapZoom*1.5);
  if(action==='out')mapZoom=Math.max(1,mapZoom/1.5);
  if(action==='reset'){mapZoom=1;mapCenter=null;}
  if(['left','right','up','down'].includes(action)) {
    const dx=(b[2]-b[0])*.2,dy=(b[3]-b[1])*.2;
    mapCenter=[center[0]+(action==='right'?dx:action==='left'?-dx:0),center[1]+(action==='up'?dy:action==='down'?-dy:0)];
  }
  renderMap();
}
function renderMap() {
  const bounds=mapBounds(), svg=$('map');
  $('map-zoom').textContent=`${mapZoom.toFixed(1)}×`;$('zoom-in').disabled=mapZoom>=8;$('zoom-out').disabled=mapZoom<=1;
  let paths='';
  for (const feature of geography.features) {
    let featurePath='';
    const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
    for(const polygon of polygons) {
      // Reject antimeridian-crossing rings in the western Alaska panel; never draw a world-spanning seam.
      const ring=polygon[0];
      const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]);
      if(Math.max(...xs)<bounds[0]||Math.min(...xs)>bounds[2]||Math.max(...ys)<bounds[1]||Math.min(...ys)>bounds[3])continue;
      if(ring.some((p,i)=>i && Math.abs(p[0]-ring[i-1][0])>180))continue;
      const d=polygon.map(r=>r.map((p,i)=>{const [x,y]=project(p[0],p[1],bounds);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`;}).join(' ')+' Z').join(' ');
      featurePath+=' '+d;
    }
    const publicAttrs=meta.mode==='public'&&layer==='admin'?` role="button" tabindex="0" data-reference="${feature.properties.geoid}" aria-label="Select ${escape(feature.properties.name)} reference geography; no funding coverage implied"`:'';
    if(featurePath)paths+=`<path class="map-state ${meta.mode==='public'&&filters.entity===feature.properties.geoid?'reference-selected':''}" d="${featurePath}"${publicAttrs}><title>${escape(feature.properties.name)} · 2023 reference boundary; no funding coverage implied</title></path>`;
  }
  let grid='';for(let x=0;x<=760;x+=95)grid+=`<path class="map-grid" d="M${x},0V355"/>`;for(let y=0;y<=355;y+=71)grid+=`<path class="map-grid" d="M0,${y}H760"/>`;
  const entities=layer==='activity'?(meta.activityScopes || []).filter(e=>(result?.scopeIds || []).includes(e.id)):meta.entities.filter(e=>(result?.entityIds || []).includes(e.id));
  const mapped=entities.filter(e=>eligiblePoint(e,layer));
  const visible=mapped.filter(e=>inRegion(e.point,bounds));
  svg.innerHTML=`<title id="map-svg-title">${layer==='admin'?'Administering geography':layer==='activity'?'Documented administrative activity scope':'Unresolved beneficiary geography'} — ${escape(REGIONS[$('map-region').value].name)}</title><desc id="map-svg-desc">Geographic reference only. Equal-size points do not encode funding amounts or beneficiary locations.</desc>${grid}${paths}`+visible.map(e=>{const [x,y]=project(e.point.lon,e.point.lat,bounds);return `<circle class="map-marker ${layer==='activity'?'scope-marker':''}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="6" tabindex="0" role="button" data-entity="${escape(e.id)}" aria-label="Filter records for ${escape(e.name)}"><title>${escape(e.name)} · ${escape(e.point.area_name)} · ${escape(e.point.vintage)} reference only</title></circle>`;}).join('');
  svg.setAttribute('role','group');
  $('map-title').textContent=layer==='admin'?'Administering geography':layer==='activity'?'Reported administrative scope':'Beneficiary geography';
  document.querySelector('.legend-dot').classList.toggle('scope-dot',layer==='activity');
  $('map-role-explainer').textContent=layer==='activity'?'Equal-sized amber markers identify reference areas for documented period-specific administrative activity scopes. They are not exact activity sites, beneficiary residences or funding magnitudes. Overlapping city/county areas are not disjoint exposure. The documented activity-scope filter provides the same selection without using the map.':layer==='beneficiary'?'No verified beneficiary geography is available. Neither administering-entity reference points nor documented administrative activity scopes are substituted. The table retains the unresolved records.':'Equal-sized green markers locate a geographic reference associated with the administering entity. They do not represent an office address, service area, activity site, beneficiary residence or amount of funding. Selecting a marker filters records; the jurisdiction filter offers the same action.';
  const empty=$('map-empty');empty.hidden=visible.length>0;
  if(!empty.hidden) {
    if(layer==='beneficiary')empty.innerHTML='<strong>No verified beneficiary locations</strong>Unresolved geography is left blank. Administrative points are not substituted.';
    else if(meta.mode==='demo')empty.innerHTML='<strong>Real geography. Synthetic records.</strong>Example jurisdictions have no coordinates. No research locations are shown in this preview.';
    else if(layer==='activity')empty.innerHTML='<strong>No certified activity scope in this view</strong>Only period-specific documented administrative scopes may appear. Other locations remain unallocated.';
    else empty.innerHTML='<strong>No supported points in this view</strong>Try another region or clear the record filters. Missing coordinates remain blank.';
  }
  $('map-note').textContent=layer==='beneficiary'?'Beneficiary geography is unresolved for these records. The outlines are geographic reference only.':layer==='activity'?`${visible.length} documented administrative scopes in this map view. These describe administration in 2024Q4, not beneficiary locations or disjoint exposure. Report: Submitted - Await for Review. Other activity geography remains unallocated.`:`${visible.length} supported administering reference points in this map view; ${mapped.length-visible.length} outside this view; ${entities.length-mapped.length} entities without supported coordinates. No financial values are mapped.`;
  $('map-evidence').innerHTML=mapped.length?`<ul>${mapped.map(e=>`<li><strong>${escape(e.name)}</strong>: ${escape(e.point.area_name)} · ${escape(e.point.area_id)} · ${escape(e.point.vintage)}. ${escape(e.point.evidence)} ${safeUrl(e.point.source_url)?`<a href="${escape(safeUrl(e.point.source_url))}" target="_blank" rel="noopener noreferrer">Reference source ↗</a>`:''}</li>`).join('')}</ul>`:'<p>No eligible location points are supplied for this layer.</p>';
  if(meta.mode==='public') {
    $('map-title').textContent=layer==='admin'?'Census reference geography':layer==='activity'?'Activity geography unavailable':'Beneficiary geography unavailable';
    $('map-note').textContent=layer==='admin'?`Reference boundaries only · ${filters.entity?meta.entities.find(e=>e.id===filters.entity)?.name+' selected':'no CDBG-DR coverage implied'}. Select a boundary or use the reference-area selector to synchronize the table.`:'No verified locations are published. Reference outlines do not imply activity or beneficiary coverage.';
    $('map-empty').hidden=layer==='admin';
    if(layer!=='admin')$('map-empty').innerHTML='<strong>No verified locations published</strong>These fields remain unavailable. Reference outlines and administering identities are not substituted.';
    $('map-role-explainer').textContent='Census state and territory reference areas only. Selection highlights a reference boundary and filters the accessible reference table. It is not a map of CDBG-DR awards, funded places, activity footprints, beneficiary residences or funding magnitudes.';
    $('map-evidence').innerHTML='<p>The reference-area selector and table provide the same selection without using the map. Financial and location coverage are unavailable in this public release.</p>';
    $('map-svg-title').textContent=`Census reference map — ${REGIONS[$('map-region').value].name}; no funding coverage implied`;
    $('map-svg-desc').textContent='Interactive Census reference outlines only. No financial amounts, funded-area classifications, activity locations or beneficiary locations are encoded.';
  }
}
function recordDetail(index) {
  const r=result.rows[index]; if(!r)return;
  const e=meta.entities.find(x=>x.id===r.entity_id);
  const point=eligiblePoint(e,'admin')?`${e.point.area_name} (${e.point.area_id}), vintage ${e.point.vintage}; administering reference only`:'No supported coordinates; not placed on the map';
  const names=['Net obligations','Net expenditures','Grant disbursements','Program-income disbursements','Program-income receipts'];
  $('record-detail').innerHTML=`<span class="tag ${meta.mode==='private'?'amber':'gray'}">${meta.mode==='private'?'Restricted · local review only':'Synthetic example · not research evidence'}</span><h2 id="dialog-title">${escape(r.entity_name)}</h2><p>${escape(r.activity_type)} · ${escape(r.calendar_quarter)}</p><dl><dt>Source snapshot</dt><dd>${escape(r.snapshot)}</dd><dt>Original award / project</dt><dd>${escape(r.grant_id)} / ${escape(r.project_number)}</dd><dt>Original activity</dt><dd>${escape(r.activity_number)}</dd><dt>Record ID</dt><dd>${escape(r.id)}</dd><dt>Cohort / entity type</dt><dd>${escape(r.cohort)} / ${escape(r.entity_type.replaceAll('_',' '))}</dd><dt>Original grantee label</dt><dd>${escape(r.grantee_raw || r.entity_name)}${r.label_anomaly?' · label anomaly retained; award-specific identity evidence required':''}</dd><dt>Source row</dt><dd>${escape(r.source_file)} · CSV record ${escape(r.source_record)}${r.source_workbook?` · ${escape(r.source_workbook)} row ${escape(r.source_workbook_row)}`:''}</dd><dt>Reporting period begins</dt><dd>${escape(r.period_begin || 'Unavailable')} · this is not the initial grant execution date</dd><dt>Fiscal label in source</dt><dd>${escape(r.fiscal_label || 'Unavailable')} · display uses calendar quarter</dd><dt>Reference geography</dt><dd>${escape(point)}</dd><dt>Administering identity evidence</dt><dd>${escape(e?.identity_evidence || 'Synthetic identity; no geographic evidence')}</dd><dt>Reported activity scope</dt><dd>${escape(r.activity_scope || 'Unallocated / joint / unverified')}${r.scope_note?` · ${escape(r.scope_note)}`:''}</dd><dt>Beneficiary geography</dt><dd>Unavailable — no certified beneficiary assignment</dd><dt>Internal missing quarters</dt><dd>${r.internal_gaps===null?'Unknown':escape(r.internal_gaps)} in the activity’s observed span; absent quarters are not zero</dd><dt>Endpoint status</dt><dd>${escape(r.endpoint_status || 'Reporting completeness unverified')}</dd></dl><div class="money-grid">${MONEY_FIELDS.map((k,i)=>`<div><span>${names[i]} · nominal USD</span><strong>${money(r[k])}</strong></div>`).join('')}</div><p class="detail-note">All five fields are signed quarterly net flows. Exact cents preserve the supplied CSV precision; they do not certify upstream precision. Disbursements and expenditures remain separate.</p><div class="milestones"><span>Q4<strong>Unavailable</strong></span><span>Q12<strong>Unavailable</strong></span><span>Q20<strong>Unavailable</strong></span></div><p class="fine-print">Verified initial execution date: unavailable. Compatible city/activity allocation: unavailable. No ratio is inferred from these quarterly flows.</p>`;
  $('record-dialog').showModal();$('close-dialog').focus();
}
function renderSources() {
  const q=$('source-search').value.trim().toLowerCase(),category=$('source-category').value;
  const matched=sources.filter(s=>(!category||s.category===category)&&(!q||Object.values(s).join(' ').toLowerCase().includes(q)));
  $('source-count').textContent=`${matched.length} of ${sources.length} sources · catalog entries are not evidence that a local analytic join is complete`;
  $('source-grid').innerHTML=matched.length?matched.map(s=>`<article class="card source-card"><header><span class="tiny-label">${escape(s.category)} / ${escape(s.id.toUpperCase())}</span><span class="tag ${s.status.includes('Restricted')?'amber':'gray'}">${escape(s.status)}</span></header><h3>${escape(s.name)}</h3><p class="provider">${escape(s.provider)}</p><p>${escape(s.availability)}</p><dl><dt>Unit</dt><dd>${escape(s.unit)}</dd><dt>Vintage</dt><dd>${escape(s.vintage)}</dd><dt>Coverage</dt><dd>${escape(meta.sourceNotes?.[s.id] || 'No research values bundled in this static preview.')}</dd><dt>Definition</dt><dd>${escape(s.definition)}</dd></dl><details><summary>Missingness, linkage and access</summary><p><strong>Missingness.</strong> ${escape(s.missingness)}</p><p><strong>Required join.</strong> ${escape(s.linkage)}</p><p><strong>Access.</strong> ${escape(s.rights)}</p><p><strong>Link check.</strong> ${escape(s.checked)}</p></details>${safeUrl(s.url)?`<a class="text-link" href="${escape(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">Official source <span aria-hidden="true">↗</span></a>`:''}</article>`).join(''):'<div class="empty-results"><strong>No matching sources</strong><p>Try a broader term or another category.</p></div>';
}
function bind() {
  window.addEventListener('hashchange',view); view();
  $('filters').addEventListener('submit',event=>event.preventDefault());
  $('search').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{page=1;refresh();},180);});
  for(const id of ['snapshot','entity','cohort','scope','quarter-from','quarter-to'])$(id).addEventListener('change',()=>{page=1;if(meta.mode==='public'&&id==='entity'&&$(id).value){chooseReference($(id).value);return;}if(id==='snapshot')populateEntities();refresh();});
  $('reset').addEventListener('click',()=>{$('search').value='';for(const id of ['entity','cohort','scope','quarter-from','quarter-to'])$(id).value='';page=1;refresh();});
  $('previous').addEventListener('click',()=>{page--;refresh();});$('next').addEventListener('click',()=>{page++;refresh();});
  for(const name of ['admin','activity','beneficiary'])$(name+'-layer').addEventListener('click',()=>{layer=name;for(const n of ['admin','activity','beneficiary'])$(n+'-layer').setAttribute('aria-pressed',String(n===name));renderMap();});
  $('map-region').addEventListener('change',()=>navigateMap('reset'));
  for(const id of ['zoom-in','zoom-out','pan-left','pan-up','pan-down','pan-right','map-reset'])$(id).addEventListener('click',()=>navigateMap(id.split('-')[1]));
  function mapClick(event){if(dragged){dragged=false;return;}const ref=event.target.closest('[data-reference]');if(ref){chooseReference(ref.dataset.reference);return;}const el=event.target.closest('[data-entity]');if(!el)return;$(layer==='activity'?'scope':'entity').value=el.dataset.entity;page=1;refresh();}
  $('map').addEventListener('click',mapClick);
  $('map').addEventListener('keydown',event=>{
    if((event.target.hasAttribute('data-entity')||event.target.hasAttribute('data-reference'))&&['Enter',' '].includes(event.key)){event.preventDefault();mapClick(event);return;}
    const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out','0':'reset'}[event.key];
    if(action){event.preventDefault();navigateMap(action);}
  });
  $('map').addEventListener('pointerdown',event=>{if(event.button!==0)return;dragged=false;drag={x:event.clientX,y:event.clientY,bounds:mapBounds()};if(!event.target.closest('[data-entity],[data-reference]'))$('map').setPointerCapture(event.pointerId);});
  $('map').addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)<5)return;dragged=true;const b=drag.bounds,rect=$('map').getBoundingClientRect();mapCenter=[(b[0]+b[2])/2-dx/rect.width*(b[2]-b[0]),(b[1]+b[3])/2+dy/rect.height*(b[3]-b[1])];renderMap();});
  $('map').addEventListener('pointerup',()=>{drag=null;});$('map').addEventListener('pointercancel',()=>{drag=null;});
  $('records').addEventListener('click',event=>{const ref=event.target.closest('[data-reference]');if(ref){chooseReference(ref.dataset.reference);return;}const button=event.target.closest('[data-record]');if(button)recordDetail(Number(button.dataset.record));});
  $('close-dialog').addEventListener('click',()=>$('record-dialog').close());
  $('source-search').addEventListener('input',renderSources);$('source-category').addEventListener('change',renderSources);
  $('download-catalog').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(sources,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cecreh-public-source-catalog.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
}
async function start() {
  [sources,geography]=await Promise.all([json('./data/sources.json'),json('./data/geography.json')]);
  let privateMeta;
  if(['127.0.0.1','localhost','[::1]'].includes(location.hostname)) {try{privateMeta=await json(apiUrl('meta'));}catch{privateMeta=null;}}
  if(privateMeta?.mode==='private')meta=privateMeta;
  else {
    if(new URLSearchParams(location.search).get('mode')==='private')throw new Error('Private mode was requested, but the local adapter is unavailable. Start the loopback server with --private-db.');
    demo=await json('./data/catalog.json');meta=demo;
  }
  const privateMode=meta.mode==='private';
  const publicMode=meta.mode==='public';
  $('mode-pill').textContent=privateMode?'LOCAL · RESTRICTED':publicMode?'PUBLIC SOURCE PREVIEW':'SYNTHETIC PREVIEW';
  $('mode-banner').classList.toggle('private',privateMode);
  $('mode-banner').innerHTML=privateMode?'<strong>Private local research view.</strong> Restricted records are served only by this computer’s loopback adapter. No research data have been published.':publicMode?'<strong>Public source & geography preview.</strong> Real Census reference areas and official source links. Financial records, activity/beneficiary locations and milestone ratios are not published. No synthetic financial values are shown.':'<strong>Synthetic preview.</strong> Example records are not research data.';
  $('footer-mode').textContent=privateMode?'Private local view · restricted source data':publicMode?'Publicly accessible · no restricted research data':'Synthetic preview';
  $('snapshot').innerHTML=meta.snapshots.map(s=>`<option value="${escape(s.id)}">${escape(s.label)}</option>`).join('');
  $('scope').innerHTML='<option value="">All records</option><option value="unverified">Unallocated / unverified</option>'+(meta.activityScopes || []).map(s=>`<option value="${escape(s.id)}">${escape(s.name)}</option>`).join('');
  populateEntities();bind();renderSources();
  if(publicMode){
    $('filters').setAttribute('aria-label','Search Census reference geography');
    document.querySelector('.table-scroll').setAttribute('aria-label','Geography reference table, horizontally scrollable');
    document.querySelector('.map-card .pill').textContent='Reference boundaries';
    document.querySelector('#explore .section-heading .eyebrow').textContent='PUBLIC REFERENCE EXPLORER';
    document.querySelector('#explore .section-heading > p').innerHTML='Reference geography only.<br><strong>No grant coverage implied.</strong>';
    document.querySelector('[data-view="explore"]').firstChild.textContent='Map & reference areas ';
    $('explore-title').textContent='Explore public reference geography.';
    document.querySelector('label[for="search"]').textContent='Search reference areas';$('search').placeholder='Search a state, territory or Census code…';
    document.querySelector('label[for="entity"]').textContent='Reference area';$('entity').options[0].textContent='All reference areas';
    for(const id of ['cohort','scope','quarter-from','quarter-to'])$(id).closest('.field').hidden=true;
    $('admin-layer').textContent='Reference areas';$('records-title').textContent='Geography reference inventory';
    document.querySelector('.records-section .eyebrow').textContent='CENSUS 2023 · CONTEXT ONLY';
    document.querySelector('.record-note').innerHTML='<strong>No financial records published</strong><span>Reference geography does not imply awards, activities, beneficiaries or funding.</span>';
    document.querySelector('thead tr').innerHTML=['Reference area','Census GEOID','Boundary vintage','Geography role','Financial data','Provenance'].map(t=>`<th scope="col">${t}</th>`).join('');
    document.querySelector('table caption').textContent='Census reference geography only. No financial records or CDBG-DR coverage are represented.';
    document.querySelector('#empty-results strong').textContent='No matching reference areas';
    document.querySelector('#empty-results p').textContent='Try a different state or territory name, or reset the filters.';
  }
  if(privateMode && meta.readiness){$('local-readiness').hidden=false;$('local-readiness').innerHTML=`<div class="local-summary"><strong>Local evidence review · ${escape(meta.prepared)}</strong>${meta.readiness.map(note=>`<p>${escape(note)}</p>`).join('')}</div>`;}
  await refresh();
}
start().catch(error=>{showError('The dashboard could not initialize. '+error.message);$('mode-banner').textContent='Data unavailable. No financial results are shown.';$('mode-pill').textContent='LOAD ERROR';});
