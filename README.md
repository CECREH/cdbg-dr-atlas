# CDBG-DR Research Atlas — public source and geography preview

This standalone public reference helps organize CDBG-DR data sources and the evidence needed for a city × award × activity × quarter analysis.

**Coverage of this release:** eight official source-catalog entries; 56 Census state/D.C./territory reference areas; zero financial records; zero activity or beneficiary location assignments; zero synthetic financial values. Q4/Q12/Q20 execution ratios remain unavailable. A highlighted area is geographic context, not evidence of a CDBG-DR award, activity, beneficiary or funding amount.

The map supports zoom, pan, region selection and synchronized reference-area/table selection, including keyboard controls. The source catalog documents units, vintages, missingness, definitions and linkage requirements. A separate local research workflow may supply verified records in an authorized environment; none are included here.

## Source and reuse review

- `data/geography.json` derives only from the U.S. Census Bureau's official `tl_2023_us_state.zip`. Source SHA-256, the original embedded reuse statement and the exact transformation appear in `data/geography-provenance.json`.
- Census metadata state that the TIGER/Line products are not copyrighted and may be reused with Census attribution. The map provides that attribution. TIGER/Line and Census TIGER are Census Bureau trademarks. These boundaries are statistical references, not legal land descriptions or a determination of jurisdictional authority.
- Coordinates retain native NAD83 longitude/latitude, generalized at 0.035°. Regions have different display scales; eastern antimeridian Alaska islands are outside the western-longitude panel. The map is unsuitable for distance, area or legal-boundary measurements.
- `data/catalog.json` contains only names and public Census codes from those reference features. It contains no financial observations.
- `data/sources.json` contains authored descriptions and official links, not downloaded research datasets or copied source reports. Link checks and unverified reference leads are distinguished in each entry.
- The remaining files are newly authored interface code and a simple original icon. No third-party JavaScript, tile service, font, analytics or private data file is bundled or requested.

Public reports do not establish redistribution rights for a separately obtained restricted extract. Restricted original QPR records, their derivatives, private communications, credentials, household locations, local research hashes and private screenshots are excluded from this repository and its history.

## Interpretation limits

National and Texas snapshots can overlap and must not be added. Administering identity does not locate activity sites or beneficiaries. Initial execution dates, compatible dated allocations and complete histories are necessary for award-relative ratios. Missing observations are not zeros; signed adjustments must be preserved. ACS, flood, land-cover and government-resource joins require compatible units, boundaries and time periods. Exploratory accounting associations alone do not establish capacity or recovery effects.

This website and repository are public and may be discovered even without inbound links. There is no login or claim of privacy. No navigation links or announcements have been added to other CECREH properties.

## Static operation

Serve this directory with an ordinary local HTTP server. Relative URLs and `.nojekyll` support GitHub Pages project paths. No API key or build dependency is required.

Prepared and source-reviewed October 27, 2026.
