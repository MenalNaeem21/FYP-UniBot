



# import pandas as pd
# import re
# from datetime import datetime, timedelta

# file_path = "FSC Time Table Spring 2025 v1.6.xlsx"
# xls = pd.ExcelFile(file_path)
# main_sheet = xls.sheet_names[0]
# loc_sheets = xls.sheet_names[1:5]

# df = xls.parse(main_sheet, header=None)

# # Excel column ranges for each period block (F–M, O–V, ..., BH–BO)
# col_blocks = [
#     list(range(5, 13)),   # F to M
#     list(range(14, 22)),  # O to V
#     list(range(23, 31)),  # X to AE
#     list(range(32, 40)),  # AG to AN
#     list(range(41, 49)),  # AP to AW
#     list(range(50, 58)),  # AY to BF
#     list(range(59, 67))   # BH to BO
# ]

# # Map row ranges to days (based on observation)
# day_row_ranges = {
#     "Monday": range(4, 60),
#     "Tuesday": range(62, 118),
#     "Wednesday": range(120, 176),
#     "Thursday": range(178, 234),
#     "Friday": range(236, 292),
#     "Saturday": range(294, 350)
# }

# # Instructor mapping
# instructor_map = {}
# for sheet in loc_sheets:
#     loc_df = xls.parse(sheet, header=None)
#     for _, row in loc_df.iterrows():
#         course = str(row[0]).strip() if len(row) > 0 else ""
#         instructor = str(row[3]).strip() if len(row) > 3 else ""
#         if course and instructor and course.lower() != "nan":
#             instructor_map[course.lower()] = instructor

# records = []

# for day, rows in day_row_ranges.items():
#     start_time = datetime.strptime("08:30 AM", "%I:%M %p")
#     time_map = {}
#     for i, block in enumerate(col_blocks):
#         for col in block:
#             time_map[col] = start_time
#         start_time += timedelta(minutes=90)

#     for i in rows:
#         if i >= len(df): continue
#         row = df.iloc[i]
#         room = row[1] if pd.notna(row[1]) else None
#         if not room:
#             continue

#         for col in time_map:
#             if col >= len(row):
#                 continue
#             content = str(row[col]).strip()
#             if not content or content.lower() == 'nan':
#                 continue

#             time_slot = time_map[col]
#             time_range = f"{time_slot.strftime('%I:%M %p')} - {(time_slot + timedelta(minutes=90)).strftime('%I:%M %p')}"

#             match = re.match(r"(.*)\(([^)]+)\)", content)
#             if match:
#                 course_name = match.group(1).strip()
#                 section = match.group(2).strip()
#             else:
#                 course_name = content
#                 section = None

#             instructor = instructor_map.get(course_name.lower(), "TBD")

#             records.append({
#                 "Course Name": course_name,
#                 "Section": section,
#                 "Day": day,
#                 "Time": time_range,
#                 "Room": room,
#                 "Instructor": instructor,
#                 "Sheet": main_sheet
#             })

# df_clean = pd.DataFrame(records)
# df_clean.to_csv("clean_timetable.csv", index=False)
# print("✅ Cleaned timetable for Mon–Sat saved as clean_timetable.csv")



import pandas as pd
import re
from datetime import datetime, timedelta

file_path = "FSC Time Table Spring 2025 v1.6.xlsx"
xls = pd.ExcelFile(file_path)
main_sheet = xls.sheet_names[0]
loc_sheets = xls.sheet_names[1:5]  # 4 LoC sheets

df = xls.parse(main_sheet, header=None)

col_blocks = [
    list(range(5, 13)),   # F to M
    list(range(14, 22)),  # O to V
    list(range(23, 31)),  # X to AE
    list(range(32, 40)),  # AG to AN
    list(range(41, 49)),  # AP to AW
    list(range(50, 58)),  # AY to BF
    list(range(59, 67))   # BH to BO
]

day_row_ranges = {
    "Monday": range(4, 60),
    "Tuesday": range(62, 118),
    "Wednesday": range(120, 176),
    "Thursday": range(178, 234),
    "Friday": range(236, 292),
    "Saturday": range(294, 350)
}

# instructor map from all LoC sheets
instructor_map = {}

for sheet in loc_sheets:
    loc_df = xls.parse(sheet, header=None)
    for _, row in loc_df.iterrows():
        if len(row) >= 4:
            course_title = str(row[1]).strip().lower()  # Column B
            section = str(row[2]).strip().upper()       # Column C
            instructor = str(row[3]).strip()            # Column D

            if course_title and section and instructor and course_title != 'nan' and instructor != 'nan':
                # save using format: course_title (lower) + section (upper) for normalisation
                key = f"{course_title}|{section}"
                instructor_map[key] = instructor

records = []

for day, rows in day_row_ranges.items():
    start_time = datetime.strptime("08:30 AM", "%I:%M %p")
    time_map = {}
    for i, block in enumerate(col_blocks):
        for col in block:
            time_map[col] = start_time
        start_time += timedelta(minutes=90)

    for i in rows:
        if i >= len(df): continue
        row = df.iloc[i]
        room = row[1] if pd.notna(row[1]) else None
        if not room:
            continue

        for col in time_map:
            if col >= len(row):
                continue
            content = str(row[col]).strip()
            if not content or content.lower() == 'nan':
                continue

            time_slot = time_map[col]
            time_range = f"{time_slot.strftime('%I:%M %p')} - {(time_slot + timedelta(minutes=90)).strftime('%I:%M %p')}"

            match = re.match(r"(.*)\(([^)]+)\)", content)
            if match:
                course_name = match.group(1).strip()
                section = match.group(2).strip().upper()
            else:
                course_name = content.strip()
                section = None

            # match instructor using lowercased course name and uppercased section
            instructor_key = f"{course_name.lower()}|{section}" if section else course_name.lower()
            instructor = instructor_map.get(instructor_key, "TBD")

            records.append({
                "Course Name": course_name,
                "Section": section,
                "Day": day,
                "Time": time_range,
                "Room": room,
                "Instructor": instructor,
                "Sheet": main_sheet
            })

df_clean = pd.DataFrame(records)
df_clean.to_csv("clean_timetable.csv", index=False)
print("✅ Final timetable with all instructors saved as clean_timetable.csv")

