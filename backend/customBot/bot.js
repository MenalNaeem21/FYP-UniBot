const { askOpenAI, fetchAcademicInfo } = require("./openaiService");
const { queryTimetable } = require("./mongoService");
const { checkRateLimit } = require("./rateLimit");

// Improved course extractor
function extractCourse(msg) {
  const regex = /(for|about|on|of)\s+([a-zA-Z0-9\s&\-\+]+)/i;
  const match = msg.match(regex);
  return match ? match[2].trim() : null;
}

async function askBot(userMessage) {
  try {
    if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
      return "❗ Please send a valid message.";
    }

    const loweredMessage = userMessage.toLowerCase();

    // 1. Timetable related queries
    if (loweredMessage.includes("timetable") || loweredMessage.includes("schedule")) {
      const courseName = extractCourse(userMessage);
      if (!courseName) {
        return "📚 Please mention a course name to fetch its timetable.";
      }

      const timetableEntries = await queryTimetable(courseName);
      console.log("📦 Timetable entries:", timetableEntries);

      if (timetableEntries.length === 0) {
        return `🚫 No valid timetable entries found for "${courseName}".`;
      }

      // Only map valid entries
      const formattedTimetable = timetableEntries.map(entry => {
        const course = entry["Course Name"];
        const section = entry["Section"];
        const day = entry["Day"];
        const time = entry["Time"];
        const room = entry["Room"];

        return `${course} (Section ${section}) on ${day} at ${time} in Room ${room}`;
      }).join("\n");

      return formattedTimetable;
    }

    // 2. Academic info static
    const academicInfo = fetchAcademicInfo(userMessage);
    if (academicInfo) {
      return academicInfo;
    }

    // 3. Otherwise, fallback to OpenAI
    const openAIResponse = await askOpenAI(userMessage);
    return openAIResponse;

  } catch (error) {
    console.error("🚨 Bot Error:", error);
    return "⚠️ Oops! Something went wrong. Please try again.";
  }
}

module.exports = { askBot };
