const mongoose = require("mongoose");
require("dotenv").config();
const Timetable = require("../models/Timetable");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connected (bot service)"))
  .catch((err) => console.error("🔴 MongoDB connection error:", err));

function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&'); // Removed \s inside []
}

// 🛠 Improved SMART query function
async function queryTimetable(course) {
  if (!course) return [];

  // Step 1: Try exact match first
  const exactMatches = await Timetable.find({
    "Course Name": { $regex: escapeRegex(course), $options: "i" },
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
  const words = course.split(/\s+/);
  const partialMatches = await Timetable.find({
    $or: words.map(word => ({
      "Course Name": { $regex: escapeRegex(word), $options: "i" }
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
async function findProfessorCourses(name) {
  if (!name) return [];

  const cleanedName = name.replace(/^(prof\.?|professor|dr|ms\.?|mr\.?)\s*/i, "").trim(); // remove title if user adds it
  return await Timetable.find({
    Instructor: { $regex: new RegExp(cleanedName, "i") },
    "Course Name": { $exists: true },
    Day: { $exists: true },
    Time: { $exists: true },
    Room: { $exists: true },
    Section: { $exists: true }
  });
}

async function getStudentById(id) {
  return await Student.findById(id).lean();
}


 


module.exports = { queryTimetable,  findProfessorCourses,  getStudentById };
