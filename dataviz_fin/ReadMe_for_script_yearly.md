# The backend explanation of the data used in script_yearly.js of the dataviz_fin page:
[1]. Datasets:
	1) Go to the following url  
	https://careports.sba.gov/views/7a504Summary/Report?%3Aembed=yes&%3Atoolbar=no
	2) Select the toggle under “Report Segment” to get State-level data.
	3) Now, select the Program 7(a) and select the Fiscal Year (iteratively select 
	2018 to 2023) and then download the data file 
	4) Now select the Program 504 and select the Fiscal Year (iteratively select 
	2018 to 2023) and then download the data file
	5) Now select the toggle under “Report Segment to get Industry level data 
	and repeat steps 3) and 4) above to download yearly data for 7a and 504 
	programs
	6) The downloaded data files were then merged to get one consolidate data 
	file having approval data by loan value (% of Dollar Value Approved) 
	across all States and Sectors 
	7) Only the “% of dollar value approved” column was retained and all other 
	columns deleted for preparing 4 separate csv files each containing 7a and 
	504 data at a State and Sector-level each. 

[2]. Manual adjustments (as indicated memos in the .py files)
- I manually replaced the rows/columns using Microsoft Excel
	https://support.microsoft.com/en-au/office/transpose-data-from-rows-to-columns-or-vice-versa-in-excel-for-mac-9c16dd55-ed1a-4aa2-8b74-b1b9211e2ede
