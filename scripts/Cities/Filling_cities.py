import json
import psycopg2
import os
import uuid

with open("IrszHnk.json", "r", encoding="utf-8") as file:
    cities_data = json.load(file)


db_password = os.getenv("POSTGRES_PASSWORD")

if not db_password:
    raise ValueError("POSTGRES_PASSWORD environment variable not set")


conn = psycopg2.connect(
    host="localhost",
    database="db",
    user="postgres",
    password=db_password
)
conn.autocommit = True
cur = conn.cursor()
print(f"Entries count: {len(cities_data)}db")

for city in cities_data:
    city_name = city.get("Helység.megnevezése")
    postal_code = city.get("IRSZ")
    
    if city_name and postal_code:
        postal_code = postal_code[:4].rjust(4, '0')
        city_name = city_name.split(" ")[0]
        city_id = str(uuid.uuid4())
        
        try:
            cur.execute(
                """
                INSERT INTO "Cities" ("Id", "CityName", "PostalCode")
                VALUES (%s, %s, %s)
                ON CONFLICT ("CityName", "PostalCode") DO NOTHING
                """,
                (city_id, city_name, postal_code)
            )
        except Exception as e:
            print(f"Error inserting {city_name}: {e}")

conn.commit()
cur.close()
conn.close()

print("Done inserting cities.")