/** Pure catalog helpers. Untrusted provenance never becomes HTML or an arbitrary URL. */
export const PUBLIC_STATES = new Set(['reviewed_public_safe']);
export function safeOfficialUrl(value) {
 if (typeof value !== 'string' || /[\u0000-\u0020\u007f]/.test(value)) return null;
 try { const u=new URL(value); return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password ? u.href : null; } catch {return null;}
}
export function safeRelativeUrl(value) {
 if (typeof value !== 'string' || !value || /[\\?#:\u0000-\u0020\u007f]/.test(value) || value.startsWith('/')) return null;
 let decoded; try {decoded=decodeURIComponent(value);}catch{return null;}
 if (/[\\?#:%\u0000-\u0020\u007f]/.test(decoded) || decoded.startsWith('/') || decoded.split('/').some(p=>!p || p==='.' || p==='..')) return null;
 return value;
}
export function pageNumber(value) {const n=Number(value); return ['number','string'].includes(typeof value)&&String(value).trim()!==''&&Number.isSafeInteger(n)&&n>0 ? n:null;}
export function pageUrl(value,page) {const url=safeOfficialUrl(value),n=pageNumber(page); if(!url||!n)return null;const u=new URL(url);u.hash=`page=${n}`;return u.href;}
export function publicCopy(doc) {
 const hash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
 const kind=doc.publicCopyKind;
 const verifiedCopy=hash(doc.sha256)&&hash(doc.publicCopySha256)&&(kind==='original'?doc.publicCopySha256===doc.sha256:kind==='redacted'&&doc.publicCopySha256!==doc.sha256);
 const review=doc.releaseReview,approved=review?.decision==='approved'&&review.privacyApproved===true&&review.sourceRightsApproved===true&&hash(review.manifestSha256)&&review.originalSha256===doc.sha256&&review.copySha256===doc.publicCopySha256&&review.copyKind===kind;
 return doc.accessStatus!=='blocked'&&doc.savedOriginal===true&&PUBLIC_STATES.has(doc.publicationStatus)&&verifiedCopy&&approved?safeRelativeUrl(doc.publicCopyUrl):null;
}
export function officialSources(doc) {
 return doc.accessStatus==='blocked'?[]:[...new Set([doc.officialUrl,...(doc.sourceUrls||[])].map(safeOfficialUrl).filter(Boolean))];
}
export function availability(doc) {
 if(doc.accessStatus==='blocked')return 'Blocked';
 if(publicCopy(doc))return doc.publicCopyKind==='redacted'?'Public redacted copy':'Public saved original';
 if(doc.savedOriginal===true)return 'Recorded in separate archive · not supplied here; not published';
 return doc.accessStatus==='unavailable'?'Unavailable':'Not saved';
}
export function searchableText(doc) {
 return [doc.documentId,...(doc.documentAliases||[]),doc.title,doc.officialUrl,doc.sourceType,doc.accessStatus,doc.accessReason,doc.reviewStatus,doc.publicationStatus,doc.sha256,...(doc.recordIds||[]),...(doc.sourceUrls||[]),...(doc.geographies||[]),...(doc.awardIds||[]),...(doc.periods||[]),...(doc.citations||[]).map(c=>[c.recordId,c.recordPath,c.dataset,c.page].join(' '))].join(' ').toLowerCase();
}
export function filterDocuments(documents,{q='',status='',type=''}={}) {
 const tokens=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return documents.filter(d=>(!status||(status==='public'?!!publicCopy(d):status==='saved'?d.savedOriginal===true:status==='not_saved'?!d.savedOriginal&&d.accessStatus!=='blocked':d.accessStatus===status))&&(!type||d.sourceType===type)&&tokens.every(t=>searchableText(d).includes(t)));
}
export function catalogCounts(documents) {
 return {catalogued:documents.length,saved:documents.filter(d=>d.savedOriginal===true).length,public:documents.filter(d=>publicCopy(d)).length,blocked:documents.filter(d=>d.accessStatus==='blocked').length};
}
export function citationText(doc) {
 return [doc.title||doc.documentId,doc.geographies?.join('; '),doc.awardIds?.join('; '),doc.periods?.join('; '),doc.officialUrl||doc.sourceUrls?.[0],doc.pages?.length?`PDF pages: ${doc.pages.join(', ')}`:null,doc.sha256?`SHA-256: ${doc.sha256}`:null,`Availability: ${availability(doc)}`].filter(Boolean).join('\n');
}
