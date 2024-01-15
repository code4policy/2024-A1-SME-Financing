# The backend explanation of the BAviz page:
1. Datasets:
Download: Business Formation Statistics	BFS-mf.zip	1,521.31 KB	11-Jan-2024 10:00
from https://www.census.gov/econ_datasets/

2. Convert the files to State/Industry based csv files
Used the following python coding:
- "make_by_state_rev.py"
- "make_by_industry_rev.py"

3. Manual adjustments (as indicated memos in the .py files)
- I manually replaced the rows/columns using Microsoft Excel
https://support.microsoft.com/en-au/office/transpose-data-from-rows-to-columns-or-vice-versa-in-excel-for-mac-9c16dd55-ed1a-4aa2-8b74-b1b9211e2ede
- I also manually renamed the name of the columns, reflecting the comments at the presentation of Sprint 1 that the names should not be based on the actual NAICS codes but their readible names.
(e.g. "NAICS22"　-> "Utilities")