import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# CSV load
df = pd.read_csv("cleaned_data.csv")

# IMPORTANT: use EXACT Render URL
conn = psycopg2.connect(
    "postgresql://village_db_4bw3_user:9EOHJ9uX2pe2QOoEZyC6IAc7L0yKIVcU@dpg-d7eovjbbc2fs738c3520-a.oregon-postgres.render.com/village_db_4bw3?sslmode=require"
)

cursor = conn.cursor()

# convert dataframe to list
data = [
    (
        row["state_name"], row["state_code"],
        row["district_name"], row["district_code"],
        row["subdistrict_name"], row["subdistrict_code"],
        row["village_name"], row["village_code"]
    )
    for _, row in df.iterrows()
]

query = """
INSERT INTO cleaned_data (
    state_name, state_code,
    district_name, district_code,
    subdistrict_name, subdistrict_code,
    village_name, village_code
) VALUES %s
"""

execute_values(cursor, query, data, page_size=1000)

conn.commit()
cursor.close()
conn.close()

print("✅ Data uploaded successfully 🚀")