// Exact release-record locators; never infer upstream chunk rows from CSV row IDs.
export const ATLAS_SOURCE_COMMIT = '4d29babaecb2f7d0875b0845abf1e2ab5c132095';
export const COMPARATOR_COMMIT = '0531f22afbb814ae24f382d8916bb4538e4d7b4e';
const atlas = `https://github.com/CECREH/cdbg-dr-atlas/blob/${ATLAS_SOURCE_COMMIT}/`;
const comparator = `https://github.com/CECREH-2023/HUD-CDBG-DR-Fund-Hierarchy-Dashboard/blob/${COMPARATOR_COMMIT}/`;
const snapshots = new Set(['national', 'texas']);
export function financialSourceDetails(snapshot, sourceRecord, rowIndex, grant = '') {
  if (!snapshots.has(snapshot)) throw new Error('Unknown financial snapshot');
  const record = Number.isSafeInteger(sourceRecord) && sourceRecord > 0 ? sourceRecord : null;
  const index = Number.isSafeInteger(rowIndex) && rowIndex >= 0 ? rowIndex : null;
  const file = `data/finance-${snapshot}.json`;
  return {
    snapshot,
    sourceCommit: ATLAS_SOURCE_COMMIT,
    releasedFile: file,
    releasedFileUrl: atlas + file,
    releasedRecordPointer: index === null ? null : `/rows/${index}`,
    sourceCsvRecord: record,
    sourceCsvRecordNote: 'Original CSV record number retained by the atlas; not a line or row number in the public comparator.',
    originalAvailability: snapshot === 'national'
      ? 'Original F31 workbook/CSV is not publicly included. The pinned public comparator contains derived, dictionary-encoded rows, not the raw input.'
      : 'Original Texas F31 workbooks are not publicly included. Official QPRs are independent corroboration, not the source of these F31 rows.',
    comparatorSchemaUrl: snapshot === 'national' ? comparator + 'data/STATIC_DATA_SCHEMA.md' : null,
    comparatorMetadataUrl: snapshot === 'national' ? comparator + 'data/metadata.json' : null,
    comparatorExactRowStatus: snapshot === 'national' ? 'Exact public-comparator chunk/row mapping is not yet verified.' : 'Not applicable: separate Texas snapshot.',
    catalogUrl: `documents.html?q=${encodeURIComponent(String(grant || ''))}`,
    provenanceUrl: atlas + 'data/provenance.json',
    relationship: 'Released derived record; not an archived original document.'
  };
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function financialSourceMarkup(details) {
  const s = details;
  return `<section aria-label="Source and document provenance"><h3>Source &amp; document</h3><p>${escape(s.originalAvailability)}</p><p><a href="${escape(s.releasedFileUrl)}" target="_blank" rel="noopener noreferrer">Open exact released financial file ↗</a> · <a href="${escape(s.releasedFile)}" download>Download released financial JSON ↓</a></p><dl><dt>Released record location</dt><dd>${s.releasedRecordPointer ? `<code>${escape(s.releasedRecordPointer)}</code> (zero-based JSON Pointer)` : 'Unavailable'}</dd><dt>Original CSV record</dt><dd>${escape(s.sourceCsvRecord ?? 'Unavailable')}</dd><dt>Source version</dt><dd><code>${escape(s.sourceCommit)}</code></dd></dl><p class="fine">${escape(s.relationship)} ${escape(s.sourceCsvRecordNote)} ${escape(s.comparatorExactRowStatus)}</p>${s.comparatorSchemaUrl ? `<p><a href="${escape(s.comparatorSchemaUrl)}" target="_blank" rel="noopener noreferrer">Public comparator schema ↗</a> · <a href="${escape(s.comparatorMetadataUrl)}" target="_blank" rel="noopener noreferrer">Comparator source hashes &amp; metadata ↗</a></p>` : ''}<p><a href="${escape(s.provenanceUrl)}" target="_blank" rel="noopener noreferrer">Reconciliation &amp; provenance ↗</a> · <a href="${escape(s.catalogUrl)}">Find source documents for this award →</a></p></section>`;
}
