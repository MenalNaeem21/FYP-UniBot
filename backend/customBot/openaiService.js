const OpenAI = require("openai");
const { checkRateLimit } = require("./rateLimit");
const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fetchAcademicInfo(userQuery) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "staticData.json")));

  const lowered = userQuery.toLowerCase();

  // Static data responses
  if (lowered.includes("fee") || lowered.includes("fees")) return data.admissions.feeStructure;
  if (lowered.includes("apply")) return data.admissions.howToApply;
  if (lowered.includes("schedule")) return data.admissions.admissionSchedule;
  if (lowered.includes("programs")) return data.admissions.offeredPrograms;
  if (lowered.includes("calendar")) return data.students.academicCalendar;
  if (lowered.includes("code of conduct")) return data.students.codeOfConduct;
  if (lowered.includes("chapters") || lowered.includes("societies")) return data.students.studentChapters;
  if (lowered.includes("scholarship") || lowered.includes("financial aid")) return data.students.financialAid;
  if (lowered.includes("lahore campus")) return data.campuses.lahore;
  if (lowered.includes("islamabad campus")) return data.campuses.islamabad;
  if (lowered.includes("library")) return data.services.library;
  if (lowered.includes("career service")) return data.services.careerServices;
  if (lowered.includes("fintech")) return data.executiveEducation.fintechFCP;
  if (lowered.includes("analytics")) return data.executiveEducation.analyticsPAC;

  return null;
}

async function askOpenAI(prompt) {
  try {
    const canCall = checkRateLimit();
    if (!canCall) {
      return "⏳ Rate limit reached. Please wait a few seconds and try again.";
    }

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0].message.content;
  } catch (error) {
    console.error("🚨 OpenAI API Error:", error);
    throw error;
  }
}

module.exports = { askOpenAI, fetchAcademicInfo };
