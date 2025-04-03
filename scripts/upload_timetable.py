from pymongo import MongoClient
import pandas as pd

# Connect to MongoDB (Replace with your actual connection string)
client = MongoClient("mongodb://localhost:27017/")
db = client["university"]  # Database name
timetable_collection = db["timetable"]  # Collection name

# Load structured timetable DataFrame (Assuming df_structured_timetable is ready)
timetable_data = []

for _, row in df_structured_timetable.iterrows():
    # Extract course name and section separately
    course_parts = row["course_info"].rsplit("(", 1)
    course_name = course_parts[0].strip()
    course_code = course_parts[1][:-1] if len(course_parts) > 1 else "Unknown"
    
    timetable_entry = {
        "day": row["day"],
        "room": row["room"],
        "time_slot": row["time_slot"],
        "course_name": course_name,
        "course_code": course_code,
        "faculty": "TBD"  # Faculty can be added if available
    }
    timetable_data.append(timetable_entry)

# Insert data into MongoDB
timetable_collection.insert_many(timetable_data)
print("Timetable successfully inserted into MongoDB!")
