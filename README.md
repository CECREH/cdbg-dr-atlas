# CDBG-DR Research Atlas

Live: https://cecreh.github.io/cdbg-dr-atlas/

Public CECREH atlas with searchable financial records, projected land-clipped county
and place maps, downloadable city × award × original activity × quarter data,
six Q4/Q12/Q20 outcomes with eligibility, and dated city context. The official
CECREH logo is unchanged. This is a standalone site; no links were added elsewhere.

## Release 4.1 coverage

- National: 128,382 quarterly rows / 206 awards / 16,150 activities, 2002Q2–2025Q1.
- Texas: 6,518 rows / 2 awards / 775 activities, 2018Q3–2026Q1. **Choose one snapshot.**
- Verified initial clocks: 29 national awards. Unknown dates remain null.
- City original-activity rows: national 7,225 administering / 19,140 responsible;
  Texas 0 / 1,220. Roles overlap; neither establishes beneficiary location.
- Historical QPRs: 59 reports / 27 awards / 3,012 exact activity-horizon matches;
  2,526 approved activity E/O and 2,591 activity E/allocated-budget values.
- Whole-grant approved E/O: Q4 22, Q12 20, Q20 10. Whole-grant E/allocation:
  Moore Q4 only. Activity budgets can include program income and are a different scope.
- ACS: 32,330 places with direct estimates/MOEs; all 964 financial-place identities.
- Government-finance sample inputs: 3,843 places / 283 financial links.
- March 2025 employment benchmark: 2,855 places / 234 financial links; flags retained.
- Spatial context: 964 place polygons; 889 NFHL mapped, 75 unmapped; NLCD/LCMS 964.
- Display boundaries: 3,235 counties, 32,629 places, 36,360 subdivisions.
- Municipal archive inventory: 1023 entries; 19/21 index pages retrieved.
  Offline transformer retrieval: 27 documents / 2,033 pages. Search is not exhaustive.

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
matrix still describes partial award clocks, historical allocations, cumulative
opening histories and beneficiary-city geography. Existing data downloads are
unchanged; they retain their original source and method vintages.

### Additional municipal QPR sample and preliminary handoff

The Municipal QPRs section provides 918 original activity-quarter observations and
61 whole-grant report snapshots from 13 administering cities and 16 awards. It
shows reporting-period changes, cumulative values, grant-award headers, review
status, source pages and independently checked document versions. Download filtered
or complete activity and report CSVs from that section or Download data. The
sample is not a complete panel, and QPR snapshots must not be added across periods
or to the separate F31 snapshots. See `METHOD.md` for missingness and provenance.

The interface is a research preview, intended for feedback. Award start dates,
compatible historical allocation denominators and beneficiary-city locations
remain incomplete. The 2025 Census reference boundaries and municipality counts
are not a map of funded activities.
