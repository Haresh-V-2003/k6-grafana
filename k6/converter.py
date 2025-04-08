import pandas as pd

# Step 1: Load the Excel file
df = pd.read_excel('sample.xlsx')  # Change this to your actual file path

row_count = len(df)

print(f'Total number of rows: {row_count}')

# Step 2: Convert to JSON
df.to_json('payload.json', orient='records', lines=False)

