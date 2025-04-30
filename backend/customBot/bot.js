const { askOpenAI, fetchAcademicInfo } = require("./openaiService");
const { queryTimetable } = require("./mongoService");
const { checkRateLimit } = require("./rateLimit");

// Improved course extractor
function extractCourse(msg) {
  const courseKeywords = ["class", "course", "subject"];
  let cleanedMsg = msg.toLowerCase();

  for (const keyword of courseKeywords) {
    if (cleanedMsg.includes(keyword)) {
      // Remove question words and helper words
      cleanedMsg = cleanedMsg.replace(/where|what|is|held|located|find|tell|me|about|of|the|for|class|course|subject/gi, "").trim();
      // Capitalize first letters nicely
      return cleanedMsg.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }
  }

  // Fallback regex (if no keyword match)
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
    if (loweredMessage.includes("timetable") ||
     loweredMessage.includes("schedule") ||
     loweredMessage.includes("teaching") ||
     loweredMessage.includes("teacher") ||
     loweredMessage.includes("instructor") ||
     loweredMessage.includes("where") && loweredMessage.includes("class") ||
     loweredMessage.includes("location") && loweredMessage.includes("class")
) {
      const courseName = extractCourse(userMessage);
      if (!courseName) {
        return "📚 Please mention a course name to fetch its timetable.";
      }

      const timetableEntries = await queryTimetable(courseName);
      console.log("📦 Timetable entries:", timetableEntries);

      if (timetableEntries.length === 0) {
        return `🚫 No valid timetable entries found for "${courseName}".`;
      }
      if (loweredMessage.includes("who") || loweredMessage.includes("teacher") || loweredMessage.includes("instructor") || loweredMessage.includes("teaching")) {
        // User wants to know who is teaching
        const instructors = [...new Set(timetableEntries.map(entry => entry.Instructor))];
        return `👨‍🏫 Instructor(s) for ${courseName}: ${instructors.join(", ")}`;
      }
    
      if (loweredMessage.includes("where") || loweredMessage.includes("location")) {
        // User wants to know where the class is
        const rooms = [...new Set(timetableEntries.map(entry => `${entry.Room} (Day: ${entry.Day}, Time: ${entry.Time})`))];
        return `🏫 Class locations for ${courseName}: ${rooms.join(", ")}`;
      }

      const formattedTimetable = timetableEntries.map(entry => (
        `📚 ${entry['Course Name']} (${entry.Section})
📅 Day: ${entry.Day}
🕑 Time: ${entry.Time}
🏫 Room: ${entry.Room}
👨‍🏫 Instructor: ${entry.Instructor}\n`
      )).join("\n");

      return formattedTimetable; //  Only RETURN the message here
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
