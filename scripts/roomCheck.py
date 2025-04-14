# Run this after generating clean_timetable.csv
import pandas as pd

df = pd.read_csv("clean_timetable.csv")
rooms = df["Room"].dropna().unique()

print("📍 Unique Rooms in Timetable:")
for room in rooms:
    print("-", room)
