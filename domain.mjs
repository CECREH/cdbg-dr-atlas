export const MONEY=['obligated_cents','expended_cents','disbursed_cents','program_income_disbursed_cents','program_income_received_cents'];
export const money=v=>{if(v===null||v===undefined)return 'Unavailable';const n=BigInt(v),a=n<0n?-n:n;return `${n<0n?'−':''}$${(a/100n).toLocaleString('en-US')}.${String(a%100n).padStart(2,'0')}`;};
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const regionFor=s=>({'02':'alaska','15':'hawaii','60':'samoa','66':'pacific','69':'pacific','72':'caribbean','78':'caribbean'}[s]||'conus');
export const REGIONS={conus:{name:'Contiguous U.S.',lon:-96,lat:37.5,parallels:[29.5,45.5]},alaska:{name:'Alaska',lon:-154,lat:62,parallels:[55,65]},hawaii:{name:'Hawaii',lon:-157,lat:20.5,parallels:[8,18]},caribbean:{name:'Puerto Rico & U.S. Virgin Islands',lon:-66,lat:18,parallels:[10,20]},pacific:{name:'Guam & Northern Mariana Islands',lon:145,lat:16,parallels:[8,20]},samoa:{name:'American Samoa',lon:-170,lat:-14,parallels:[-8,-20]}};
// Spherical Albers equal-area conic, metres, used exclusively for cartographic display.
export function albers(lon,lat,region='conus'){
 const p=REGIONS[region],d=Math.PI/180,phi1=p.parallels[0]*d,phi2=p.parallels[1]*d,n=(Math.sin(phi1)+Math.sin(phi2))/2,C=Math.cos(phi1)**2+2*n*Math.sin(phi1);
 let dl=lon-p.lon;while(dl>180)dl-=360;while(dl< -180)dl+=360;
 const rho=Math.sqrt(C-2*n*Math.sin(lat*d))/n,rho0=Math.sqrt(C-2*n*Math.sin(p.lat*d))/n,t=n*dl*d;
 return [6371008.8*rho*Math.sin(t),-6371008.8*(rho0-rho*Math.cos(t))];
}
export function geometryPath(geometry,region){
 const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
 return polygons.map(poly=>poly.map(ring=>{let points=[];for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];let dx=b[0]-a[0];if(dx>180)dx-=360;if(dx< -180)dx+=360;
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(b[1]-a[1]))/.3));
  for(let j=0;j<steps;j++)points.push(albers(a[0]+dx*j/steps,a[1]+(b[1]-a[1])*j/steps,region));
 }return points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('')+'Z';}).join('')).join('');
}
export function summarize(rows){const sums=MONEY.map(()=>0n),missing=MONEY.map(()=>0);for(const r of rows)for(let j=0;j<5;j++){if(r[j+2]===null)missing[j]++;else sums[j]+=BigInt(r[j+2]);}return {sums:sums.map(String),missing};}
export function csvCell(v){return '"'+String(v??'').replaceAll('"','""')+'"';}
export function isLocal(t){return /municipal|county|parish|township|consolidated|special_district|school_district|school_system|tribal|place_legal/.test(t||'');}
export function filterRecords(data,meta,f){
 const q=(f.q||'').trim().toLowerCase(),scopeMap=new Map(meta.scope_evidence.map(s=>[s.id,s]));
 const match=data.activities.map(a=>{const eid=f.role==='responsible'?a.organization_entity:a.admin,e=meta.entities[eid];
  return (!f.category||(f.category==='outside16'?!a.research_category:a.research_category===f.category))&&(!f.state||a.state===f.state)&&(!f.entity||eid===f.entity)&&(!f.type||(f.type==='local'?isLocal(e?.type):e?.type===f.type))&&(!f.activityType||a.type===f.activityType)&&(!f.grant||a.grant===f.grant)&&(!f.cohort||a.cohort===f.cohort)&&(!q||[a.grant,a.project,a.number,a.type,a.organization,e?.name,a.disaster].join(' ').toLowerCase().includes(q));
 });
 return data.rows.filter(r=>match[r[0]]&&(!f.from||data.quarters[r[1]]>=f.from)&&(!f.to||data.quarters[r[1]]<=f.to)&&(!f.scope||r[12])&&(!f.scopeRef||scopeMap.get(r[12])?.references.includes(f.scopeRef)));
}
