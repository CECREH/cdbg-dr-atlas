# CDBG-DR Research Atlas: data and methods

This is a public accounting and source-exploration resource. It does not establish
causal recovery effects, administrative capacity, or complete beneficiary-city
funding. The requested city/activity allocations and six milestone measures are
represented explicitly, including unavailable fields and their reasons.

## Financial snapshots and geography

Choose **national or Texas**. Never concatenate them. National has 128,382
quarterly records, 206 awards and 16,150 original activities, covering observed
calendar quarters 2002Q2–2025Q1. Texas has 6,518 records, two Harvey awards and
775 activities, covering 2018Q3–2026Q1. The final quarters are incomplete or
unverified. Original fiscal labels and actual reporting-period starts remain.
The national filename date is not a verified extraction date. Texas uses the
documented February 2026 F31 export and September 2026 workbook repair.

The five money fields are signed **quarterly net flows**, in nominal USD cents:
obligations, expenditures, disbursements, program-income disbursements and
program-income receipts. They are not cumulative snapshots. Preserve negative
adjustments. Observed-window totals do not certify grant-start cumulative totals.
Blank CSV / null JSON means unavailable; numeric zero means an observed zero.

The national panel was reconciled to the pinned public CECREH financial source.
All keys and five measures reconcile, including 119 rows / 157 source-precision
differences of at most $0.41 caused by the supplied CSV's ten-significant-digit
rounding. The separate Texas panel was reconciled to F33 project-quarter totals.
158 overlapping snapshot keys differ; 150 material differences occur in 2025Q1.
No source version silently replaces another.

Administering government, named responsible organization, reported activity scope,
and beneficiary location are distinct. A government identity correspondence is
not a project footprint or local allocation. The administering and responsible
views overlap and must not be summed. Multi-area QPR scope has no fabricated
allocation weights. Beneficiary geography remains unavailable. Sixteen
address-bearing housing activity IDs use stable surrogates; their financial rows
remain, while household narratives and locations are excluded.

The research panel aggregates selected source rows once per snapshot × government
relationship × verified Census place identity × original grant × category ×
calendar quarter. The original project/activity keys remain in financial exports.
County/parish, township and other government records remain in the full financial
table; the city analysis panel deliberately requires a verified place identity.

## Categories and award-relative time

The 16-category crosswalk uses reviewed direct F31 source-type matches. The full
source-type dictionary retains categories outside the requested 16. Economic
development/recovery includes the explicit job-creating/retaining source category;
MIT economic development, Virginia-only centers, tourism and compensation are
not pooled automatically. DR, MIT and NDR, disaster labels, years and IDs remain.

HUD's 2019 and 2023 cumulative P.L. 113-2 financial reports explicitly label
**Initial Grant Agreement Effective Date** for 34 original grant IDs. Dates agree
between versions; 26 IDs match the national panel. Whole-grant awarded,
obligated-to-grantee and disbursed amounts retain their separate source dates.
They are not initial allocations or historical city/activity denominators.
The DRGR recipient API's year and document publication fields do not establish
initial execution. Unknown start dates remain missing.

Q1 is the calendar reporting quarter containing the verified initial execution
date and may be partial. Q4/Q12/Q20 end at their calendar quarter ends. Quarterly
flows are not prorated to rolling anniversaries. For each horizon, the six named
measures are cumulative expended / compatible allocated and cumulative expended /
compatible obligated. Nonpositive/missing denominators, unreconciled opening
history, missing quarters and censored follow-up prevent a certified ratio.
Observed-window numerators are diagnostic only; unobserved quarters are not zero.

Independent public QPRs provide reported cumulative **To Date** expenditures and
obligations at exact horizons for a subset of municipal grants and activities.
Their later publication/revision dates, approval status, original IDs and source
pages travel with the values. E/O uses same-scope To Date amounts; negative
numerators are retained and denominators must be positive. These are reported
source ratios, not independently audited performance scores. Some QPRs only list
a subset of activities, so activity sums may differ from the whole-grant table;
reconciliation differences are published, never silently adjusted. Above-100% reported E/O ratios are kept and flagged. One New York City Q20 source PDF has an unvalidated page structure and contributes no values. They are
separate vintages and must not be spliced into F31 quarterly histories.

Activity budgets and cover-page awards have not been verified as compatible
historical allocations. E/allocated therefore remains unavailable. This is the
specific remaining denominator gap, not an absence of a formula.

## Context and map

ACS uses official 2020–2024 five-year table-based summary files for direct Census
places: B01003, B19013, B17001, B25003, B25002, B25077 and B23025. Estimates,
90% margins of error, source variables and negative special-value codes are
retained; special codes become null values with separate flags. Open-ended median codes are not treated as point estimates: the original positive code is retained separately with a qualifier. Do not treat the
five-year estimates as annual or quarterly values. Medians and MOEs must not be
summed across places. Income is in 2024 inflation-adjusted dollars.

Census government-finance items E23 (financial administration), E29 (central
staff) and E50 (housing/community development) are current-operation expenditure
inputs in **thousands of nominal dollars**, not staffing or a capacity index.
Join the exact 12-character government ID to the PID directory, and construct
place GEOID only from official FIPS state/place for municipality type 2. Township
or headquarters locations are not municipality service areas. Preserve data
year, fiscal-year-ending MMDD and reported/imputed/other flags. The survey is a
sample; absent cities or items are missing, not zero.

Census cautions that these individual-unit inputs were edited for accurate
state/type aggregates, not reviewed as accurate individual-unit time series.
They can contain substantial sampling/nonsampling error, including nonresponse,
imputation, coverage and recording errors. Census is the source of the original
data and has not reviewed or endorsed this derived join or analysis. These
limitations accompany all reuse; do not infer validated municipal capacity.

Spatial context uses **unsimplified 2024 TIGER/Line place geometry**, not the map's
display outlines. FEMA NFHL edition 2026-03-03 (cached public download April 19,
2026) describes regulatory hazards, with different panel effective dates. Union
polygons before measuring SFHA (flag T), mapped and undetermined areas in local
equal-area coordinates. Full city boundary area includes water; display both
mapped coverage and SFHA shares. Unmapped area is unknown, not no flood risk.
This is not actual flood occurrence or an individual-property determination.

USGS Annual NLCD Land Cover 2024 Collection 1.1 uses 30 m pixel-center counts.
Developed classes are 21–24; wetlands 90/95. Exclude open-water class 11 from the
land denominator and preserve valid pixel counts. The explicit NAD83→WGS84
operation has stated 4 m accuracy; raster-edge and classification uncertainty
remain. USDA LCMS 2024 v2025-11 separately represents modeled land use. Neither
product establishes legal zoning or parcel permissions. See per-city statuses
and source receipts for actual coverage. Context vintages are not historical
award-time controls. Staffing and municipal zoning remain unpopulated.

The map uses 2025 Census land-clipped cartographic display boundaries, further
simplified for responsiveness, with regional Albers equal-area conic projections.
Counties/parishes, places and subdivisions load by state. Alaska, Hawaii and
territories have separate regional views. Reference boundaries never imply a
funded activity. Display geometry must not be used for analytical attribution.
Identity sources may have 2022, 2023 or 2026 vintages; historical boundary
equivalence is not assumed merely because GEOIDs match.

## Reuse and reproducibility

Full download bundles contain CSV plus dictionaries and source metadata. Filtered
exports correspond to the selected view. Each financial bundle is one snapshot;
relationship-view overlaps are flagged. Public source URLs, retrieval dates,
SHA-256 receipts, reporting/publication vintages and source pages are retained.
The accompanying local acquisition/build pipeline preserves raw public inputs,
exact integer-cent transformations, category rules, GIS operations and tests.
Original research inputs are unchanged. No credentials or private correspondence
are needed by the static site. The official CECREH logo is used unchanged.
