/* QPR source records remain independent of F31 and of other report vintages. */
export function filterSpringfield(rows,filter={}){
 const q=(filter.query||'').trim().toLocaleLowerCase(),quarter=filter.quarter||'',view=filter.view||'';
 return rows.filter(r=>(!quarter||r.quarter===quarter)&&(!q||[r.project,r.activity,r.activity_type_as_reported,r.quarter].some(x=>String(x||'').toLocaleLowerCase().includes(q)))&&(!view||(view==='extension'?r.linked_extension_indicator:view==='qpr-only'?!r.f31_exact_activity_key:true)));
}
