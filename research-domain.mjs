import {MONEY,csvCell} from './domain.mjs';
export const qIndex=q=>Number(q.slice(0,4))*4+Number(q.at(-1))-1;
export const dateQuarter=s=>Number(s.slice(0,4))*4+Math.floor((Number(s.slice(5,7))-1)/3);
export const awardQuarter=(q,date)=>date?qIndex(q)-dateQuarter(date)+1:null;
export function executionMetric({numerator,denominator,startKnown=true,historyComplete=true,followupComplete=true,scopeCompatible=true}){
 const reasons=[];
 if(!startKnown)reasons.push('initial_execution_date_unverified');
 if(!historyComplete)reasons.push('incomplete_or_unreconciled_history');
 if(!followupComplete)reasons.push('followup_censored');
 if(!scopeCompatible)reasons.push('incompatible_scope_or_vintage');
 if(numerator===null||numerator===undefined)reasons.push('missing_numerator');
 if(denominator===null||denominator===undefined)reasons.push('missing_denominator');
 else if(BigInt(denominator)<=0n)reasons.push('nonpositive_denominator');
 return {value:reasons.length?null:Number(numerator)/Number(denominator),eligible:!reasons.length,reasons,negativeNumerator:numerator!=null&&BigInt(numerator)<0n};
}
export function cityQuarterRows(data,meta,rows,role){
 const groups=new Map();
 for(const r of rows){
  const a=data.activities[r[0]],id=role==='responsible'?a.organization_entity:a.admin,e=meta.entities[id];
  if(!e?.reference?.startsWith('place:')||!['municipal_government','place_legal_government','consolidated_government'].includes(e.type))continue;
  const key=[id,a.grant,a.research_category||'outside16',data.quarters[r[1]]].join('|');
  if(!groups.has(key))groups.set(key,{snapshot:data.snapshot,role,entity:id,name:e.name,geoid:e.reference.split(':')[1],grant:a.grant,category:a.research_category||'outside16',quarter:data.quarters[r[1]],award_relative_quarter:r[13],initial_date:a.grant_start,values:MONEY.map(()=>0n),missing:MONEY.map(()=>0),source_rows:0,activities:new Set(),disasters:new Set(),years:new Set(),cohorts:new Set(),endpoint:false});
  const g=groups.get(key);MONEY.forEach((_,i)=>r[i+2]===null?g.missing[i]++:g.values[i]+=BigInt(r[i+2]));g.source_rows++;g.activities.add(a.project+' / '+a.number);g.disasters.add(a.disaster);g.years.add(a.disaster_year);g.cohorts.add(a.cohort);g.endpoint||=r[9];
 }
 return [...groups.values()].map(g=>({...g,values:g.values.map((v,i)=>g.missing[i]===g.source_rows?null:String(v)),activities:[...g.activities],disasters:[...g.disasters],years:[...g.years],cohorts:[...g.cohorts]}));
}
export function financialExport(data,meta,rows,role){
 const scopeMap=new Map(meta.scope_evidence.map(s=>[s.id,s]));
 return rows.map(r=>{const a=data.activities[r[0]],scope=scopeMap.get(r[12]),entity=meta.entities[role==='responsible'?a.organization_entity:a.admin];
  const out={source_snapshot:data.snapshot,geography_role:role==='responsible'?'responsible organization identity':'administering grantee identity',selected_entity_id:entity?.id,selected_place_or_area_reference:entity?.reference,geography_evidence:entity?.evidence,geography_reference_vintage:entity?.reference_vintage,administering_government:meta.entities[a.admin]?.name,administering_entity_id:a.admin,responsible_organization:a.organization,matched_responsible_entity_id:a.organization_entity,responsible_match_status:a.organization_status,grant_id:a.grant,project_number:a.project,activity_number_or_surrogate:a.number,identifier_redacted:a.identifier_redacted,source_activity_type:a.type,research_category:a.research_category,disaster_label:a.disaster,disaster_year:a.disaster_year,cohort:a.cohort,calendar_quarter:data.quarters[r[1]],period_begin_actual:data.begins[r[7]],original_fiscal_quarter:r[8],award_relative_quarter:r[13],verified_initial_execution_date:a.grant_start,initial_date_status:a.grant_start_status};
  MONEY.forEach((k,i)=>out[k]=r[i+2]);Object.assign(out,{money_basis:'signed quarterly net flows; nominal USD cents',reported_scope:scope?.area_names.join('; '),scope_source:scope?.source_url,beneficiary_geography:null,compatible_local_allocation_cents:null});
  for(const h of [4,12,20])for(const den of ['allocated','obligated'])out[`q${h}_expended_${den}_ratio`]=null;
  Object.assign(out,{milestone_status:'F31 grant-start cumulative history/local allocation unverified; independent documented QPR ratios in qpr-horizons dataset',endpoint_unverified:r[9],precision_difference:r[10],source_csv_record:r[11],source_vintage:meta.snapshots.find(s=>s.id===data.snapshot).vintage});return out;
 });
}
export function objectsCSV(rows,headers=rows.length?Object.keys(rows[0]):[]){return '\uFEFF'+[headers.map(csvCell).join(','),...rows.map(r=>headers.map(k=>csvCell(Array.isArray(r[k])?JSON.stringify(r[k]):r[k])).join(','))].join('\r\n');}
export function contextExport(place,definitions){
 const s=place.spatial||{},n=s.nfhl||{},l=s.nlcd||{},u=place.land_use||{};
 const r={geoid:place.geoid,place:place.name,acs_geography_label:place.acs_geography_label,acs_geography_vintage:place.acs_geography_vintage,classification:place.classification,financial_entity_ids:place.finance_entities||[],acs_window:'2020-2024',acs_status:place.acs_status};
 definitions.acs_variables.forEach((v,i)=>{const x=place.acs[i]||[null,null,'unavailable','unavailable'];r[v.id+'_estimate']=x[0];r[v.id+'_moe90']=x[1];r[v.id+'_estimate_missing_code']=x[2];r[v.id+'_moe_missing_code']=x[3];r[v.id+'_qualified_source_estimate']=place.acs_qualified_medians?.[i]?.source_estimate;r[v.id+'_estimate_qualifier']=place.acs_qualified_medians?.[i]?.qualifier;});
 Object.assign(r,{nfhl_status:n.status||'not_processed',nfhl_vintage:'2026-03-03 file edition; map effective dates vary',analytical_boundary_vintage:s.boundary_vintage||null,nfhl_boundary_area_m2:n.boundary_area_m2,nfhl_mapped_area_m2:n.mapped_area_m2,nfhl_sfha_area_m2:n.sfha_area_m2,nfhl_undetermined_area_m2:n.undetermined_area_m2,nfhl_undetermined_boundary_pct:n.boundary_area_m2?100*n.undetermined_area_m2/n.boundary_area_m2:null,nfhl_mapped_boundary_pct:n.mapped_boundary_pct,nfhl_sfha_boundary_pct:n.sfha_boundary_pct,nfhl_sfha_mapped_pct:n.sfha_mapped_pct,nlcd_status:l.status||'not_processed',nlcd_vintage:'2024 Collection 1.1',nlcd_valid_land_pixels:l.valid_land_pixels,nlcd_developed_land_pct:l.developed_land_pct,nlcd_wetland_land_pct:l.wetland_land_pct,land_use_status:u.status||place.land_use_status,land_use_vintage:u.vintage||null,land_use_class_pixels:u.class_pixels?JSON.stringify(u.class_pixels):null,government_finance_status:place.government_finance_status});
 for(const [code,label] of Object.entries({'1':'agriculture','2':'developed','3':'forest','4':'other','5':'rangeland_pasture'})){r['lcms_'+label+'_pixels']=u.class_pixels?.[code];r['lcms_'+label+'_pct']=u.class_pct?.[code];}r.lcms_valid_pixels=u.valid_pixels;r.lcms_source=u.source_url;r.lcms_method=u.method;
 for(const item of ['E23','E29','E50']){const gs=place.government_finance||[],g=gs.length===1?gs[0]:null,v=g?.items[item];r[item+'_government_id']=g?.government_id;r[item+'_amount_thousand_usd']=v?.amount_thousand_usd;r[item+'_data_year']=v?.data_year;r[item+'_flag']=v?.flag;r[item+'_fiscal_year_end_MMDD']=g?.fiscal_year_ending;}
 r.context_limitation='Contextual city identity, not funded activity or beneficiary geography. NFHL regulatory hazard, NLCD land cover, LCMS modeled land use, government sample inputs; not staffing.';return r;
}
