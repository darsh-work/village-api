import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# ✅ STEP 1: Load CSV
df = pd.read_csv("cleaned_data.csv")

# ✅ STEP 2: DB connection
conn = psycopg2.connect(
    "postgresql://village_db_777y_user:oMEP8DT2dIgg9MbePlnhizqLyyC49ob6@dpg-d7e5p4v41pts73aesvsg-a.oregon-postgres.render.com:5432/village_db_777y?sslmode=require"
)

cursor = conn.cursor()

# ✅ STEP 3: Prepare data (convert DataFrame → list of tuples)
data = [
    (
        row["state_name"], row["state_code"],
        row["district_name"], row["district_code"],
        row["subdistrict_name"], row["subdistrict_code"],
        row["village_name"], row["village_code"]
    )
    for _, row in df.iterrows()
]

# ✅ STEP 4: Bulk insert query
query = """
INSERT INTO cleaned_data (
    state_name, state_code,
    district_name, district_code,
    subdistrict_name, subdistrict_code,
    village_name, village_code
) VALUES %s
"""

# ✅ STEP 5: Execute (fast & safe)
execute_values(cursor, query, data, page_size=1000)

# ✅ STEP 6: Commit & close
conn.commit()
cursor.close()
conn.close()

print("✅ Data uploaded successfully 🚀")