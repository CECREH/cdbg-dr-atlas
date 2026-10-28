export function filterGeography(rows,{snapshot='national',role='',type='',query=''}={}){
 const s=query.trim().toLowerCase();return rows.filter(r=>(!snapshot||r.snapshot===snapshot)&&(!role||r.role===role)&&(!type||r.entity_type===type)&&(!s||[r.entity_name,r.entity_id,r.grant,r.reference,r.state_fips].some(x=>String(x||'').toLowerCase().includes(s))));
}
export function filterTexasQPR(rows,{quarter='',status='',query=''}={}){
 const s=query.trim().toLowerCase();return rows.filter(r=>(!quarter||r.quarter===quarter)&&(!status||r.report_status===status)&&(!s||[r.responsible_organization_as_printed,r.responsible_government_id,r.responsible_place_reference,r.project,r.activity,r.grant_id,r.reporting_group,r.activity_title_as_printed,r.activity_status_as_printed].some(x=>String(x||'').toLowerCase().includes(s))));
}
export function filterOtherQPR(rows,{admin='',status='',query=''}={}){
 const s=query.trim().toLowerCase();return rows.filter(r=>(!admin||r.administering_entity===admin)&&(!status||r.report_status===status)&&(!s||[r.responsible_organization_as_printed,r.project,r.activity,r.reporting_group,r.activity_type_as_printed,r.reported_project_scope,r.reported_project_reference,r.activity_status_as_printed,r.quarter].some(x=>String(x||'').toLowerCase().includes(s))));
}
