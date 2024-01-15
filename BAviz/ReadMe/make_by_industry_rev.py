### This python coding was used to convert the files obatained from https://www.census.gov/econ_getzippedfile/?programCode=BFS to the sector based csv
# Importing stuff
import pandas as pd
from datetime import datetime

# read the CSV file 
df = pd.read_csv('/Users/nakajimasato/書類/DPI_691/240108/3_master_sector.csv') #Change path to your path! (I initially did it on a different local file. Not within the file connected by git.)

# convert "per_idx" to date format
df['per_idx'] = pd.to_datetime(df['per_idx'], format='%d-%b-%y')

# calculate by year
df['Year'] = df['per_idx'].dt.year
result_df = df.groupby(['cat_idx', 'Year'])['val'].sum().unstack()

# create a new CSV
result_df.reset_index(inplace=True)
result_df.to_csv('/Users/nakajimasato/書類/DPI_691/240108/3_by_industry_rev.csv', index=False)

# [Masato Comment] After this process, I manually replaced the rows/columns in 3_by_industry.csv on Microsoft Excel
# I also manually renamed the name of the columns, reflecting the comments at the presentation of Sprint 1.