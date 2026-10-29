# Selected approved QPR facts

The [searchable view](approved-facts.html) and [machine-readable facts](data/approved-qpr-facts.json) contain 29 selected whole-award observations: seven recovered calendar quarters and 22 reviewed calendar-quarter expenditure/obligation facts. The seven are a research update, not a complete inventory of earlier quarters. Twenty of the 22 milestone-source versions matched facts already present in the checked atlas whole-report assets; two Columbia source versions were not found there. The selected records overlap other atlas datasets and are not additive.

## Candidate review corrections

Three display issues identified in the local review were corrected without changing the underlying financial data:

1. The trajectory chart previously displayed its one-cent drawing-scale floor as a largest observed value when no numeric observation existed. It now says “No numeric observations”; an actually observed zero remains $0.00. The scale floor is used only for drawing.
2. The readiness page previously presented stale counts of 28 corroborated and 178 unresolved national clocks. Those counts were removed. Recorded initial effective dates and relative horizons remain provisional, and unresolved dates remain missing.
3. The older analysis matrix previously appeared to be current coverage despite excluding the newer selected facts. It is now explicitly baseline-only, including its filtered CSV filename. The page links to the separately qualified approved-facts layer and explains why Columbia's baseline status can differ from the three selected calendar-quarter observations. The layers have not been silently merged and do not establish complete coverage.

These are local candidate corrections. Synthetic interaction tests do not replace actual desktop, mobile, keyboard or browser-download QA.

Each fact retains the original grant ID, calendar quarter, approved report status, source URL, SHA-256, and physical financial-page list. Cents are signed integer strings. A list of financial pages identifies the page group; it does not assign a specific page to each amount. Report approval does not establish when a report was publicly available, and no publication date is asserted. Source documents are linked rather than hosted in this layer.

Values are cumulative QPR total-funds snapshots for the administering award. They are not quarterly F31 flows, activity-level allocations, or beneficiary-city amounts. Expenditure divided by obligation is a descriptive accounting ratio, not recovery speed or percent completion. Values above one and exact zeros are preserved. Program income as reported in a QPR is not a federal-only audit certification; an unreported estimated-income header remains blank, not zero.

Q1 is the calendar quarter containing the recorded initial effective date and may be partial. Relative-quarter labels are provisional and are not proof of bilateral signatures or exact anniversaries. Houston's relative quarter is unassigned. A grant and quarter may have multiple source versions; the view compares source hashes and flags competing versions rather than summing or silently replacing them.

Submitted or in-progress report versions retain source and status information, while their monetary fields and derived measures are withheld. Five historical whole-grant Q4 allocation outcomes are withheld pending recertification of operative history and fund scope. Two Springfield announcement-to-award identities and two Tuscaloosa proposed-plan award identities remain unassigned in their source inventories.

The 34-award research frame has zero certified category dollar totals and no complete approved 20-quarter panel. A separate bounded 15-place spatial recomputation remains 0 of 15; existing spatial context is not independently revalidated by this release. Missing report coverage is not evidence of zero spending or of nonexistence.
