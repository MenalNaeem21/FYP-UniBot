const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { askBot } = require("./customBot/bot"); // Import the askBot function from the custom bot
dotenv.config(); // ✅ Load .env before anything else!
const Timetable = require("./models/Timetable"); // Ensure this path is correct

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("MongoDB Connected ✅");

    // TESTING PURPOSE ONLY 👇
    const sample = await Timetable.findOne();
    console.log("📦 Sample Document from Timetable:", sample);
  })
  .catch((err) => console.error(err));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// 🔹 AUTHENTICATION MIDDLEWARE (Protect Routes)
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("🔍 Token received:", token); // Debugging

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // Debugging
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// 🔹 AUTHORIZATION MIDDLEWARE (Restrict Access Based on Role)
const authorize = (roles) => (req, res, next) => {
  console.log("🔍 User in authorize middleware:", req.user); // Debugging

  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access forbidden: You do not have permission." });
  }
  next();
};

// Routes
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const timetableRoutes = require('./routes/timetableRoutes');

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/timetable", timetableRoutes);

// 🔹 Bot Route: To interact with the bot
app.post("/api/bot/ask", async (req, res) => {
  const { userMessage } = req.body;  // Extract userMessage from the request body
  console.log("User message received:", userMessage); // Log the received message

  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error("Invalid message: userMessage is either missing or not a string.");
    }

    const botResponse = await askBot(userMessage);
    res.json({ response: botResponse });
  } catch (error) {
    console.error("🚨 Bot error:", error.message);
    res.status(500).json({ error: "Oops! Something went wrong while processing your request." });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
