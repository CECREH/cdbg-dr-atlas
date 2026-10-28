export const activityColumns = ['reporting_group','original_award','quarter','project','activity','activity_type','financial_scope','report_status','publication_date','source_url','source_sha256','place_names','beneficiary_geography','beneficiary_allocation_cents','budget_period_cents','budget_to_date_cents','obligated_period_cents','obligated_to_date_cents','expended_period_cents','expended_to_date_cents','funds_drawdown_period_cents','funds_drawdown_to_date_cents','program_drawdown_period_cents','program_drawdown_to_date_cents','program_income_drawdown_period_cents','program_income_drawdown_to_date_cents','program_income_received_period_cents','program_income_received_to_date_cents'];
export const placeColumns = ['reporting_group','quarter','project','activity','place_name','census_geoid','census_name','census_lsad','census_funcstat','census_vintage','geography_role','outside_city_explicit','multi_area_statement','beneficiary_boundary_verified','beneficiary_allocation_cents','source_url','census_url'];
export function cents(value) {
  if (value === null || value === undefined || value === '') return 'Unavailable';
  let n=BigInt(value), negative=n<0n; if(negative)n=-n;
  return `${negative?'−':''}$${(n/100n).toLocaleString('en-US')}.${String(n%100n).padStart(2,'0')}`;
}
export function percent(value) { return value===null || value===undefined ? 'Unavailable' : `${(Number(value)*100).toFixed(2)}%`; }
export function selectRows(rows, {query='',group='',quarter='',sort='identity'}={}) {
  const q=query.trim().toLowerCase();
  const chosen=rows.filter(r=> (!group || r.reporting_group===group) && (!quarter || r.quarter===quarter) &&
    (!q || [r.reporting_group,r.original_award,r.project,r.activity,r.quarter,r.place_names,r.place_name,r.census_geoid].some(x=>String(x??'').toLowerCase().includes(q))));
  const collate=(a,b)=>String(a??'').localeCompare(String(b??''),undefined,{numeric:true});
  chosen.sort((a,b)=>{
    if(sort==='place') return collate(a.place_names||a.place_name||'\uffff',b.place_names||b.place_name||'\uffff') || collate(a.activity,b.activity);
    if(sort==='quarter') return collate(a.quarter,b.quarter) || collate(a.reporting_group,b.reporting_group) || collate(a.activity,b.activity);
    return collate(a.reporting_group,b.reporting_group) || collate(a.project,b.project) || collate(a.activity,b.activity);
  });
  return chosen;
}
export function csvText(rows,columns) {
  const escape=v=>{
    if(v===null || v===undefined) return '';
    let s=String(v);
    if (/^[=+@]/.test(s) || (s.startsWith('-') && !/^-\d+$/.test(s))) s="'"+s;
    return `"${s.replaceAll('"','""')}"`;
  };
  return '\ufeff'+columns.join(',')+'\r\n'+rows.map(r=>columns.map(k=>escape(r[k])).join(',')).join('\r\n')+'\r\n';
}
