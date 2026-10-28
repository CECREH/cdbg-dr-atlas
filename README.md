# CDBG-DR Research Atlas

Live: https://cecreh.github.io/cdbg-dr-atlas/

Public CECREH atlas with searchable financial records, projected land-clipped county
and place maps, downloadable city × award × original activity × quarter data,
six Q4/Q12/Q20 outcomes with eligibility, and dated city context. The official
CECREH logo is unchanged. This is a standalone site; no links were added elsewhere.

## Current preliminary coverage

- National: 128,382 quarterly rows / 206 awards / 16,150 activities, 2002Q2–2025Q1.
- Texas: 6,518 rows / 2 awards / 775 activities, 2018Q3–2026Q1. **Choose one snapshot.**
- Verified initial clocks: 28 of 206 national awards, plus supplementary QPR-only Joplin. Unknown or unresolved dates remain null.
- City original-activity rows: national 7,225 administering / 19,140 responsible;
  Texas 0 / 1,220. Roles overlap; neither establishes beneficiary location.
- Historical QPR horizons: 65 reports / 27 awards / 3,121 exact activity-horizon matches;
  2,631 approved activity E/O and 2,698 activity E/allocated-budget values.
- Whole-grant approved E/O: Q4 23, Q12 23, Q20 11. Whole-grant E/allocation:
  Moore, Minot, New Orleans, Springfield and Joplin Q4. Activity budgets can include program income and are a different scope.
- ACS: 32,330 places with direct estimates/MOEs; all 964 financial-place identities.
- Government-finance sample inputs: 3,843 places / 283 financial links.
- March 2025 employment benchmark: 2,855 places / 234 financial links; flags retained.
- Spatial context: 964 place polygons; 889 NFHL mapped, 75 unmapped; NLCD/LCMS 964.
- Display boundaries: 3,235 counties, 32,629 places, 36,360 subdivisions.
- Archive inventory: 1,038 entries; 19/21 municipal index pages retrieved.
  Further local transformer searches covered 240 indexed PDFs and seven horizon PDFs. Search is not exhaustive.

## Read before analysis

Q1 contains execution and may be partial. Q4/Q12/Q20 are calendar-quarter horizons,
not exact anniversaries. F31 fields are signed quarterly net flows; QPR fields are
independent cumulative reporting vintages. Unapproved reports retain evidence but
no eligible ratios. Above-100% and negative corrections are preserved and flagged.
Beneficiary-city funding, most historical whole-grant allocations, historical
quarterly controls, program staffing and legal zoning remain unavailable.
No rankings or causal regression are justified by this selected coverage.

Use [Download data](https://cecreh.github.io/cdbg-dr-atlas/#downloads),
[METHOD.md](METHOD.md), [dictionary](downloads/data-dictionary.csv),
[source receipts](data/research-provenance.json), and the
[archive inventory](data/archive-inventory.json). Every table offers a filtered CSV.
National/Texas bundles are separate; repeated context and horizon fields are not additive.
Blank means unavailable; zero is observed. Money is integer cents, government-finance
inputs thousands of dollars, and employment payroll nominal dollars.

Only public-document financial/statistical facts and authorized source-derived data
are included. No raw workbooks, private correspondence, household locations or credentials.
Original inputs are preserved locally. Upstream license is in UPSTREAM-LICENSE.txt.

## Municipal identity update

NYC, New Orleans, Philadelphia and Denver now use exact official municipal place
codes. The city panel restores 2,373 administering and 847 responsible rows;
role views overlap. Original financial values are unchanged.

[NYC borough evidence](https://cecreh.github.io/cdbg-dr-atlas/#boroughs) adds all
300 listed activities from three Sandy QPRs, with explicit single/multi-borough,
citywide and unknown states, source pages, review status, and a selectable map.
No borough allocation is invented. Download [all 300 records](downloads/nyc-borough-evidence.csv)
or the filtered table. Read the [requirements coverage matrix](data/requirements-coverage.json):
the full requested beneficiary-city panel and universal historical ratios remain
incomplete, with exact missingness preserved.


### Unified map navigation

Counties and municipal places now share one projected map. County outlines appear
at regional zoom; municipality and consolidated-city outlines appear closer in,
with a separate option for statistical/balance places and county subdivisions.
Nearby state files load progressively. Click or focus the map for wheel zoom;
Escape or clicking elsewhere restores page scrolling. The visible-reference list
supports keyboard search and selection. Reference boundaries never allocate money.
See the navigation section in `METHOD.md` and `data/geo/place-classification.json`.

This interface update does not fill the outstanding research gaps. The coverage
matrix describes partial award clocks, historical allocations, cumulative
opening histories and beneficiary-city geography. Downloads retain explicit
source and method vintages as the evidence is updated.

### Additional municipal QPR sample and preliminary handoff

The Municipal QPRs section provides 4,440 selected original activity-quarter observations and
297 whole-grant report snapshots from 13 administering cities and 21 awards. It
shows reporting-period changes, cumulative values, grant-award headers, review
status, source pages and independently checked document versions. Download filtered
or complete activity and report CSVs from that section or Download data. The
sample is not a complete panel, and QPR snapshots must not be added across periods
or to the separate F31 snapshots. See `METHOD.md` for missingness and provenance.

The interface is a research preview, intended for feedback. Award start dates,
compatible historical allocation denominators and beneficiary-city locations
remain incomplete. The 2025 Census reference boundaries and municipality counts
are not a map of funded activities.

### Additional source review (October 28)

Seven independently verified milestone reports add Minot, Joplin, Cook County and
Jefferson County observations. Joplin is a supplementary QPR-only award outside
the national F31 panel. Its Q4 obligation is zero and its E/O is unavailable.
Minot Q4's $35,056,000 total allocation is independently supported by the Federal
Register, HUD OIG and its QPR. The 2012 Minot award has two signatures in different
quarters and no assigned clock. Dauphin County has different HUD date labels whose
relationship is unresolved; its earlier Q20 classification has been suspended,
while the calendar-period amounts are preserved in `data/award-clock-review.json`.

Six explicit Cook County QPR activity scopes name five municipalities; they are
searchable with original source pages. They do not apportion spending or establish
beneficiary locations. The additional selected QPR sample and review log are
available in the downloads section. See METHOD.md for validation and limits.

### Source acquisition and opening-balance review

The scanned-source review processed 436 pages from 16 documents and checked
selected original pages in all 16, not every page. A draft for Tuscaloosa’s 2012 grant has
a $10 conflict between its executive summary and project table; neither is
used as an approved denominator. Four Joplin 2013Q3 project-level budget and
drawdown observations are available in [CSV](downloads/joplin-project-quarter-v47.csv)
and [source evidence](data/joplin-project-evidence-v47.json). The review also
records conflicting Joplin agreement dates,
a mislabeled city archive link, and two Tuscaloosa proposed plan totals that
cannot yet establish an approved denominator. The QPR continuity review now
compares each flagged activity with its whole-grant source version; source values
remain unchanged and causes remain unverified. Details and source links are in
`METHOD.md` and the downloadable research metadata.

A local archive now records 173 public plans and agreements, with 22 denied
source URLs and exact hashes/statuses; the full archive remains incomplete.
The downloadable 4,440-row QPR quarter panel computes implied openings from
the period and to-date columns and compares the preceding listed quarter. Of
2,934 adjacent comparisons, 2,931 expenditure and 2,933 obligation pairs
reconcile; other differences remain visible. For 1,506 rows the prior activity
quarter is unavailable. No observed row has a verified-clock Q1 activity record,
so the exercise does not establish grant-start opening balances.

New Orleans, Springfield and Joplin Q4 E/total-allocation outcomes use the
2013 Federal Register allocations, city source documents and approved QPRs.
These are whole administering grants, not beneficiary-place allocations. The
Joplin council document is a draft, not proof its proposed amendment was approved.
New Orleans' 2014 transmittal calls its signed funding form an initial agreement,
while the form checks Amendment; the two official HUD summary reports also
identify the April 22, 2014 initial agreement date. See `METHOD.md` for sources.


### Earlier Springfield award pilot (v48)

A source-backed pilot for B-13-MS-25-0001 contains 19 approved reports in the
first 20 award-clock quarters, 347 listed activity-quarter records and 109
project-quarter summaries. The missing 2013Q4 report is unknown, not zero.
The source versions show seven programmed-budget continuity differences and
conflicting Plan A approval dates; their figures and sources remain unchanged.
Use the [activity CSV](downloads/springfield-activity-quarter-v48.csv),
[award inventory](downloads/springfield-award-quarter-v48.csv),
[project CSV](downloads/springfield-project-quarter-v48.csv),
[milestone ratios](downloads/springfield-activity-milestones-v48.csv) and
[source evidence](data/springfield-pilot-v48.json). See METHOD.md for definitions,
non-additivity, grant-clock and allocation limits.

Offline MiniLM searched the 19 pilot reports and six supporting documents with
200 document-scoped queries. [Search results](data/springfield-search-v48.json)
are leads only and do not establish approval, location or completeness.

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
