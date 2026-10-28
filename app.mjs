import {initMunicipalQprs} from './municipal-qprs.mjs';
import {DETAIL,fittedViewport,detailAt,intersects,projectedBounds,visibleStates,referenceClass,CLASS_LABELS,includeReference,zoomAt,resolutionFactor,wheelFactor,mapPool} from './map-layers.mjs';
import {initBoroughs} from './boroughs.mjs';
import {initGovernmentAudit} from './government.mjs';
import {initResearch,downloadCSV} from './research.mjs';
import {financialExport} from './research-domain.mjs';
import {MONEY,money,escape as esc,REGIONS,regionFor,albers,geometryPath,summarize,csvCell,isLocal,filterRecords} from './domain.mjs';
const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('en-US'),pretty=s=>String(s||'Unresolved').replaceAll('_',' '),PAGE=50;
let researchUI,municipalUI,meta,geo,data,sources,states,rows=[],sorted=[],page=0,view='map',catalog=null,directoryInventory=null,governmentAuditReady=false,dirRows=[],dirPage=0,request=0,scopeRef=null;
let region='conus',layer='admin',baseBox,box,zoom=1,mapItems=[],selectedRef=null,drag=null,mapGeneration=0;
const files=new Map(),paths=new Map(),stateNames=new Map(),scopeMap=new Map();
async function get(url){if(!files.has(url))files.set(url,fetch(url).then(r=>{if(!r.ok)throw Error(`${url}: HTTP ${r.status}`);return r.json();}));return files.get(url);}
function fail(e){$('error').hidden=false;$('error').textContent=`This data could not be loaded: ${e.message}. Reload to retry. No missing values have been replaced.`;console.error(e);}
function options(id,items,first,keep=true){const el=$(id),previous=el.value;el.innerHTML=(first!==null?`<option value="">${esc(first)}</option>`:'')+items.map(x=>`<option value="${esc(Array.isArray(x)?x[0]:x)}">${esc(Array.isArray(x)?x[1]:x)}</option>`).join('');if(keep&&[...el.options].some(x=>x.value===previous))el.value=previous;}
const debounce=(f,n=180)=>{let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),n);};};
function filters(){return {category:$('research-category').value,q:$('search').value,role:$('role').value,state:$('state').value,type:$('government-type').value,entity:$('entity').value,activityType:$('activity-type').value,grant:$('award').value,cohort:$('cohort').value,from:$('quarter-from').value,to:$('quarter-to').value,scope:$('scope').value,scopeRef};}
const entFor=(a,role=$('role').value)=>meta.entities[role==='responsible'?a.organization_entity:a.admin];
const entityName=a=>entFor(a)?.name||a.organization||'Unresolved identity';
function updateEntityOptions(){const f=filters(),ids=new Set(data.activities.filter(a=>(!f.state||a.state===f.state)).map(a=>f.role==='responsible'?a.organization_entity:a.admin).filter(Boolean));const list=[...ids].map(id=>meta.entities[id]).filter(e=>e&&(!f.type||(f.type==='local'?isLocal(e.type):e.type===f.type))).sort((a,b)=>a.name.localeCompare(b.name));options('entity',list.map(e=>[e.id,e.name+' · '+(stateNames.get(e.state)||e.state)]),'All matching entities');}
const disabledBefore=new Map();
function busy(value){if(value){if(!disabledBefore.size)document.querySelectorAll('input,select,button').forEach(el=>{disabledBefore.set(el,el.disabled);el.disabled=true;});}else{disabledBefore.forEach((was,el)=>el.disabled=was);disabledBefore.clear();}$('finance-controls').setAttribute('aria-busy',String(value));}
async function loadSnapshot(id){const token=++request;busy(true);$('filter-note').textContent='Loading financial rows…';$('export').disabled=true;const sn=meta.snapshots.find(s=>s.id===id);const next=await get('data/'+sn.file);if(token!==request)return;data=next;page=0;scopeRef=null;
 options('award',[...new Set(data.activities.map(a=>a.grant))].sort(),'All awards in snapshot');options('activity-type',[...new Set(data.activities.map(a=>a.type))].sort(),'All activity types');options('quarter-from',data.quarters,'Earliest observed');options('quarter-to',data.quarters,'Latest observed');
 if(id==='texas'&&$('government-type').value==='local'){$('role').value='responsible';layer='responsible';$('map-layer').value=layer;}
 updateEntityOptions();$('headline-count').textContent=`128,382 national records. 6,518 Texas records in a separate snapshot.`;busy(false);refresh();
}
function refresh(){if(!data)return;page=0;const f=filters();rows=filterRecords(data,meta,f);const totals=summarize(rows),awardCount=new Set(rows.map(r=>data.activities[r[0]].grant)).size;const jurisdictionCount=new Set(rows.map(r=>entFor(data.activities[r[0]])?.id).filter(Boolean)).size;
 $('stats').innerHTML=[[fmt(rows.length),'Quarterly records selected'],[`${fmt(jurisdictionCount)} / ${fmt(awardCount)}`,'Matched governments / awards'],[money(totals.sums[0]),'Net obligations · observed quarters'],[money(totals.sums[1]),'Net expenditures · observed quarters']].map(([v,l])=>`<div class="stat"><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join('');
 const sn=meta.snapshots.find(s=>s.id===data.snapshot);$('filter-note').textContent=`${fmt(rows.length)} of ${fmt(data.rows.length)} records · ${f.role==='admin'?'administering grantee':'responsible organization'}${f.type==='local'?' · local-government filter active':''}${scopeRef?' · selected reported scope':''}. ${f.from&&f.to&&f.from>f.to?'The start quarter is after the end quarter.':''}`;
 $('basis-note').textContent=`${sn.label}. ${sn.vintage} Signed quarterly net flows; sums cover observed records only. Snapshots overlap and are never added. ${rows.some(r=>r[9])?'Selection includes an endpoint whose reporting completeness is unverified. ':''}Identity does not establish beneficiary geography.`;
 sortRows();if(view==='map')renderMap().catch(fail);if(view==='research')researchUI?.refreshResearch().catch(fail);
}
function sortRows(){const order=$('sort').value;sorted=[...rows];const index=new Map(data.rows.map((r,i)=>[r,i]));sorted.sort((a,b)=>{let n=0;if(order==='name')n=entityName(data.activities[a[0]]).localeCompare(entityName(data.activities[b[0]]));else if(order.startsWith('expense')){const x=BigInt(a[3]??0),y=BigInt(b[3]??0);n=x<y?-1:x>y?1:0;if(order==='expense-desc')n=-n;}else n=(a[1]-b[1])*(order==='quarter-desc'?-1:1);return n||index.get(a)-index.get(b);});renderRows();}
function renderRows(){const start=page*PAGE,end=Math.min(start+PAGE,sorted.length);$('result-count').textContent=`${fmt(sorted.length)} financial records · ${meta.snapshots.find(s=>s.id===data.snapshot).label}`;
 $('records').innerHTML=sorted.slice(start,end).map((r,j)=>{const a=data.activities[r[0]],e=entFor(a),scope=scopeMap.get(r[12]);return `<tr><td><strong>${esc(e?.name||a.organization||'Unresolved')}</strong><small>${esc(e?pretty(e.type):pretty(a.organization_status))}<br>${esc($('role').selectedOptions[0].textContent)}${scope?'<br>Reported scope: '+esc(scope.area_names.join('; ')):''}</small></td><td><button class="row-link" data-row="${start+j}">${esc(a.grant)}</button><span class="key">${esc(a.number)}</span><small>Project ${esc(a.project)} · ${esc(a.type)}</small></td><td>${esc(data.quarters[r[1]])}${r[9]?'<small>Endpoint flag</small>':''}</td><td class="money">${esc(money(r[2]))}</td><td class="money">${esc(money(r[3]))}</td><td><span class="tag ${scope?'amber':'gray'}">${scope?'Reported scope':'Identity only / unresolved'}</span><small>${scope?esc(scope.area_names.join('; ')):'Beneficiary geography unavailable'}</small></td></tr>`;}).join('');
 $('zero').hidden=!!sorted.length;$('page-info').textContent=sorted.length?`${fmt(start+1)}–${fmt(end)} of ${fmt(sorted.length)} · page ${page+1} of ${Math.ceil(sorted.length/PAGE)}`:'0 records';$('previous').disabled=page===0;$('next').disabled=end>=sorted.length;$('export').disabled=!rows.length;
}
function recordDetail(r){const a=data.activities[r[0]],admin=meta.entities[a.admin],org=meta.entities[a.organization_entity],scope=scopeMap.get(r[12]),sn=meta.snapshots.find(s=>s.id===data.snapshot);const pairs=[['Source snapshot',sn.label],['Original award',a.grant],['Original project',a.project],['Activity identifier',a.number+(a.identifier_redacted?' · surrogate; address-bearing source ID withheld':'')],['Activity type',a.type],['Administering grantee',`${admin?.name||a.admin} · ${pretty(admin?.type)}`],['Responsible organization',a.organization],['Responsible identity match',org?`${org.name} · ${pretty(org.type)}`:pretty(a.organization_status)],['Calendar quarter',data.quarters[r[1]]],['Reporting-period start',data.begins[r[7]]],['Original fiscal label',r[8]],['Disaster label',a.disaster],['Disaster year label',a.disaster_year||'Unavailable'],['Cohort',a.cohort],...MONEY.map((m,i)=>[pretty(m.replace('_cents','')),money(r[i+2])]),['Financial units','Nominal USD; signed quarterly net transactions'],['Missing internal quarters',a.internal_gaps+' · unknown, not zero'],['Endpoint / completeness',r[9]?'Endpoint flagged; completeness unverified':'Reporting completeness unverified'],['Public comparator precision',r[10]?'This row has a documented 10-significant-digit rounding difference':'No flagged difference'],['Source CSV record',r[11]],['Verified initial execution date',a.grant_start||'Unavailable'],['Award-relative calendar quarter',r[13]===null?'Unavailable':'Q'+r[13]],['Requested activity category',a.research_category||'Outside requested 16'],['Compatible local/activity allocation','Unavailable'],['Q4 / Q12 / Q20 ratios','F31 history is unverified; inspect independent documented QPR measurements in Research panel'],['Beneficiary location','Unresolved']];
 $('record-detail').innerHTML=`<p class="eyebrow">FINANCIAL RECORD · ${esc(data.quarters[r[1]])}</p><h2 id="dialog-title">${esc(a.grant)}</h2><dl>${pairs.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${scope?`<p class="notice">Reported scope: ${esc(scope.area_names.join('; '))}. ${esc(scope.note)} <a href="${esc(scope.source_url)}" target="_blank" rel="noopener">Official QPR, page ${scope.source_page}</a>. Status: ${esc(scope.report_status)}.</p>`:''}<p class="fine">${esc(sn.provenance)}</p><p><a href="${esc(meta.sources[data.snapshot]||meta.sources.official_qpr)}" target="_blank" rel="noopener">View documentary source ↗</a></p>`;$('record-dialog').showModal();$('close-dialog').focus();
}
function exportCSV(){downloadCSV(`cdbg-dr-${data.snapshot}-filtered.csv`,financialExport(data,meta,sorted,$('role').value));$('result-count').textContent=`Exported ${fmt(sorted.length)} rows from the ${data.snapshot} snapshot with category, disaster, geography and milestone-status fields. Exact USD cents; missing values blank.`;}

// Display geometry and navigation are independent of financial attribution.
const shapeBounds=new Map(),boundaryFailures=new Map();
let classification=null,boundaryItems=[],boundaryTimer,detailGeneration=0,wheelArmed=false;
function shapePath(feature){const key=region+':'+feature.properties.id;if(!paths.has(key))paths.set(key,geometryPath(feature.geometry,region));return paths.get(key);}
function boundsFor(feature){const key=region+':'+feature.properties.id;if(!shapeBounds.has(key))shapeBounds.set(key,projectedBounds(feature,region));return shapeBounds.get(key);}
function bounds(features){const b=[Infinity,Infinity,-Infinity,-Infinity];for(const f of features){const a=boundsFor(f);b[0]=Math.min(b[0],a[0]);b[1]=Math.min(b[1],a[1]);b[2]=Math.max(b[2],a[2]);b[3]=Math.max(b[3],a[3]);}return b;}
function viewport(){const svg=$('map-svg');return fittedViewport(box,svg.clientWidth||800,svg.clientHeight||480);}
function fit(features){if(!features.length)return;const [x0,y0,x1,y1]=bounds(features),width=Math.max(x1-x0,5000)*1.12,height=Math.max(y1-y0,5000)*1.12;baseBox={cx:(x0+x1)/2,cy:(y0+y1)/2,w:width,h:height};box={...baseBox};zoom=1;applyView();}
function applyView(){
 if(!box||view!=='map')return;
 const svg=$('map-svg'),v=viewport();svg.setAttribute('viewBox',`${v.x0} ${v.y0} ${v.w} ${v.h}`);
 svg.querySelectorAll('.marker').forEach(c=>c.setAttribute('r',String(v.resolution*6)));
 svg.querySelectorAll('.map-label').forEach(t=>t.setAttribute('font-size',String(v.resolution*11)));
 $('map-zoom').textContent=`${v.resolution<=DETAIL.municipality?'Municipal':v.resolution<=DETAIL.county?'County':'Regional'} detail · ${(v.resolution/1000).toFixed(2)} km/pixel`;
 const detail=detailAt(v.resolution);
 for(const [id,show] of [['county-layer',detail.county],['county-outlines',detail.county],['municipality-layer',detail.municipality],['subdivision-layer',detail.municipality&&layer==='cousub']]){
  const g=$(id);if(g)g.style.display=show?'':'none';
 }
 clearTimeout(boundaryTimer);++detailGeneration;
 boundaryTimer=setTimeout(()=>refreshBoundaries().catch(fail),120);
}
function zoomMap(factor,anchor){if(!box)return;const svg=$('map-svg'),b=bounds(states.features.filter(f=>regionFor(f.properties.state)===region)),home=fittedViewport({cx:0,cy:0,w:(b[2]-b[0])*1.12,h:(b[3]-b[1])*1.12},svg.clientWidth,svg.clientHeight);factor=resolutionFactor(viewport().resolution,factor,20,home.resolution*1.8);const next=zoomAt(box,zoom,factor,anchor,svg.clientWidth,svg.clientHeight);box=next.box;zoom=next.zoom;applyView();}
function pan(direction){if(!box)return;const v=viewport();box.cx+=({left:-1,right:1}[direction]||0)*v.w*.22;box.cy+=({up:-1,down:1}[direction]||0)*v.h*.22;applyView();}
function zoomToDetail(kind){if(!box)return;const target=DETAIL[kind]*.85;zoomMap(Math.max(1,viewport().resolution/target));}
function setWheelArmed(value){wheelArmed=value;$('map-wheel').setAttribute('aria-pressed',String(value));$('map-wheel').textContent=value?'Wheel zoom on':'Select map for wheel zoom';$('map-interaction').textContent=value?'Map selected: scroll to zoom at the pointer. Escape or click outside the map to return to page scrolling.':'Click or keyboard-focus the map to enable wheel zoom. Page scrolling stays available outside the map.';$('map-frame').classList.toggle('wheel-active',value);}
async function ensureCatalog(){if(!catalog){$('directory-count').textContent='Loading the nationwide subunit inventory…';catalog=(await get('data/geo/catalog.json')).rows;}return catalog;}
function selection(html){$('selection-detail').hidden=!html;$('selection-detail').innerHTML=html||'';}
function selectEntity(id){const e=meta.entities[id];$('role').value=layer==='responsible'?'responsible':'admin';$('government-type').value='';$('state').value='';updateEntityOptions();$('entity').value=id;scopeRef=null;refresh();selection(`<strong>${esc(e.name)}</strong><p>${esc(pretty(e.type))}. Government reference area: ${esc(e.reference||'unresolved')}; identity source vintage ${esc(e.reference_vintage||'unavailable')}. This selection filters associated financial records and does not establish beneficiary location.</p><a href="#data">Open selected financial rows ↗</a>`);}
async function selectReference(id,fromDirectory=false){
 const cat=await ensureCatalog(),r=cat.find(x=>x[0]===id);if(!r)return;selectedRef=id;
 const matching=Object.values(meta.entities).filter(e=>e.reference===id),scopeMatches=meta.scope_evidence.filter(e=>e.references.includes(id));
 const className=r[2]==='place'&&classification?CLASS_LABELS[classification.places[r[4]]?.[1]]:pretty(r[8]);
 selection(`<strong>${esc(r[1])}</strong><p>${esc(className)} · ${esc(r[2])} ${esc(r[4])} · reference vintage ${esc(r[7])}. A boundary is not a funded activity. This selection alone does not filter financial records.</p>${matching.length?`<p>Documented government-identity links: ${matching.length}.</p>${matching.slice(0,8).map(e=>`<button data-reference-entity="${esc(e.id)}" data-relationship="${data.activities.some(a=>a.admin===e.id)?'admin':'responsible'}">${data.activities.some(a=>a.admin===e.id)?'Administering grantee':'Responsible organization'}: ${esc(e.name)}</button>`).join('')}`:'<p>No matched government identity is available in this financial panel.</p>'}${scopeMatches.length?`<button data-scope-reference="${esc(id)}">Show records with this reported scope</button>`:''}`);
 if(fromDirectory){
  layer=r[2]==='cousub'?'cousub':'reference';$('map-layer').value=layer;$('boundary-state').value=r[3];region=regionFor(r[3]);$('map-region').value=region;view='map';location.hash='map';
  const fc=r[2]==='state'?states:await get(`data/geo/${r[2]}-${r[3]}.json`);
  await renderMap(true);fit(fc.features.filter(f=>f.properties.id===id));await refreshBoundaries();
 }else await renderMap();
}
function boundaryPath(f){const type=referenceClass(f,classification);return `<path class="reference-shape ${type} ${selectedRef===f.properties.id?'selected':''}" data-ref="${esc(f.properties.id)}" data-reference-class="${type}" d="${shapePath(f)}"><title>${esc(f.properties.name)} · ${esc(CLASS_LABELS[type])} · ${esc(f.properties.geoid)} · reference only</title></path>`;}
function renderMapList(){
 if(!box)return;const v=viewport(),q=$('map-list-search').value.toLowerCase().trim(),kind=$('map-list-kind').value;
 const markers=mapItems.filter(x=>{if(!x.point)return false;const p=albers(...x.point,region);return intersects([p[0],p[1],p[0],p[1]],v);});
 const all=[...markers,...boundaryItems],filtered=all.filter(x=>(!q||`${x.name} ${x.id}`.toLowerCase().includes(q))&&(!kind||(kind==='entity'?x.kind!=='reference':x.referenceClass===kind)));
 const list=filtered.slice(0,200);
 $('map-list-count').textContent=`${fmt(filtered.length)} visible references match · ${fmt(list.length)} listed. Search by name or GEOID to narrow the list.`;
 $('map-list').innerHTML=list.map(x=>`<button data-list-id="${esc(x.id)}" data-kind="${x.kind}"><strong>${esc(x.name)}</strong><small>${esc(x.kind==='reference'?CLASS_LABELS[x.referenceClass]:x.kind==='scope'?'Reported scope':'Government identity')} · ${esc(x.id)}</small></button>`).join('')+(!list.length?'<p class="fine">No visible references match. Zoom or pan, clear the list search, or use All subunits for the full inventory.</p>':'');
}
async function boundaryFile(url){
 if(boundaryFailures.has(url))return null;
 try{return await get(url);}catch(e){boundaryFailures.set(url,e.message);return null;}
}
async function refreshBoundaries(){
 clearTimeout(boundaryTimer);if(!box||view!=='map'||!$('county-layer'))return;
 const generation=++detailGeneration,mapToken=mapGeneration,v=viewport(),detail=detailAt(v.resolution),currentRegion=region;
 const relevant=visibleStates(states.features,region,v,boundsFor),stale=()=>generation!==detailGeneration||mapToken!==mapGeneration||currentRegion!==region||view!=='map';
 const tasks=[];for(const f of relevant){const st=f.properties.state;if(detail.county)tasks.push(['county',st]);if(detail.municipality){tasks.push(['place',st],['concity',st]);if(layer==='cousub')tasks.push(['cousub',st]);}}
 $('boundary-status').textContent=tasks.length?'Loading nearby reference boundaries…':'States shown. Zoom in for counties, then municipalities.';
 $('map-svg').setAttribute('aria-busy',String(tasks.length>0));
 if(detail.municipality&&!classification)classification=await boundaryFile('data/geo/place-classification.json');
 const collected=await mapPool(tasks,async([kind,st])=>{if(stale())return [];const fc=await boundaryFile(`data/geo/${kind}-${st}.json`);if(stale()||!fc)return [];return fc.features.filter(f=>intersects(boundsFor(f),v,.02)&&includeReference(f,classification,$('map-statistical').checked,selectedRef));});
 if(stale())return;
 const features=collected.flat(),byType={county:[],place:[],concity:[],cousub:[]};for(const f of features)byType[f.properties.kind]?.push(f);
 $('county-layer').innerHTML=byType.county.map(boundaryPath).join('');
 $('county-outlines').innerHTML=byType.county.map(f=>`<path class="county-outline ${selectedRef===f.properties.id?'selected':''}" d="${shapePath(f)}"/>`).join('');
 // Consolidated-city outlines precede ordinary places; they remain independently selectable in the list.
 $('municipality-layer').innerHTML=[...byType.concity,...byType.place].map(boundaryPath).join('');
 $('subdivision-layer').innerHTML=byType.cousub.map(boundaryPath).join('');
 const selected=features.find(f=>f.properties.id===selectedRef),labels=[];
 if(selected){const b=boundsFor(selected);labels.push(`<text class="map-label" x="${(b[0]+b[2])/2}" y="${(b[1]+b[3])/2}" font-size="${v.resolution*11}" text-anchor="middle">${esc(selected.properties.name)}</text>`);}
 $('map-labels').innerHTML=labels.join('');
 boundaryItems=[...relevant,...features].map(f=>({id:f.properties.id,name:f.properties.name,kind:'reference',referenceClass:referenceClass(f,classification)}));
 const municipalities=features.filter(f=>['municipal','consolidated'].includes(referenceClass(f,classification))).length,other=byType.place.length+byType.concity.length-municipalities;
 $('boundary-status').textContent=`${fmt(byType.county.length)} county/equivalent boundaries${detail.county?' in view':' · zoom in to reveal'}; ${fmt(municipalities)} municipal/consolidated-city references${detail.municipality?' in view':' · appear at closer zoom'}${other?`; ${fmt(other)} statistical/balance/unclassified references`:''}${byType.cousub.length?`; ${fmt(byType.cousub.length)} subdivisions`:''}. Reference outlines imply no funding.${detail.municipality&&!municipalities?' No municipal place boundaries intersect this view in the loaded source; some towns are county subdivisions.':''}`;
 const failed=[...boundaryFailures].filter(([url])=>url.includes('classification')||tasks.some(([kind,st])=>url.endsWith(`${kind}-${st}.json`)));
 $('boundary-error').hidden=!failed.length;$('boundary-error-text').textContent=failed.length?`${failed.length} boundary source file(s) unavailable. Display coverage is incomplete, not zero: ${failed.map(([url])=>url.split('/').pop()).join(', ')}.`:'';
 if(failed.length)$('boundary-status').textContent+=' Some source files could not load; see the boundary warning.';
 $('map-svg').setAttribute('aria-busy','false');renderMapList();
}
async function renderMap(reset=false){
 if(!data||!states||view!=='map')return;const generation=++mapGeneration;++detailGeneration;clearTimeout(boundaryTimer);
 const localStates=states.features.filter(f=>regionFor(f.properties.state)===region),svg=$('map-svg');mapItems=[];boundaryItems=[];
 if(layer==='admin'||layer==='responsible'){
  const ids=new Set(rows.map(r=>{const a=data.activities[r[0]];return layer==='admin'?a.admin:a.organization_entity;}).filter(Boolean));
  mapItems=[...ids].map(id=>meta.entities[id]).filter(e=>e?.point&&regionFor(e.state)===region).map(e=>({id:e.id,name:e.name,point:e.point,kind:'entity'}));
 }else if(layer==='scope'){
  const cat=await ensureCatalog(),lookup=new Map(cat.map(r=>[r[0],r]));if(generation!==mapGeneration)return;
  const ids=new Set(rows.flatMap(r=>scopeMap.get(r[12])?.references||[]));
  mapItems=[...ids].map(id=>lookup.get(id)).filter(r=>r&&Number.isFinite(r[5])&&regionFor(r[3])===region).map(r=>({id:r[0],name:r[1],point:[r[5],r[6]],kind:'scope'}));
 }
 const bg=localStates.map(f=>`<path class="state ${selectedRef===f.properties.id?'selected':''}" data-ref="${esc(f.properties.id)}" d="${shapePath(f)}"><title>${esc(f.properties.name)} · state / territory reference boundary</title></path>`).join('');
 const outlines=localStates.map(f=>`<path class="state-outline" d="${shapePath(f)}"/>`).join('');
 const markers=mapItems.map(x=>{const [x1,y1]=albers(...x.point,region);return `<circle class="marker ${x.kind==='scope'?'scope-marker':''} ${$('entity').value===x.id?'selected':''}" cx="${x1}" cy="${y1}" r="12000" data-marker="${esc(x.id)}"><title>${esc(x.name)} · ${x.kind==='scope'?'reported activity scope':'government identity reference'}</title></circle>`;}).join('');
 svg.innerHTML=`<title id="map-title">${esc(REGIONS[region].name)} · unified reference map</title><desc id="map-desc">States, counties and municipalities appear together as you zoom. Boundaries are reference geography, not funded locations. Financial overlay: ${esc($('map-layer').selectedOptions[0].textContent)}. Equivalent selection is available in the searchable visible-reference list.</desc>${bg}<g id="county-layer"></g><g id="subdivision-layer"></g><g id="municipality-layer"></g><g id="county-outlines"></g>${outlines}<g id="map-labels"></g><g id="financial-markers">${markers}</g>`;
 if(!box||reset){const st=$('boundary-state').value,focus=localStates.filter(f=>f.properties.state===st);fit(focus.length?focus:localStates);}else applyView();
 $('map-empty').hidden=true;
 $('map-status').textContent=`${fmt(mapItems.length)} ${layer==='scope'?'reported area references; no allocation weights':'government identity references'} in ${REGIONS[region].name}. ${fmt(rows.length)} financial records in current filters. ${layer==='beneficiary'?'No beneficiary locations released; only reference boundaries are shown.':!mapItems.length&&['admin','responsible','scope'].includes(layer)?'No matching mapped references in this region; unresolved records remain in the table.':layer==='reference'||layer==='cousub'?'Reference boundaries only; no financial overlay.':''}`;
 $('projection-note').textContent=`2025 Census land-clipped cartographic boundaries · ${REGIONS[region].name} Albers equal-area conic · parallels ${REGIONS[region].parallels.join('° / ')}°; central meridian ${REGIONS[region].lon}°. Simplified display geometry; not for spatial analysis. Municipal place labels describe Census geography, not active-government status. Some towns are in the optional subdivision layer.`;
 await refreshBoundaries();
}

function wireMap(){
 const svg=$('map-svg'),card=$('map-card');
 $('map-layer').addEventListener('change',()=>{
  layer=$('map-layer').value;selectedRef=null;selection('');
  if(layer==='scope'){$('scope').value='reported';$('government-type').value='';$('entity').value='';updateEntityOptions();refresh();}
  else if(['admin','responsible'].includes(layer)){$('role').value=layer;$('entity').value='';updateEntityOptions();refresh();}
  renderMap().catch(fail);
 });
 $('map-region').addEventListener('change',()=>{region=$('map-region').value;$('boundary-state').value='';selectedRef=null;selection('');renderMap(true).catch(fail);});
 $('boundary-state').addEventListener('change',()=>{const st=$('boundary-state').value;if(st){region=regionFor(st);$('map-region').value=region;}selectedRef=null;selection('');renderMap(true).catch(fail);});
 $('map-statistical').addEventListener('change',()=>refreshBoundaries().catch(fail));
 $('zoom-in').addEventListener('click',()=>zoomMap(1.45));$('zoom-out').addEventListener('click',()=>zoomMap(1/1.45));
 document.querySelectorAll('[data-pan]').forEach(b=>b.addEventListener('click',()=>pan(b.dataset.pan)));
 const reset=()=>{$('boundary-state').value='';selectedRef=null;selection('');renderMap(true).catch(fail);};
 $('map-reset').addEventListener('click',reset);
 $('show-counties').addEventListener('click',()=>zoomToDetail('county'));$('show-cities').addEventListener('click',()=>zoomToDetail('municipality'));
 $('map-wheel').addEventListener('click',()=>setWheelArmed(!wheelArmed));
 svg.addEventListener('focus',()=>setWheelArmed(true));
 document.addEventListener('pointerdown',e=>{if(!card.contains(e.target))setWheelArmed(false);},true);
 document.addEventListener('focusin',e=>{if(!card.contains(e.target))setWheelArmed(false);});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){setWheelArmed(false);e.preventDefault();}});
 svg.addEventListener('keydown',e=>{
  const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];
  if(direction){e.preventDefault();pan(direction);}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0')reset();else zoomMap(e.key==='-'?1/1.45:1.45);}
 });
 svg.addEventListener('pointerdown',e=>{if(e.button!==0||!box)return;svg.focus({preventScroll:true});setWheelArmed(true);const v=viewport();drag={x:e.clientX,y:e.clientY,cx:box.cx,cy:box.cy,w:v.w,h:v.h,moved:false};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.moved=true;box.cx=drag.cx-dx/svg.clientWidth*drag.w;box.cy=drag.cy-dy/svg.clientHeight*drag.h;applyView();});
 svg.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;svg.classList.remove('dragging');if(moved)return;const t=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-marker],[data-ref]');if(t?.dataset.marker){if(layer==='scope'){scopeRef=t.dataset.marker;$('scope').value='reported';refresh();selectReference(scopeRef).catch(fail);}else selectEntity(t.dataset.marker);}else if(t?.dataset.ref)selectReference(t.dataset.ref).catch(fail);});
 svg.addEventListener('pointercancel',()=>{drag=null;svg.classList.remove('dragging');});
 svg.addEventListener('wheel',e=>{const factor=wheelFactor(e,wheelArmed,svg.clientHeight);if(factor===null)return;e.preventDefault();const r=svg.getBoundingClientRect();zoomMap(factor,{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});},{passive:false});
 new ResizeObserver(applyView).observe(svg);
 $('map-list-search').addEventListener('input',debounce(renderMapList));$('map-list-kind').addEventListener('change',renderMapList);
 $('boundary-retry').addEventListener('click',()=>{for(const url of boundaryFailures.keys())files.delete(url);boundaryFailures.clear();refreshBoundaries().catch(fail);});
 $('map-list').addEventListener('click',e=>{const b=e.target.closest('[data-list-id]');if(!b)return;if(b.dataset.kind==='entity')selectEntity(b.dataset.listId);else if(b.dataset.kind==='scope'){scopeRef=b.dataset.listId;$('scope').value='reported';refresh();selectReference(scopeRef).catch(fail);}else selectReference(b.dataset.listId).catch(fail);});
 $('selection-detail').addEventListener('click',e=>{const entity=e.target.closest('[data-reference-entity]'),scope=e.target.closest('[data-scope-reference]');if(entity){layer=entity.dataset.relationship;$('map-layer').value=layer;selectEntity(entity.dataset.referenceEntity);}if(scope){scopeRef=scope.dataset.scopeReference;for(const id of ['government-type','entity','state'])$(id).value='';$('scope').value='reported';refresh();location.hash='data';}});
}

async function showDirectory(){await ensureCatalog();directoryInventory??=await get('data/government-inventory-2026.json');filterDirectory();if(!governmentAuditReady){governmentAuditReady=true;await initGovernmentAudit(get);}}
function filterDirectory(){if(!catalog||!directoryInventory){$('directory-count').textContent='Loading government listing…';return;}dirPage=0;const q=$('directory-search').value.toLowerCase().trim(),kind=$('directory-kind').value,st=$('directory-state').value,type=$('directory-government').value;const vintage=$('directory-vintage').value,referenceRows=vintage==='2026'?[...catalog.filter(r=>r[2]!=='government'),...directoryInventory.rows]:catalog;dirRows=referenceRows.filter(r=>(!q||`${r[1]} ${r[4]} ${r[0]}`.toLowerCase().includes(q))&&(!kind||r[2]===kind)&&(!st||r[3]===st)&&(!type||(r[2]==='government'&&String(r[8]).toUpperCase().includes(type))));dirRows.sort((a,b)=>a[1].localeCompare(b[1])||a[0].localeCompare(b[0]));renderDirectory();}
function renderDirectory(){const start=dirPage*PAGE,end=Math.min(start+PAGE,dirRows.length);$('directory-count').textContent=`${fmt(dirRows.length)} reference entries · 2025 geography: 3,235 counties/parishes, 32,629 places, 36,360 subdivisions, 8 consolidated cities and 56 states/territories. ${$('directory-vintage').value==='2026'?'2026 listing: 91,729 independent governments + 1,323 dependent schools + 4,338 pensions.':'2022 listing: 90,837 independent governments + 1,313 dependent schools.'} Layers and vintages overlap; government listing covers 50 states and DC.`;
 $('directory-rows').innerHTML=dirRows.slice(start,end).map(r=>`<tr><td><strong>${esc(r[1])}</strong></td><td>${esc(pretty(r[8]))}<small>${esc(r[2])}${r[2]==='government'?' · '+esc(r[9]?pretty(r[9]):'Function not applicable / not supplied')+' · active: '+esc(r[10]):''}</small></td><td class="key">${esc(r[4])}</td><td>${esc(stateNames.get(r[3])||r[3])}</td><td>${esc(r[7])}</td><td>${r[2]==='government'?'<small>Service-area geometry unavailable</small>':`<button data-directory-ref="${esc(r[0])}">View boundary</button>`}</td></tr>`).join('')||'<tr><td colspan="6">No reference entries match these filters.</td></tr>';
 $('directory-page').textContent=dirRows.length?`${fmt(start+1)}–${fmt(end)} of ${fmt(dirRows.length)}`:'0 entries';$('directory-previous').disabled=dirPage===0;$('directory-next').disabled=end>=dirRows.length;
}
function renderSources(){const q=$('source-search').value.toLowerCase();$('sources-list').innerHTML=sources.filter(s=>JSON.stringify(s).toLowerCase().includes(q)).map(s=>`<article class="card"><span class="tag">${esc(s.category)} · ${esc(s.status)}</span><h3><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a></h3><p>${esc(s.availability)}</p><p class="facts"><b>Unit:</b> ${esc(s.unit)}<br><b>Vintage:</b> ${esc(s.vintage)}<br><b>Definition:</b> ${esc(s.definition)}<br><b>Missingness:</b> ${esc(s.missingness)}<br><b>Join:</b> ${esc(s.linkage)}<br><b>Release basis:</b> ${esc(s.rights)}</p></article>`).join('')||'<p>No sources match this search.</p>';}
async function showView(){const v=location.hash.slice(1);view=['map','data','directory','sources','readiness','research','context','downloads','analysis','boroughs','municipal-qprs'].includes(v)?v:'map';document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==view);$('finance-controls').hidden=!['map','data','research'].includes(view);document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.dataset.view===view?'page':'false'));if(view!=='map'){setWheelArmed(false);++detailGeneration;clearTimeout(boundaryTimer);}if(view==='municipal-qprs')await municipalUI?.open();if(view==='directory')await showDirectory();if(view==='map')await renderMap();if(view==='sources')renderSources();if(view==='research')await researchUI?.refreshResearch();if(view==='context')await researchUI?.filterContext();}
function wire(){window.addEventListener('hashchange',()=>showView().catch(fail));$('search').addEventListener('input',debounce(()=>{scopeRef=null;refresh();}));for(const id of ['state','government-type','entity','award','activity-type','research-category','cohort','quarter-from','quarter-to','scope'])$(id).addEventListener('change',()=>{scopeRef=null;if(['state','government-type'].includes(id))updateEntityOptions();refresh();});$('role').addEventListener('change',()=>{layer=$('role').value;$('map-layer').value=layer;$('entity').value='';updateEntityOptions();refresh();});$('snapshot').addEventListener('change',()=>loadSnapshot($('snapshot').value).catch(fail));$('reset').addEventListener('click',()=>{for(const id of ['search','state','government-type','entity','award','activity-type','research-category','cohort','quarter-from','quarter-to','scope'])$(id).value='';scopeRef=null;selectedRef=null;selection('');updateEntityOptions();refresh();});$('sort').addEventListener('change',()=>{page=0;sortRows();});$('previous').addEventListener('click',()=>{page--;renderRows();});$('next').addEventListener('click',()=>{page++;renderRows();});$('records').addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b)recordDetail(sorted[Number(b.dataset.row)]);});$('close-dialog').addEventListener('click',()=>$('record-dialog').close());$('export').addEventListener('click',exportCSV);
 wireMap();
 $('directory-search').addEventListener('input',debounce(filterDirectory));for(const id of ['directory-kind','directory-state','directory-government','directory-vintage'])$(id).addEventListener('change',filterDirectory);$('directory-previous').addEventListener('click',()=>{dirPage--;renderDirectory();});$('directory-next').addEventListener('click',()=>{dirPage++;renderDirectory();});$('directory-rows').addEventListener('click',e=>{const b=e.target.closest('[data-directory-ref]');if(b)selectReference(b.dataset.directoryRef,true).catch(fail);});$('source-search').addEventListener('input',debounce(renderSources));
}
async function init(){busy(true);[meta,geo,states,sources]=await Promise.all([get('data/finance-meta.json'),get('data/geo/manifest.json'),get('data/geo/states.json'),get('data/sources.json')]);geo.states.forEach(s=>stateNames.set(s.id,s.name));meta.scope_evidence.forEach(s=>scopeMap.set(s.id,s));options('snapshot',meta.snapshots.map(s=>[s.id,s.label]),null);const stateOptions=geo.states.map(s=>[s.id,s.name]);for(const id of ['state','directory-state'])options(id,stateOptions,'All states & territories');options('boundary-state',stateOptions,'Whole selected region');options('map-region',Object.entries(REGIONS).map(([id,p])=>[id,p.name]),null);options('government-type',[['local','Local governments'],...[...new Set(Object.values(meta.entities).map(e=>e.type))].sort().map(t=>[t,pretty(t)])],'All types');$('government-type').value='local';
 $('source-proof').innerHTML=`<p>The national panel contains ${fmt(meta.snapshots[0].records)} records and ${fmt(meta.snapshots[0].awards)} awards. Seven public financial chunks and their dictionary matched the inspected archive byte for byte at commit <code>0531f22</code>. All original row keys and five monetary fields reconcile, including 119 rows / 157 cells with source precision differences (maximum $0.41).</p><p>The separate Texas panel has ${fmt(meta.snapshots[1].records)} records and two Harvey awards. Overlapping historical records remain versioned: 158 shared keys differ, including 150 material differences in the 2025Q1 endpoint. Neither snapshot silently replaces the other.</p><p>${fmt(meta.scope_evidence.length)} official QPR activity scopes are linked by exact award, activity and 2024Q4. Report status: Submitted — Await for Review. No award execution dates are derived from these reports.</p><p>Sixteen address-bearing housing activity identifiers use stable surrogate IDs. Their financial rows are retained; no narratives, household characteristics or residential locations are released.</p><p><a href="data/finance-national.json" download>National financial JSON ↓</a> · <a href="data/finance-texas.json" download>Texas financial JSON ↓</a> · <a href="data/finance-meta.json" download>Definitions & identity metadata ↓</a></p>`;
 researchUI=await initResearch({meta,get,getData:()=>data,getRows:()=>rows,getFilters:filters,stateNames,selectReference,fail});municipalUI=initMunicipalQprs(get,fail);
 await initBoroughs(get);wire();await loadSnapshot('national');await showView();}
init().catch(fail);
