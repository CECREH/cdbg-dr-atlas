/** Lightweight record-to-catalog links; no source retrieval or manifest fetch. */
export function catalogReferenceUrl(sourceUrl) {
 if(typeof sourceUrl!=='string')return null;
 try {const u=new URL(sourceUrl);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)return null;u.hash='';return 'documents.html?q='+encodeURIComponent(u.href);}catch{return null;}
}
export function catalogReferenceMarkup(sourceUrl) {
 const href=catalogReferenceUrl(sourceUrl);return href?`<small><a class="source-catalog-link" href="${href.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}">Source provenance &amp; saved-copy status →</a></small>`:'';
}
