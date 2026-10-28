export function filterTuscaloosa(rows,{quarter='',status='',query=''}={}){
 const text=query.trim().toLowerCase();
 return rows.filter(r=>(!quarter||r.quarter===quarter)&&(!status||r.report_status===status)&&(!text||[r.project,r.activity,r.activity_type_as_reported,r.quarter].some(x=>String(x||'').toLowerCase().includes(text))));
}
