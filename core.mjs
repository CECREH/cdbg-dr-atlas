export const MONEY_FIELDS = ['obligated_cents', 'expended_cents', 'disbursed_cents', 'program_income_disbursed_cents', 'program_income_received_cents'];
export const PAGE_SIZE = 20;
export function money(cents) {
  if (cents === null || cents === undefined || cents === '') return 'Unavailable';
  const n = BigInt(cents), a = n < 0n ? -n : n;
  return `${n < 0n ? '−' : ''}$${(a / 100n).toLocaleString('en-US')}.${(a % 100n).toString().padStart(2, '0')}`;
}
export function eligiblePoint(entity, layer) {
  // Administrative identities and all candidate locations are barred from beneficiary mapping.
  return ((layer === 'admin' && entity?.point?.role === 'administering_reference') ||
    (layer === 'activity' && entity?.point?.role === 'reported_administrative_scope' && entity.point.beneficiary_verified === false)) &&
    entity.point.verified === true && Number.isFinite(entity.point.lon) && Number.isFinite(entity.point.lat) &&
    Math.abs(entity.point.lat) <= 90 && Math.abs(entity.point.lon) <= 180;
}
export function summarize(rows) {
  const totals = {};
  for (const key of MONEY_FIELDS) {
    const values = rows.filter(r => r[key] !== null && r[key] !== undefined && r[key] !== '');
    totals[key] = values.length ? values.reduce((a, r) => a + BigInt(r[key]), 0n).toString() : null;
    totals[key + '_missing'] = rows.length - values.length;
  }
  return {records: rows.length, entities: new Set(rows.map(r => r.entity_id)).size,
    awards: new Set(rows.map(r => r.grant_id)).size,
    activities: new Set(rows.map(r => JSON.stringify([r.grant_id,r.project_number,r.activity_number]))).size,
    quarters: new Set(rows.map(r => r.calendar_quarter)).size, ...totals};
}
export function selectDemo(data, filters) {
  if (!data.snapshots.some(s => s.id === filters.snapshot)) throw new Error('Choose one source snapshot.');
  const q = (filters.q || '').toLowerCase().trim();
  const rows = data.records.filter(r => r.snapshot === filters.snapshot &&
    (!filters.entity || r.entity_id === filters.entity) && (!filters.cohort || r.cohort === filters.cohort) &&
    (!filters.from || r.calendar_quarter >= filters.from) && (!filters.to || r.calendar_quarter <= filters.to) &&
    (!q || [r.entity_name,r.grant_id,r.project_number,r.activity_number,r.activity_type,r.calendar_quarter].join(' ').toLowerCase().includes(q)))
    .sort((a,b) => b.calendar_quarter.localeCompare(a.calendar_quarter) || a.id.localeCompare(b.id));
  const page = Math.max(1, Math.min(Number(filters.page) || 1, Math.ceil(rows.length/PAGE_SIZE) || 1));
  return {summary:summarize(rows), total:rows.length, page, pageSize:PAGE_SIZE,
    rows:rows.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE), entityIds:[...new Set(rows.map(r=>r.entity_id))], scopeIds:[]};
}
export function normalizeQuarter(value) { return /^\d{4}Q[1-4]$/.test(value) ? value : ''; }
export function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}
export const REGIONS = {
  conus: {name:'Contiguous U.S.', bounds:[-126,24,-66,50]},
  alaska: {name:'Alaska',bounds:[-180,50,-129,72]},
  hawaii: {name:'Hawaii',bounds:[-161,18,-154,23]},
  caribbean: {name:'Puerto Rico & U.S. Virgin Islands',bounds:[-68.2,17.5,-64.3,18.8]},
  pacific: {name:'Guam & Northern Mariana Islands',bounds:[143,12,147,21]},
  samoa: {name:'American Samoa',bounds:[-172,-15,-168,-10]}
};
export function project(lon,lat,bounds,width=760,height=355) {
  const [x0,y0,x1,y1]=bounds;
  return [(lon-x0)/(x1-x0)*width,(y1-lat)/(y1-y0)*height];
}
export function inRegion(point,bounds) {
  return point.lon>=bounds[0] && point.lon<=bounds[2] && point.lat>=bounds[1] && point.lat<=bounds[3];
}
