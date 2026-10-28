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

The research panel supplies a city × original grant × original project/activity ×
observed calendar-quarter table, with the original financial row and linked context.
Choose administering or named responsible government. National has 7,225 rows in
the administering-city view and 19,140 in the responsible-city view; Texas has
0 and 1,220 respectively. These are overlapping identity views, not beneficiary
allocations. County/parish, township and other government records remain in the
full financial table. Category-quarter aggregation remains a separate view.
The 16-category aggregate panel has 16,741 national and 990 Texas rows across its
overlapping roles. Exact original IDs, category scope, disaster/cohort and GEOIDs
are exported. Independent QPR horizon evidence is joined by original activity key
and repeated as reference fields; do not sum repeated horizon values across quarters.

## Categories and award-relative time

The 16-category crosswalk uses reviewed direct F31 source-type matches. The full
source-type dictionary retains categories outside the requested 16. Economic
development/recovery includes the explicit job-creating/retaining source category;
MIT economic development, Virginia-only centers, tourism and compensation are
not pooled automatically. DR, MIT and NDR, disaster labels, years and IDs remain.

HUD's 2019 and 2023 P.L. 113-2 reports explicitly label **Initial Grant Agreement
Effective Date** for 34 original grant IDs, with all dates agreeing; 26 match the
national panel. Three additional panel clocks bring verified national coverage to
29 of 206 awards. Houston B-16-MH-48-0001 uses December 7, 2016, explicitly stated
in HUD OIG 2022-FW-1001 (PDF p.7, printed p.5) and corroborated in OIG 2023-FW-0001
Appendix E. A city guideline instead prints December 7, 2017; that conflict is
retained, with the two agreeing HUD sources preferred. Lake Charles B-21-MF-22-0002
and B-22-MF-22-0002 use December 7, 2023, from original Funding Approval/Agreements,
checked original-funding boxes and HUD signatures (PDF pp.1,7). The B22 form includes
prior B21 funding in a displayed total; that total is not assigned as a B22 allocation.

The 193 effective dates and amounts in OIG 2023-FW-0001 Appendix E remain a separate
candidate table. They are not automatically initial execution dates: Columbia has
an approved report predating its listed effective date. The DRGR API's grant year,
publication dates and later award snapshots also do not establish initial execution.

Q1 is the calendar reporting quarter containing the verified initial execution
date and may be partial. Q4/Q12/Q20 end at calendar-quarter ends, not exact
12/36/60-month anniversaries. The six outcomes are cumulative expenditure divided
by compatible allocation and by compatible obligation at each horizon. Missing or
nonpositive denominators and incomplete histories remain null, not zero. F31
opening cumulative histories are not reconciled: its six certified outcomes remain
unavailable. Observed-window flows are diagnostics, not certified cumulative values.

Independent QPR evidence supplies same-scope **To Date** values at exact horizons.
This release has 59 verified-period reports across 27 awards and 3,012 exact
F31 activity-horizon matches. Approved reports yield 2,526 activity E/O and 2,591
activity E/allocated-budget values. Whole-grant E/O is available at Q4 for 22 awards,
Q12 for 20 and Q20 for 10; the municipal administering subset is 8, 6 and 2.
These selected observations do not support a comparable ranking or causal model.

At the activity scope, **allocated activity budget** means QPR Total Budget, To Date.
HUD's DRGR Release 7.3 drawdown guide (PDF p.16) identifies this as allocated
activity funds, distinct from obligations; budgets and obligations may include
program income. It is a revised reporting-vintage amount, not original whole-grant
award, all-source projected cost or beneficiary-city allocation. Budget values
and their definition source accompany every eligible E/allocated ratio.

Whole-grant programmed budget is never substituted for allocation. Only Moore Q4
has an independently documented historical whole-grant allocation denominator:
$52.2 million, from the two allocations in HUD OIG 2015-FW-1003 (PDF p.5, printed
p.3), consistent with the exact grant's QPR. The later Moore allocation history and
all other whole-grant allocation denominators remain unverified. Proposed notices,
amendments with unresolved approval dates, and later cover awards are not applied
retroactively. Activity and whole-grant six-field outputs are explicitly separated.

QPR publication/revision date, review status, original ID, source hash and page
travel with values. Only Reviewed and Approved reports produce eligible ratios.
Recovered NYC Q20 (477-page city copy, different from malformed 469-page HUD copy)
and Minot Q20 are Original - In Progress. Tuscaloosa Q20 and Houston Q12/Q20 are
Submitted - Await for Review. Their source amounts remain visible but ratios are
null. A New Orleans link labeled 2019 Q1 opens a 2018 Q4 cover and is excluded
from Q20. Birmingham's unavailable original and a malformed Jefferson County PDF
contribute no values. Alternate files and failures remain in the inventory.

HUD's QPR FAQ (PDF pp.6,14) warns that activity lists may omit unchanged activities
and that expenditures differ from drawdowns. Listed or matched activity sums are
not complete grant/category totals. Differences are recorded, never adjusted away.
NYC Q4 E/O above 100% is retained and flagged. Moore's Q20 E/O declines despite
rising expenditure because obligations increase. Negative numerators are retained;
ratios are not capped. A footer mistaken for Moore's category was repaired from
its continuation page; Springfield's wrapped economic category uses the same
report's ancillary table. Tuscaloosa's truncated economic headers remain unresolved.
QPR vintages must not be spliced into the F31 quarterly net-flow histories.

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

March 2025 ASPEP individual-government employment adds a flagged benchmark for
2,855 municipal places, including 234 financially linked places, and 9,470 function
rows. Total employment (000), financial administration (023), other government
administration (029) and housing/community development (050) remain separate.
Full-time and part-time employee counts are persons; payroll is nominal USD for
a standardized 31-day March period. Retain item-level reported/imputed flags.
The exact six-digit ASPEP government PID joins the 2024 government directory; both
records must be active municipalities and official FIPS states must agree. ASPEP's
legacy state code is not a FIPS code. No fuzzy name join is used. These sampled,
potentially imputed municipality-wide inputs are not CDBG-specific staffing,
quarterly staffing, or an accurate individual-government time series. Missing is
not zero; total employment must not be added to its functional components.

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
award-time controls. CDBG-specific staffing and legal zoning remain unpopulated.

The map uses 2025 Census land-clipped cartographic display boundaries, further
simplified for responsiveness, with regional Albers equal-area conic projections.
Counties/parishes, places and subdivisions load by state. Alaska, Hawaii and
territories have separate regional views. Reference boundaries never imply a
funded activity. Display geometry must not be used for analytical attribution.
Identity sources may have 2022, 2023 or 2026 vintages; historical boundary
equivalence is not assumed merely because GEOIDs match.

## Archive and transformer-assisted search

The previous release primarily used HUD recipient metadata and exact-horizon
matching; it did not systematically enumerate city archives. A missing HUD entry
was insufficient evidence that a public report was absent. This release inventories
40 municipal awards across 20 city identities, with 38 exact grants in
retrieved HUD metadata. All returned QPR quarters/publication dates and current
action-plan links are recorded. Of 21 official city index pages attempted,
19 were retrieved; 1023 document entries retain linked, unreviewed, validated,
failed and conflicting versions separately. Fort Worth returned HTTP 403 and was
not bypassed. Birmingham's TLS failure prevented source-layout verification.
One-level link enumeration can miss dynamically loaded, unlinked or historic files.
Most non-horizon quarters and amendment bodies remain unread. No exhaustive
archive-review claim is made.

An existing local sentence-transformers/all-MiniLM-L6-v2 model (revision
c9745ed1d9f207416be6d2e6f8de32d1f16199bf) ranked 4,028 overlapping chunks from
27 retrieved public documents / 2,033 pages. Seven documented queries cover
execution dates, amendments, denominator definitions, categories, activity-list
omissions and geography. Normalized embeddings and cosine top-12 retrieval ran
offline on CPU; no paid API, model download, credentials or document upload.
Ranking supplies leads, not facts or completeness. Original pages and deterministic
ID/period/value checks govern acceptance. Raw PDF text and embeddings stay local;
the public search-method file gives model hash, queries, coverage and reviewed findings.

## Reuse and reproducibility

Full download bundles contain CSV plus dictionaries and source metadata. Filtered
exports correspond to the selected view. Each financial bundle is one snapshot;
relationship-view overlaps are flagged. Public source URLs, retrieval dates,
SHA-256 receipts, reporting/publication vintages and source pages are retained.
The accompanying local acquisition/build pipeline preserves raw public inputs,
exact integer-cent transformations, category rules, GIS operations and tests.
Original research inputs are unchanged. No credentials or private correspondence
are needed by the static site. The official CECREH logo is used unchanged.

CSV uses UTF-8 with a BOM. Text beginning with spreadsheet formula characters is
prefixed with an apostrophe for safe import; signed numeric financial values are
unchanged. JSON retains original text. Read identifier columns as text.

## Government universe and semantic identity audit

The 2026 Census listing covers 50 states and DC, with 91,729 independent local
governments, 1,323 dependent school systems and 4,338 public pension systems.
These are separate categories. Fiscal year ends June 30, 2026; extraction August
13; release September 24. The 2022 historical listing retains 90,837 independent
governments and 1,313 dependent schools. A dormant N flag does not mean dissolved.
Exact comparison finds 1,505 independent 2026 PIDs absent from 2022 and 608 old
PIDs absent from 2026; these are listing differences, not formation/dissolution.
All 1,494 financial GOV2022 identity PIDs occur in 2026. Existing financial
identity vintage remains 2022. 54 financial entities still lack a geographic
reference; no candidate is automatically accepted. Contact/address fields are omitted.

Offline MiniLM processed all 3,283 distinct nonblank financial organization/state
queries against 170,286 references: 97,390 current government/dependent/pension
records, 608 historical-only units and 72,288 cartographic references. Top three
government and top three boundary candidates within source state are review-only.
Similarity is not a probability, proof of identity, funding or nationwide completeness.
Reference county may be headquarters/most-served area, not a service boundary.
Tribal and territorial governments and school/special-district service polygons
are outside the supplied government/boundary scope. Name/type and Connecticut
planning-region discrepancies remain flagged, not silently merged.

Eight 2025 consolidated-city cartographic features are added. Nashville-Davidson
uses concity:4752004, not its smaller balance place. Consolidated city–county
financial rows now participate in city views with their exact existing reference
kind (concity or county). A place covariate is never substituted for those areas;
place context remains blank unless an exact place GEOID exists.

## Municipal identity and NYC borough review

Exact 2022 Census municipal PID6 and official place codes correct New York City
(3651000), New Orleans (2255000), Philadelphia (4260000) and Denver (0820000).
The old county references are preserved in the identity review, not treated as
municipal footprint. NYC is not Manhattan. These corrections restore 2,373
administering-city financial rows (NYC 1,871; New Orleans 496; Philadelphia 6).
They add 847 responsible-city rows. Denver contributes through its responsible
role. All original financial IDs, amounts and rows are unchanged. Administrative
identity does not establish beneficiary location. Terrebonne's parishwide
government is not replaced with the smaller Houma place. Place context now links
964 financial identities: 964 ACS, 283 government-finance and 234 employment
benchmarks. Four added unsimplified municipal polygons use the same source
vintages and methods as the earlier 960: 889 NFHL mapped, 75 unmapped, with
964 NLCD and LCMS summaries. Old 960 spatial records remain unchanged.

NYC borough evidence enumerates every listed activity in three retrieved Sandy
award B-13-MS-36-0001 reports: 2014Q2 (Q4), 2016Q2 (Q12), 2018Q2 (Q20).
It contains 300 source-period activity records, not 300 unique longitudinal
projects: 30 single-borough, one multi-borough, five citywide and 264 unknown.
Only explicit borough names or citywide statements in the Location Description
field determine scope. Administration-office addresses are excluded; neighborhood
and street names are not automatically geocoded. Original activity identifiers,
financial source pages, review status and publication vintage travel with each
record. All 1,800 period/cumulative financial cells were independently checked
against PDF word coordinates. Lifecycle/other-round source flags remain visible.
Pending deletion and renamed/associated activities must not be added together.

Borough county-equivalent codes follow the official NYC Census table. Boundaries
are 2025 land-clipped county references displayed in Albers, not project footprints.
Citywide and multi-borough money stays once on its original activity record;
borough allocation and beneficiary fields remain blank. Borough filtering
selects explicit named scopes and excludes unassigned citywide records. There is
no borough money total or choropleth. Reports are separate cumulative vintages,
never additive across quarters. The Q12 listed activity sums differ materially
from whole-report totals; QPRs may omit unchanged activities. Q4/Q20 listed sums
reconcile in these versions, but that does not establish complete geography.
Q20 remains Original - In Progress. No new eligible ratios are inferred.

Exact original project/activity keys match F31 for 221 source records; only 106
also match the same calendar quarter. No source-specific renamed ID is guessed.
The borough evidence stays separate from the quarterly F31 history. It covers
one NYC award and three periods, not all NYC financial activities. Eight additional
offline MiniLM queries ranked 4,028 passages in the same 27-document corpus;
all geographic decisions use exact fields and source pages, not similarity.
The requirement-by-requirement table is in data/requirements-coverage.json.
