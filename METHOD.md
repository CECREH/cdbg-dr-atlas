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
national panel. Three additional panel clocks initially brought the national count to 29; a subsequent Dauphin review suspends one, leaving
28 of 206 national awards. A separately sourced Joplin QPR award is outside F31. Houston B-16-MH-48-0001 uses December 7, 2016, explicitly stated
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
This release has 65 verified-period reports across 27 awards and 3,121 exact
F31 activity-horizon matches. Approved reports yield 2,631 activity E/O and 2,698
activity E/allocated-budget values. Whole-grant E/O is available at Q4 for 23 awards,
Q12 for 23 and Q20 for 11; the municipal administering subset is 9, 8 and 2.
These selected observations do not support a comparable ranking or causal model.

At the activity scope, **allocated activity budget** means QPR Total Budget, To Date.
HUD's DRGR Release 7.3 drawdown guide (PDF p.16) identifies this as allocated
activity funds, distinct from obligations; budgets and obligations may include
program income. It is a revised reporting-vintage amount, not original whole-grant
award, all-source projected cost or beneficiary-city allocation. Budget values
and their definition source accompany every eligible E/allocated ratio.

Whole-grant programmed budget is never substituted for allocation. Moore Q4
has a $52.2 million denominator from two allocations in HUD OIG 2015-FW-1003
(PDF p.5, printed p.3). Minot Q4 has a $35,056,000 total 2013 allocation in the
Federal Register (May 29, 2013, PDF p.2), corroborated by HUD OIG 2015-KC-1002
and its 2014Q4 QPR. These differ from partial grant obligations or programmed
budgets. Later Moore and Minot allocation histories remain unverified. New Orleans,
Springfield and Joplin Q4 additionally use the 2013 Federal Register allocation
with city documents and approved QPR award headers; the full intervening
amendment history is not claimed exhaustive. Proposed notices,
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


## Unified map navigation — interface update, 28 October 2026

States remain visible while county/equivalent outlines appear at 4,000 projected
metres per CSS pixel or closer, and municipal place/consolidated-city references
at 750 metres per pixel or closer. County outlines remain visible over municipal
fills. The map fetches state files intersecting the viewport, culls features to the
view, caches results, and ignores responses from superseded views. Region-specific
Albers projection and 2025 land-clipped geometry are unchanged. Alaska, Hawaii
and territories retain explicit regional views. The state selector changes the
map view, not financial filters. Zoom can move continuously from a fitted city
back to the regional overview; display detail is not analysis resolution.

Clicking or keyboard-focusing the map activates wheel zoom around the pointer.
Escape, its toggle button, or clicking/focusing outside the map releases that
mode. The page still scrolls outside the map. Browser Control/Command zoom
signals are not captured. Buttons, arrow keys, +/−, reset, and a searchable list
provide alternatives to pointer gestures. A map-only boundary selection does not
filter funding; a separately documented government-identity or reported-scope
link is required to select associated financial rows.

`data/geo/place-classification.json` joins all 32,629 existing place GEOIDs to
LSAD fields from the same 2025 Census cartographic source (SHA-256 recorded in
that file). Codes 55, 57 and 62 identify 12,896 statistical places (including
Puerto Rico comunidades and zonas urbanas); the exact Census `(balance)` qualifier
identifies 8 partial city-balance areas. The other 19,725 place references are
shown as municipal places, not asserted active/independent governments. The 8
consolidated cities remain their separate full boundaries. Statistical/balance
places are optional, or visible when individually selected. Towns/townships that
Census represents as county subdivisions require the optional subdivision view;
CDPs and arbitrary subdivisions are not relabeled as municipal governments.

Official definitions: https://www.census.gov/library/reference/code-lists/legal-status-codes.html

An empty view is distinct from a failed boundary file: failures display an
incomplete-coverage warning and a retry control. No financial values, original
records, context measures, borough evidence, source snapshots, existing geometry,
or existing downloadable dataset were changed by this navigation update.


## CECREH visual identity

The interface uses the CECREH official site's scarlet (#E90802), black and white,
with its published snow, soft and muted neutrals and CTA hover red (#CF0702).
The official CECREH logo is unchanged. Red-tinted map shapes are boundary or
source-evidence categories, not financial magnitudes. The darker official hover
red provides readable small text on pale backgrounds. Sources:
https://www.depts.ttu.edu/cecreh/ and https://www.ttu.edu/brand/websites/index.php.

## Additional municipal QPR evidence

The first Municipal QPR batch added a selected sample of 61 HUD-approved reports from
13 administering cities and 16 awards. We retrieved 62 HUD public-indexed PDF
versions from selected 2015–2018 and 2024 calendar windows; one NYC 2017Q1 file
could not be opened by the independent PDF reader and is excluded. Missing or
unreadable reports are not evidence that no report exists. This sample is not a
complete national archive or a complete activity list.

The 918 activity-quarter observations retain the original report's award,
project and activity identifiers. Of those, 878 have an exact award/project/
activity match to the existing national F31 panel; 40 NYC administration/planning
observations retain their original QPR identifiers without an inferred F31
crosswalk. For 429 observations the same activity and quarter also appear in the national
F31 snapshot; all 858 period expenditure/obligation cells agree exactly. The other
financial fields and unmatched quarters were not checked in that comparison. A
QPR record and an F31 transaction remain
independent sources even when identifiers match; do not add or silently substitute
one for the other. Address-bearing IDs/titles and unverified activity identifiers
outside the limited NYC program-level exception are excluded. Raw narratives and
household addresses are not exported.

Every accepted activity has six independently anchored PDF monetary cells:
period and to-date figures for Total Budget, Total Obligated, and Total Funds
Expended. Negative adjustments remain signed. QPR Total Budget for an activity is
an allocated activity budget that may include program income; the overall grant
Total Budget is a programmed budget. Neither establishes a beneficiary-city
allocation or the original whole-grant award. Sixty-one reported grant-award
headers are included as values printed on the specific QPR version, not certified
as the initial award or the award-relative-horizon denominator. Publication dates,
review status, source URLs, SHA-256 and source page numbers accompany each record.

The administering government follows the exact original award and does not
establish the beneficiary city or where an activity occurred. Initial award dates
and award-relative quarters are shown only when independently verified in the
existing award evidence; Q1 can be partial. No new Q4/Q12/Q20 outcome or local
allocation was invented from that first batch of non-horizon quarters. To-date QPR
amounts are cumulative snapshots and must not be added across quarters. QPR
activity listings may omit activities and may not sum to whole-grant totals.

Extraction used original PDF text coordinates and retained the period and to-date
columns separately. An independent Poppler layout pass checked all 61 reports'
identity, period, HUD review status and grant-award header; all 366 whole-grant
monetary cells; 243 stratified activity records including signed corrections; and
all 979 financial table headers. No independent check failed. A cached local
MiniLM-L6-v2 transformer ranked pages for grant identity, financial tables and
agreement/allocation evidence in all 62 retrieved documents, including the one
excluded PDF. Its results are search leads, never automatic financial, identity,
location or award-date facts. No private content or model query left the computer.

Download the selected activity records, grant records, JSON source evidence and
search log from the atlas. F31/context bundles remain separate; later releases
may update metadata and verified clock classifications without changing source money. Source definitions: https://files.hudexchange.info/resources/documents/DRGRKnowledgebaseFAQs_QPR.pdf
and https://files.hudexchange.info/resources/documents/Draft-User-Guide-DRGR-Drawdown-Module-Release-73.pdf.


## October 28 source expansion and clock review

The next selected HUD-indexed pass retrieved 240 additional PDF versions. Of
these, 236 approved reports across 21 awards and 13 administering cities passed
award/period, status, source-version and whole-grant financial checks; four were
excluded with their reasons in the inventory. It adds 3,522 activity-quarter
records: 3,418 exact original F31 activity IDs and 104 historic NYC QPR-only
administration/planning IDs. Forty earlier reports do not print a grant-award
header; that field remains blank. The combined sample has 297 reports and 4,440
activity-quarter records. The QPR list can omit activities and is not a complete
panel. Totals are report snapshots, not additive across periods or with F31.

An independent Poppler pass verified all 236 report identities and whole-grant
values, 196 printed grant-award headers, 3,758 financial headers and 754
stratified activity records, including negative corrections; no check failed.
Among 1,719 additional exact F31 activity-and-quarter matches, 1,718 pairs agree
on both period obligation and expenditure. One NYC Housing-R4 expenditure is
$133,245,970.76 in the QPR and $133,245,970.80 in F31; the F31 row already carries
a precision flag. Both source values and the four-cent discrepancy are retained.
A locally cached MiniLM-L6-v2 model ranked 11,964 pages from 240 public PDFs for
720 finance/identity/date queries; results are leads verified against pages, not
a completeness guarantee. No private material was sent to the model.

Seven additional approved QPR versions were independently checked at the source
pages: Minot Q4 and Q12; Joplin Q4 and Q12; Jefferson County Q12 and Q20; and
Cook County Q20. County administering amounts do not become city allocations.
Joplin Q4 reports expenditure with zero obligations, so its E/O is null. F31
matched activity sums are not assumed complete or reconciled to whole-report
totals. The 2012 Minot award has HUD and city signatures in different quarters;
the effective-date rule is unresolved and no start is assigned.

For Dauphin B-13-US-42-0001, HUD's 2019/2023 summaries label January 1, 2014 as
the initial grant agreement effective date; a 2018 HUD extension report labels
January 16, 2015 as an obligation date. Their relationship is not established.
The former Q20 assignment is suspended; original calendar-quarter report and
activity amounts and both references remain in `data/award-clock-review.json`.
No financial amounts were altered.

Cook County's Q20 QPR explicitly names Harvey, Wheeling, Riverdale, Berkeley
and Robbins in six activity scopes. These are source-described project scopes
with 2025 reference GEOIDs, not beneficiary locations or spending allocations.
The Harvey source also mentions a township whose identity is unresolved; its
place list is partial. A negative geographic phrase such as outside Chicago
is not counted as a Chicago scope. Source pages, status and original IDs are
in `data/activity-place-evidence.json` and its CSV.


## Source acquisition and QPR opening-balance diagnostics

### Scanned-source and continuity review

Sixteen acquired documents without extractable native text were OCRed across
436 pages, and a local offline transformer ranked overlapping text chunks as
search leads. Targeted original pages have now been inspected in all sixteen
documents. This was not a full page-by-page audit; OCR is fallible and no search
guarantees that all documents, amendments or relevant statements were found.
The review ledger identifies pages and source status in
`data/scanned-source-review-v47.json`.

For Chicago's Albany Park Tunnel activity, reported Q1 and Q2 2016 cumulative
amounts do not reconcile, while whole-grant expenditure and obligation do. The
QPR narratives discuss an approved substantial plan amendment and a later
requested grant amendment, but do not establish the cause of the activity-level
break. For Joplin's activity 04-A, 2012Q4 and 2014Q2 show opposite $3,899.87
discontinuities at both activity and whole-grant level across report copies
published in different years. The matching magnitude is a clue, not proof of
a revision. Original values and source versions remain unchanged; see
`data/continuity-review-v46.json` and the linked IDs in the QPR CSV.

The Federal Register allocated $45,266,709 to Joplin in 2012 and required the
direct grant to be spent within its jurisdiction. This condition does not locate
individual activities or beneficiaries. A 2023 OIG table reports an effective
date of September 14, 2012 for B-12-MT-29-0001, while a 2014 OIG audit says HUD
signed September 15 and the city signed October 16. The latter date is in a
different quarter. The original agreement and date rule are needed; no clock
or milestone ratio is assigned. A city archive link labeled Round II contains
a 2012 first-round plan, whose printed initial approval date conflicts with its
own amendment chronology. A separate amendment labels itself Round I but cites
the 2013 law. These source conflicts remain in the archive inventory.

Tuscaloosa's scanned amendment 23 proposes $43,931,998.75 in projects;
amendment 29 prints $43,932,273.89 in CDBG and $67,576,124.03 in other funds,
but a $111,053,378.66 project total, $455,019.26 below the sum of those printed
components. Approval dates are not established. They are source-specific
proposals, not verified award denominators. See `data/plan-budget-review-v46.json`.

A separate plan copy for Tuscaloosa’s 2012 grant is labelled draft on its cover, despite
"final" in its filename. Its executive summary prints $19,564,233.80, while
its project table prints $19,564,223.80, including $2,929,394.10 of program
income. The table components sum to the table total. Neither conflicting total
is treated as an approved or historical whole-grant allocation.

An approved Joplin 2013Q3 QPR lists four projects and their to-date project
funds budgeted and period/to-date program-fund drawdowns. These observations
are provided separately in `downloads/joplin-project-quarter-v47.csv`: they
are projects, not original activities or beneficiary allocations. Drawdowns
are not expenditures, and project values are nested within the whole grant.
This one source's four budgets and drawdowns reconcile to the corresponding
whole-grant values. A city-hosted submitted version agrees on six grant-level
financial cells but differs in other values and must not be added to the HUD
approved copy. Neither version supplies activity headers or an award clock;
source pages, version status and hashes are in `data/joplin-project-evidence-v47.json`.

Four San Marcos B-16-MH-48-0002 city-archive QPR copies have been retrieved and
checked. The 2016Q4 report says execution occurred in December 2016; an OIG
table separately lists an effective date of December 9, 2016 without calling it
the initial effective date. The original agreement is still needed to verify
the exact award clock. The 2017Q3 copy is in progress, the 2019Q3 copy awaits
HUD review, and the 2021Q3 copy is reviewed and approved. Their documented
whole-grant calendar-period values, versions, source pages and hashes are in
`data/award-clock-review.json`; they are not assigned Q4/Q12/Q20 ratios. A
report's budget is not automatically the historical total allocation.

An additional 195 public-source leads were attempted; 173 documents were
captured and rehashed and 22 returned HTTP 403. Eight documents initially
exceeded a 30 MB limit but were captured after their HTTP 200 sizes were checked.
Another Florida index returned 403 and was not bypassed. Raw documents and the
local manifest are not themselves approved for redistribution. The local
MiniLM model ran four queries on each captured document, indexing 7,318 native
text pages or DOCX chunks; 16 documents had no extractable text. Scanned pages
need OCR, and no semantic match establishes a financial or legal fact.

The downloadable QPR quarter panel retains 4,440 source observations. Implied
opening equals the same QPR version's cumulative amount less that period's
change. Where an immediately preceding source activity-quarter is present,
the panel compares its cumulative amount; otherwise the prior value is blank.
Expenditure has 2,931 adjacent matches and 3 differences; obligation has 2,933
matches and 1 difference. There are 1,506 observations with no immediately
preceding activity-quarter in this selected corpus, and no Q1 activity record
with a verified clock. These diagnostics do not establish a zero grant-start
opening, completeness of activity listings, or interchangeability with F31.
Original source hashes, dates, pages and signed differences accompany the data.

The 2013 Federal Register, Table 1 (PDF p.2), allocates $15,031,000 to New
Orleans, $21,896,000 to Springfield and $113,276,000 to Joplin. The March 2015
New Orleans substantial action plan (p.2), 2013 Springfield partial action plan
(p.5) and September 2015 Joplin council draft (p.3) independently repeat these
allocations; the council draft is not proof of amendment approval. Each approved
Q4 QPR identifies the matching grant and award amount, reports cumulative
expenditure and zero program income (p.3). Ratios use those total allocations,
not the smaller programmed budgets or partial obligations. The QPR versions
may have been published later than the reporting period; full amendment histories
are not claimed exhaustive. New Orleans' April 2014 HUD letter calls the
enclosed executed document an initial grant agreement, while its funding form
checks Amendment; the date is independently labeled initial in HUD's 2019 and
2023 summaries. The Oregon copy in the local archive has a blank HUD signature
and is not assigned an award clock. Source URLs and hashes are in
`data/allocation-evidence-v45.json`.


### Earlier Springfield municipal award pilot (v48; B-13-MS-25-0001)

HUD financial summaries report the initial agreement effective date as December
13, 2013. The calendar quarter containing it is Q1 and may be partial. The
retrieved HUD and city indexes did not locate a 2013Q4 QPR, so Q1 remains
unknown. Nineteen approved source versions cover Q2–Q20 (2014Q1–2018Q3);
publication dates are retained when available. Each PDF's grant, period, review
status and hash were checked. All 347 listed activity headers and 109 project
summary rows were extracted; source-listed activities may still be incomplete.
Every monetary pair was read from the original same-line PDF coordinates and
independently checked against Poppler layout text. There are 117 rows beyond the
existing selected quarterly view; 52 of those already appeared as cumulative
milestone evidence and 65 were absent from both prior views. Sixty-one rows
have no exact national F31 activity key and are labelled QPR-only. Ninety-eight
rows have an extension ID which may be linked to another activity; no automatic
addition or inferred crosswalk is made.

For each source version, implied opening equals to-date minus this-period.
Expenditure and obligation openings agree with the prior listed whole-grant
QPR in all 18 adjacent pairs. The first observed opening does not establish the
missing Q1 or a certified grant-start balance. Seven budget comparisons differ.
In 2017Q3, the QPR shows $0 budget for the period and $21,994,586.32 to date,
while the 2017Q2 QPR shows $13,962,254.23 to date: the implied-opening
difference is $8,032,332.09. The 2017Q3 listed activity budgets are $7,990,000
below the overall budget. The cause is not established; both source versions
and all differences remain in the downloadable inventory. Project funds
budgeted and the grant's Total Budget are distinct reported scopes and can
differ. Sums of listed activities or project summaries are diagnostics, not
proof of complete activity history; grant, project and activity totals are
nested and must not be added together. Drawdown is not expenditure.

The 2013 Federal Register identifies a $21,896,000 whole-grant allocation.
Partial Action Plan A describes $13,906,000 in that plan and $7,990,000 for
future plans; those are not two additional grants. City documents state three
different dates for approval of Plan A (December 11, 13 and 14, 2013). These
are source-specific statements about plan approval, not the HUD-reported grant
agreement effective date. Amendment #3 is dated May 2017 and describes assigning
the remaining $7,990,000. Its page 4 says a final version was published after
May 8–14 public comment; HUD approval/effective date is not established from
those pages. The 2017Q3 QPR says HUD approved amendments moving funds from
two activities but does not identify amendment #3 or a date in that passage.
Q12 and Q20 whole-grant allocation denominators remain unverified pending full
historical amendment and program-income reconciliation.

The pilot also exports six activity-level milestone fields for each exact
project/activity identity. At Q4/Q12/Q20, 7/18/25 reported activities have a
positive cumulative obligation denominator, and 11/18/25 have a positive QPR
activity Total Budget denominator. The latter can include program income and
is labelled as a reported activity budget, not a verified whole-grant or local
allocation. A missing source row or nonpositive denominator yields a blank ratio;
negative numerators and values over one are retained and flagged. Proportions are
rounded to 12 decimal places and exact source cents travel with them. Linked
extensions and changed project IDs are not merged or summed by similarity. The
pilot adds eight Q12 extension and one Q20 planning activity with ratios beyond
the previously published milestone sample.


Download the [award inventory](downloads/springfield-award-quarter-v48.csv),
[project summaries](downloads/springfield-project-quarter-v48.csv),
[activity records](downloads/springfield-activity-quarter-v48.csv),
[activity milestone ratios](downloads/springfield-activity-milestones-v48.csv) and
[source evidence](data/springfield-pilot-v48.json). The city is the administering
government, not a verified beneficiary location; no geographic shares are inferred.

An offline cached MiniLM transformer ranked passages from the 19 QPRs and six
related official plan, financial-summary and Federal Register documents. It ran
200 document-scoped queries across 1,914 chunks from 849 PDF pages. The
[search log](data/springfield-search-v48.json) contains page numbers and scores,
not document text. Similarity is a retrieval lead, not proof of an agreement,
approval, location or a complete archive; source pages still require review.

### Springfield award evidence and reported horizon ratios

HUD's [March 27, 2013 announcement](https://archives.hud.gov/news/2013/pr13-038.cfm)
allocated $21,896,000 directly to Springfield for its 2011 storms. Its
[November 5 announcement](https://archives.hud.gov/news/2013/pr13-158.cfm)
reported approval of a $13,906,000 Springfield recovery plan. Neither press
release prints a grant ID; linkage to B-13-MS-25-0001 uses the 2013 city plan and
HUD's grant report. The exact relation between this plan announcement and
the later conflicting Plan A approval dates remains unresolved.
HUD's [June 2018 extension report, p. 2](https://www.hud.gov/sites/dfiles/CPD/documents/CDBG-DR/PL-113-2-Grant-Extension-Report-2018-06-01.pdf#page=2)
lists a $13,906,000 obligation for the exact grant on December 13, 2013.
It lists extended funds, not all obligations, and does not substantiate a later
$7,990,000 obligation date. These events are distinct, not additive.

The approved Q4, Q12 and Q20 QPRs print a $21,896,000 Grant Award Amount on
page 2 and report whole-grant cumulative expenditure and obligation on page 3.
Their descriptive expenditure / reported-award ratios are 20.53%, 45.45% and
58.26%, respectively. They use total-funds expenditure; program income may be
included, so these are not certified federal-only expenditure ratios. The QPR
award-header as-of date and full amendment history are not independently
certified; the Q20 report's publication date is unavailable. Q12/Q20 remain
blank in the stricter certified-allocation outcomes. Q1 is the agreement's
calendar quarter and may be partial; no Q1 baseline is inferred. Whole-grant
amounts do not establish a beneficiary location or an activity allocation.

At Q12, QPR overall budget less program income received equals $13,906,000; at
Q20 it equals $21,896,000. In the 2017Q2/Q3 source versions, the $8,032,332.09
increase in cumulative budget equals $7,990,000 plus $37,219.65 and $5,112.44
of respective period program-income receipts arithmetically. The Q3 reported
period budget is zero. This arithmetic does not prove an accounting mechanism,
amendment approval date or absence of source revisions. Income received and
drawdowns are not expenditures. Preserve source vintages and do not add QPR
cumulative quarters or the allocation, plan and obligation events.

[Reported award horizon ratios](downloads/springfield-award-horizon-observed-v49.csv),
[dated source events](downloads/springfield-award-events-v49.csv), and
[source evidence and reconciliation](data/springfield-allocation-evidence-v49.json)
include exact cents, source pages, dates and missingness.

### Expanded Springfield pilot and HUD snapshot sources

For B-13-MS-25-0001, the expanded source-backed pilot has 24 reviewed and
approved QPR versions: Q2–Q24 (2014Q1–2019Q3) and Q46 (2025Q1). The Q1
report and Q25–Q45 (2019Q4–2024Q4) were not located in the checked HUD and city
indexes. This is a source-coverage statement, not evidence that the reports
do not exist or the amounts are zero. Publication dates remain blank where
not established. The pilot contains 508 listed activity-quarter rows and 191
project-quarter summaries; 161 activity rows are beyond v48, of which six were
already in the general QPR panel. Thus 155 are absent from both earlier views.
The v50 pilot includes and overlaps v48; do not add versions or sum nested
project, activity and grant figures. Reports need not list every activity.

Two categories are read from a next-page continuation, with original source
pages retained. Four truncated extension types are read from a same-report
ancillary table naming the exact project and extension ID; the original
truncated heading is preserved. The four corresponding base-activity type
headings remain unresolved. Administration stays outside the requested 16
categories. Extension IDs, including (E-2), can overlap related activities.
QPR source-version implied openings and differences are diagnostics, not
verified grant-start balances. Signed negative adjustments are preserved.

The [HUD public data index](https://drgr.hud.gov/public/data_downloads.html?programName=DR+CDBG)
lists three financial workbooks and one activity-performance workbook dated
July 1, 2023. Three Springfield grant rows agree on reported grant amount
$21,896,000, obligations $22,102,221.10 and disbursement/drawdown
$20,701,850.23. They are overlapping report views; their index date is not a
verified reporting cutoff. A field in the monthly report is explicitly marked
deprecated. Drawdown is not expenditure. The performance workbook contains 74
Springfield measure rows in a compressed hierarchy, has no project ID, and is
not a financial quarterly export. The local F23 workbook is filtered to
technical-assistance grants and does not contain this Springfield award.

Use the [expanded activity records](downloads/springfield-activity-quarter-v50.csv),
[award inventory](downloads/springfield-award-quarter-v50.csv),
[project summaries](downloads/springfield-project-quarter-v50.csv),
[activity milestones](downloads/springfield-activity-milestones-v50.csv), and
[HUD snapshot evidence](data/springfield-hud-2023-evidence-v50.json).
