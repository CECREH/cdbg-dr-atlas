# CECREH CDBG-DR Research Atlas

A standalone public financial and geographic source explorer. The financial table
contains 128,382 national quarterly records and a separate, overlapping 6,518-row
Texas Harvey snapshot. Five signed quarterly net measures retain negative
adjustments, exact integer cents, original reporting-period dates and fiscal labels.

The government selector distinguishes administering grantees from matched
responsible organizations. Neither establishes beneficiary geography or allocates
a statewide award to a local government. Exact official QPR activity-scope links
are separately identified; no local dollar allocation weights are implied.

The reference inventory contains 2025 land-clipped Census states/territories,
counties/parishes, places and county subdivisions, plus the 2022 government unit
inventory. Layers overlap. Statistical areas and governmental identities differ.
Regional Albers equal-area projection and simplified boundaries are for display.
Alaska, Hawaii and territories have explicit regional views.

Verified initial award execution dates, compatible local/activity allocation
histories, beneficiary geography and Q4/Q12/Q20 ratios remain unavailable.
Contextual ACS, flood, land-use and government-resource sources are cataloged;
those covariates are not represented as populated joins.

## Provenance

The national HUD F31 extract is reconciled to publicly published CECREH financial
chunks at commit `0531f22afbb814ae24f382d8916bb4538e4d7b4e` of
[HUD-CDBG-DR-Fund-Hierarchy-Dashboard](https://github.com/CECREH-2023/HUD-CDBG-DR-Fund-Hierarchy-Dashboard).
The supplied source has documented 10-significant-digit precision differences in
119 rows / 157 cells (maximum $0.41) relative to that public comparator. The
separate Texas F31 export retains its later source version and F33 reconciliation.
Official GLO QPRs supply selected independent period-dollar checks and scope links.

See [release provenance](data/provenance.json) and [source catalog](data/sources.json).
Upstream software/documentation terms are preserved in `UPSTREAM-LICENSE.txt`.
Census geographic data are credited to the U.S. Census Bureau. The logo is the
official CECREH asset from Texas Tech University, used unchanged.

Sixteen address-bearing housing activity IDs are replaced with disclosed stable
surrogate identifiers while retaining their financial rows. No narratives,
household attributes, residential locations, credentials or third-party city
coordinates are included.

## Use

Serve this directory with any static HTTP server. No build step, service, API key,
tracking, external font, map tile provider or client credential is required.
The browser loads one financial snapshot at a time. Boundaries load by state and
layer. The national subunit catalog loads when requested. Search, pagination,
sort and CSV export operate on the selected snapshot; exported money is in cents.

Keyboard map navigation: arrow keys pan, `+` / `-` zoom, `0` resets. Buttons and an
accessible list provide equivalent map actions. Searchable tables remain the
primary non-map way to inspect records and references.
