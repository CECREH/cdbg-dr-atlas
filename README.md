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
selected original pages in all 16, not every page. A 2012 Tuscaloosa draft has
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
