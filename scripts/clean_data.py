import pandas as pd
import os

data_folder = '../data'

all_data = []

for file in os.listdir(data_folder):
    file_path = os.path.join(data_folder, file)

    try:
        print(f"Processing: {file}")

        if file.endswith('.xls') or file.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        elif file.endswith('.ods'):
            df = pd.read_excel(file_path, engine='odf')
        else:
            continue

        # Normalize column names
        df.columns = df.columns.str.strip().str.lower()

        # DEBUG (important if error comes)
        print("Columns:", df.columns)

        # Rename columns (adjust based on your dataset)
        df = df.rename(columns={
            'state name': 'state_name',
            'mdds stc': 'state_code',
            'district name': 'district_name',
            'mdds dtc': 'district_code',
            'sub-district name': 'subdistrict_name',
            'mdds sub_dt': 'subdistrict_code',
            'area name': 'village_name',
            'mdds plcn': 'village_code'
        })

        # Keep only required columns
        required_columns = ['state_name','state_code','district_name','district_code','subdistrict_name', 'subdistrict_code','village_name','village_code']
        df = df[[col for col in required_columns if col in df.columns]]

        all_data.append(df)

    except Exception as e:
        print(f"Error in {file}: {e}")

# Combine all files
final_df = pd.concat(all_data, ignore_index=True)

# Save output
final_df.to_csv('../cleaned_data.csv', index=False)

print("✅ cleaned_data.csv created successfully")