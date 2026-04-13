import psycopg2
import pandas as pd

# DB connection
conn = psycopg2.connect(
    dbname="village_db",
    user="postgres",
    password="postgres123",   # 👈 keep your password
    host="localhost",
    port="5432"
)

cursor = conn.cursor()

# Load cleaned data
df = pd.read_csv('../cleaned_data.csv')

# 🔥 Fix NaN values safely
df[['state_code','district_code','subdistrict_code','village_code']] = \
df[['state_code','district_code','subdistrict_code','village_code']].fillna(0)

# Convert to int safely
df[['state_code','district_code','subdistrict_code','village_code']] = \
df[['state_code','district_code','subdistrict_code','village_code']].astype(int)

# Insert country
cursor.execute("SELECT id FROM country WHERE name='India'")
country_id = cursor.fetchone()[0]

# Dictionaries to avoid duplicates
state_map = {}
district_map = {}
subdistrict_map = {}

for _, row in df.iterrows():

    # -------- STATE --------
    state_key = row['state_code']
    if state_key not in state_map:
        cursor.execute("""
            INSERT INTO state (name, code, country_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (code) DO NOTHING
            RETURNING id
        """, (row['state_name'], state_key, country_id))

        result = cursor.fetchone()
        if result:
            state_id = result[0]
        else:
            cursor.execute("SELECT id FROM state WHERE code=%s", (state_key,))
            state_id = cursor.fetchone()[0]

        state_map[state_key] = state_id
    else:
        state_id = state_map[state_key]

    # -------- DISTRICT --------
    district_key = (row['district_code'], state_id)
    if district_key not in district_map:
        cursor.execute("""
            INSERT INTO district (name, code, state_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (code, state_id) DO NOTHING
            RETURNING id
        """, (row['district_name'], row['district_code'], state_id))

        result = cursor.fetchone()
        if result:
            district_id = result[0]
        else:
            cursor.execute(
                "SELECT id FROM district WHERE code=%s AND state_id=%s",
                (row['district_code'], state_id)
            )
            district_id = cursor.fetchone()[0]

        district_map[district_key] = district_id
    else:
        district_id = district_map[district_key]

    # -------- SUBDISTRICT --------
    subdistrict_key = (row['subdistrict_code'], district_id)
    if subdistrict_key not in subdistrict_map:
        cursor.execute("""
            INSERT INTO subdistrict (name, code, district_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (code, district_id) DO NOTHING
            RETURNING id
        """, (row['subdistrict_name'], row['subdistrict_code'], district_id))

        result = cursor.fetchone()
        if result:
            subdistrict_id = result[0]
        else:
            cursor.execute(
                "SELECT id FROM subdistrict WHERE code=%s AND district_id=%s",
                (row['subdistrict_code'], district_id)
            )
            subdistrict_id = cursor.fetchone()[0]

        subdistrict_map[subdistrict_key] = subdistrict_id
    else:
        subdistrict_id = subdistrict_map[subdistrict_key]

    # -------- VILLAGE --------
    cursor.execute("""
        INSERT INTO village (name, code, subdistrict_id)
        VALUES (%s, %s, %s)
        ON CONFLICT (code, subdistrict_id) DO NOTHING
    """, (row['village_name'], row['village_code'], subdistrict_id))


# Commit & close
conn.commit()
cursor.close()
conn.close()

print("✅ Data inserted successfully!")