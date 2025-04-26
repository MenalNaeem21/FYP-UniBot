const mongoose = require("mongoose");
require("dotenv").config();

const Timetable = require("../models/Timetable");  // Correct model import

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connected (bot service)"))
  .catch((err) => console.error("🔴 MongoDB connection error:", err));

// 🛠 Improved SMART query function
async function queryTimetable(course) {
  if (!course) return [];

  // Step 1: Try exact match first
  const exactMatches = await Timetable.find({
    "Course Name": { $regex: `^${course}$`, $options: "i" },  // full course name match
    "Day": { $exists: true },
    "Time": { $exists: true },
    "Room": { $exists: true },
    "Section": { $exists: true }
  });

  if (exactMatches.length > 0) {
    console.log("✅ Exact match found");
    return exactMatches;
  }

  // Step 2: If no exact match, fallback to word-wise match
  const words = course.split(/\s+/); // split by spaces
  const partialMatches = await Timetable.find({
    $or: words.map(word => ({
      "Course Name": { $regex: word, $options: "i" }
    })),
    "Day": { $exists: true },
    "Time": { $exists: true },
    "Room": { $exists: true },
    "Section": { $exists: true }
  });

  if (partialMatches.length > 0) {
    console.log("✅ Partial word match found");
    return partialMatches;
  }

  console.log("🚫 No matches found");
  return [];
}

module.exports = { queryTimetable };
