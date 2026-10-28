import {catalogReferenceMarkup} from './document-reference.mjs';
import {geometryPath,albers,money,escape as esc} from './domain.mjs';
import {objectsCSV} from './research-domain.mjs';
const $=id=>document.getElementById(id),human=s=>s.replaceAll('_',' ');
export function filterBoroughRecords(records,{query='',horizon='',scope='',borough='',approval=''}={}){
 const q=query.trim().toLowerCase();return records.filter(r=>(!q||[r.grant,r.project,r.activity,r.source_activity_type,r.scope_status,...r.boroughs].join(' ').toLowerCase().includes(q))&&(!horizon||String(r.award_relative_quarter)===horizon)&&(!scope||r.scope_status===scope)&&(!borough||r.boroughs.includes(borough))&&(!approval||r.report_status===approval));
}
export async function initBoroughs(get){
 const [data,geo]=await Promise.all([get('data/nyc-borough-evidence.json'),get('data/geo/county-36.json')]);
 const names=Object.keys(data.boroughs),byCode=new Map(Object.entries(data.boroughs).map(([n,g])=>[g,n])),features=geo.features.filter(f=>byCode.has(f.properties.geoid));
 if(features.length!==5)throw Error('NYC borough boundary set must contain five verified county equivalents');
 let rows=[],page=0,zoom=1,drag=null;const svg=$('borough-map');let points=[];
 const walk=c=>{if(typeof c[0]==='number')points.push(albers(c[0],c[1],'conus'));else c.forEach(walk);};features.forEach(f=>walk(f.geometry.coordinates));
 const xx=points.map(x=>x[0]),yy=points.map(x=>x[1]),x0=Math.min(...xx),x1=Math.max(...xx),y0=Math.min(...yy),y1=Math.max(...yy),base={x:(x0+x1)/2,y:(y0+y1)/2,w:(x1-x0)*1.18,h:(y1-y0)*1.18};let center={x:base.x,y:base.y};
 function viewport(){svg.setAttribute('viewBox',`${center.x-base.w/zoom/2} ${center.y-base.h/zoom/2} ${base.w/zoom} ${base.h/zoom}`);$('borough-zoom').textContent=zoom.toFixed(1)+'×';}
 function zoomBy(n){zoom=Math.min(10,Math.max(1,zoom*n));viewport();}
 function pan(x,y){center.x+=x*base.w/zoom*.16;center.y+=y*base.h/zoom*.16;viewport();}
 function select(name){$('borough-select').value=$('borough-select').value===name?'':name;refresh();}
 function filters(){return {query:$('borough-search').value,horizon:$('borough-horizon').value,scope:$('borough-scope').value,borough:$('borough-select').value,approval:$('borough-approval').value};}
 function render(){
  const show=rows.slice(page*40,page*40+40);$('borough-count').textContent=`${rows.length.toLocaleString()} source activity records · independent QPR periods; no financial totals across periods or boroughs.`;
  $('borough-rows').innerHTML=show.map(r=>`<tr><td><strong>${esc(r.activity)}</strong><small>${esc(r.project)} · ${esc(r.source_activity_type||'Category unresolved')}</small>${r.activity_flags?.length?`<small class="notice">${esc(r.activity_flags.map(human).join('; '))}</small>`:''}</td><td>${esc(r.calendar_quarter)} · Q${r.award_relative_quarter}<small>${esc(r.report_status)}</small></td><td>${esc(human(r.scope_status))}<small>${esc(r.boroughs.join('; ')||'No borough assigned')}</small><small>${esc(r.scope_reason)}</small></td><td>${money(r.cumulative_expended_cents)}<small>Period: ${money(r.period_expended_cents)}</small></td><td>${money(r.cumulative_obligated_cents)}<small>Activity budget: ${money(r.cumulative_allocated_activity_budget_cents)}</small></td><td><a href="${esc(r.source_url)}#page=${r.location_source_page}" target="_blank" rel="noopener">QPR p. ${r.location_source_page} ↗</a>${catalogReferenceMarkup(r.source_url)}<small>Financial p. ${r.financial_source_pages.expended}; exact F31 activity / quarter: ${r.f31_same_quarter_key_match?'yes':'no'}</small></td></tr>`).join('')||'<tr><td colspan="6">No records match. Citywide records have no assigned borough; clear the borough filter to view them.</td></tr>';
  $('borough-page').textContent=rows.length?`${page*40+1}–${Math.min(page*40+40,rows.length)} of ${rows.length}`:'0 results';$('borough-prev').disabled=page===0;$('borough-next').disabled=(page+1)*40>=rows.length;$('borough-export').disabled=!rows.length;
  const chosen=$('borough-select').value;svg.innerHTML='<title>New York City borough references</title><desc>Five Census 2025 land-clipped county equivalents in Albers projection. Choose a borough to filter explicit source scopes. Equal colors do not show money. The adjacent buttons and table offer the same selection.</desc>'+features.map(f=>{const n=byCode.get(f.properties.geoid),has=rows.some(r=>r.boroughs.includes(n));return `<path d="${geometryPath(f.geometry,'conus')}" data-borough="${esc(n)}" class="borough-shape ${chosen===n?'selected':has?'has-evidence':''}" vector-effect="non-scaling-stroke"><title>${esc(n)} · ${f.properties.geoid}</title></path>`;}).join('');
  $('borough-buttons').innerHTML=names.map(n=>`<button data-borough="${esc(n)}" aria-pressed="${chosen===n}">${esc(n)} <span>${rows.filter(r=>r.boroughs.includes(n)).length} records</span></button>`).join('');viewport();
 }
 function refresh(){rows=filterBoroughRecords(data.records,filters());page=0;render();}
 $('borough-select').insertAdjacentHTML('beforeend',names.map(n=>`<option>${esc(n)}</option>`).join(''));
 $('borough-summary').textContent=`${data.coverage.records} activities in three reviewed NYC Sandy reports: ${data.coverage.named_borough} named borough, ${data.coverage.multiple_boroughs} multi-borough, ${data.coverage.citywide} citywide and ${data.coverage.unknown} unresolved. This is one award at Q4/Q12/Q20, not all NYC awards or quarters.`;
 $('borough-search').addEventListener('input',refresh);for(const id of ['borough-horizon','borough-scope','borough-select','borough-approval'])$(id).addEventListener('change',refresh);
 $('borough-prev').onclick=()=>{page--;render();};$('borough-next').onclick=()=>{page++;render();};$('borough-clear').onclick=()=>{for(const id of ['borough-search','borough-horizon','borough-scope','borough-select','borough-approval'])$(id).value='';refresh();};
 $('borough-export').onclick=()=>{const u=URL.createObjectURL(new Blob([objectsCSV(rows)],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='nyc-qpr-borough-filtered.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);};
 $('borough-buttons').onclick=e=>{const b=e.target.closest('[data-borough]');if(b)select(b.dataset.borough);};$('borough-in').onclick=()=>zoomBy(1.45);$('borough-out').onclick=()=>zoomBy(1/1.45);$('borough-home').onclick=()=>{zoom=1;center={x:base.x,y:base.y};viewport();};
 for(const [id,x,y] of [['borough-west',-1,0],['borough-east',1,0],['borough-north',0,-1],['borough-south',0,1]])$(id).onclick=()=>pan(x,y);
 svg.addEventListener('keydown',e=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(d){e.preventDefault();pan(...d);}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0')$('borough-home').click();else zoomBy(e.key==='-'?1/1.45:1.45);}});
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,cx:center.x,cy:center.y,moved:false,borough:e.target.dataset.borough};svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.moved=true;center.x=drag.cx-dx/svg.clientWidth*base.w/zoom;center.y=drag.cy-dy/svg.clientHeight*base.h/zoom;viewport();});
 svg.addEventListener('pointerup',()=>{const d=drag;drag=null;if(d&&!d.moved&&d.borough)select(d.borough);});svg.addEventListener('pointercancel',()=>{drag=null;});
 refresh();return {refresh};
}
