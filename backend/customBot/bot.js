const { askOpenAI, fetchAcademicInfo } = require("./openaiService");
const {
  queryTimetable,
  findProfessorCourses,
  getStudentById,
} = require("./mongoService");
const { checkRateLimit } = require("./rateLimit");

const courseShortForms = {
  ds: "Data Structures",
  os: "Operating Systems",
  ai: "Artificial Intelligence",
  pdc: "Parallel and Distributed Computing",
  ml: "Machine Learning for Perceptron",
};

function extractCourse(msg) {
  const regex = /(for|about|on|of)\s+([a-zA-Z0-9\s&\-\+]+)/i;
  const match = msg.match(regex);
  if (match) {
    const raw = match[2].trim().toLowerCase();
    return courseShortForms[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  for (const [short, full] of Object.entries(courseShortForms)) {
    if (msg.toLowerCase().includes(short)) return full;
  }

  return null;
}

function isStudentQuery(msg) {
  const lowered = msg.toLowerCase();
  return (
    lowered.includes("gpa") ||
    lowered.includes("cgpa") ||
    lowered.includes("marks") ||
    lowered.includes("attendance") ||
    lowered.includes("registered") ||
    lowered.includes("courses") ||
    lowered.includes("waitlisted")
  );
}

async function askBot(userMessage, user = null) {
  try {
    if (!userMessage || typeof userMessage !== "string") {
      return "❗ Please send a valid message.";
    }

    const lowered = userMessage.toLowerCase();

    // 📅 Timetable Queries
    if (
      lowered.includes("timetable") ||
      lowered.includes("schedule") ||
      lowered.includes("teaching") ||
      lowered.includes("instructor") ||
      (lowered.includes("where") && lowered.includes("class")) ||
      (lowered.includes("location") && lowered.includes("class"))
    ) {
      const courseName = extractCourse(userMessage);
      if (!courseName) return "📚 Please mention a course to get its timetable.";

      const entries = await queryTimetable(courseName);
      if (!entries.length) return `🚫 No timetable found for "${courseName}".`;

      const uniqueInstructors = [...new Set(entries.map(e => e.Instructor))];
      const uniqueLocations = [...new Set(entries.map(e => `${e.Room} (${e.Day} - ${e.Time})`))];

      if (lowered.includes("who") || lowered.includes("instructor") || lowered.includes("teaching")) {
        return `👨‍🏫 Instructor(s) for ${courseName}: ${uniqueInstructors.join(", ")}`;
      }

      if (lowered.includes("where") || lowered.includes("location")) {
        return `📍 Class location(s) for ${courseName}:\n${uniqueLocations.join("\n")}`;
      }

      const formatted = entries.map(entry => {
        return `
      
      📘 *${entry["Course Name"]}* (${entry.Section})
      🗓️ *Day:* ${entry.Day}
      🕒 *Time:* ${entry.Time}
      🏫 *Room:* ${entry.Room}
      👨‍🏫 *Instructor:* ${entry.Instructor}
      
      `;
      }).join("\n");
      
      return formatted;
      
    }

    // 👨‍🏫 Professor Course Queries
    const profMatch = userMessage.match(/(?:prof\.?|dr\.?|mr\.?|ms\.?|mrs\.?)?\s*([\w\s]+)\s+(?:teaches|teaching|teaches.*course|course taught by)/i);
    if (profMatch) {
      const name = profMatch[1]?.trim();
      if (name) {
        const cleaned = name.replace(/(prof\.?|dr\.?|mr\.?|ms\.?|mrs\.?)/gi, "").trim();
        const courses = await findProfessorCourses(cleaned);
        if (!courses.length) return `🚫 No courses found for Professor ${cleaned}.`;

        return `📘 Courses by Professor ${cleaned}:\n` + courses
          .map(c => `- ${c['Course Name']} (${c.Section}) — ${c.Day} at ${c.Time}, ${c.Room}`)
          .join("\n");
      }
    }

    // 🎓 Student Academic Queries
    if (user?.role === "student" && isStudentQuery(userMessage)) {
      const student = await getStudentById(user._id);
      if (!student) return "❌ Student record not found.";

      if (lowered.includes("cgpa")) return `🎓 Your CGPA is: ${student.cgpa}`;
      if (lowered.includes("gpa")) return `📊 Your GPA history: ${student.gpas.join(", ")}`;
      if (lowered.includes("marks")) {
        const marks = student.marks || {};
        const formattedMarks = Object.entries(marks).map(
          ([course, mark]) => `📘 ${course}: ${mark}`
        ).join("\n");
        return formattedMarks || "📑 No marks available yet.";
      }
      if (lowered.includes("attendance")) {
        const att = student.attendance || {};
        const formattedAttendance = Object.entries(att).map(
          ([course, value]) => `📘 ${course}: ${value}%`
        ).join("\n");
        return formattedAttendance || "📋 No attendance data available yet.";
      }
      if (lowered.includes("waitlisted"))
        return `⏳ Waitlisted courses: ${student.waitlistedCourses.join(", ")}`;
      if (lowered.includes("registered") || lowered.includes("courses"))
        return `✅ Registered courses: ${student.registeredCourses.join(", ")}`;
    }

    // ℹ️ Static Text Match
    const info = fetchAcademicInfo(userMessage);
    if (info) return info;

    // 💬 Fallback to OpenAI
    return await askOpenAI(userMessage);

  } catch (err) {
    console.error("🚨 Bot error:", err);
    return "⚠️ Something went wrong. Please try again.";
  }
}

module.exports = { askBot };
