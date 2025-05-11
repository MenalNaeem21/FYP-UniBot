const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require('path');
const { askBot } = require("./customBot/bot");


// Load env
dotenv.config();

const app = express();

// Routes
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); 
const timetableRoutes = require('./routes/timetableRoutes');
const controlsRoutes = require('./routes/controls');

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // TESTING PURPOSE ONLY 👇
    const Timetable = require("./models/Timetable"); // Make sure path is correct
    const sample = await Timetable.findOne();
    console.log("📦 Sample Document from Timetable:", sample);
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

  

// 🔹 AUTHENTICATION MIDDLEWARE
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("🔍 Token received:", token);

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// 🔹 AUTHORIZATION MIDDLEWARE
const authorize = (roles) => (req, res, next) => {
  console.log("🔍 User in authorize middleware:", req.user);

  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access forbidden: You do not have permission." });
  }
  next();
};

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/controls", controlsRoutes);

// Bot Route
app.post("/api/bot/ask", async (req, res) => {
  const { userMessage, user } = req.body;
  console.log("User message received:", userMessage);

  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error("Invalid message: userMessage is either missing or not a string.");
    }

    const botResponse = await askBot(userMessage, user);
    res.json({ response: botResponse });
  } catch (error) {
    console.error("🚨 Bot error:", error.message);
    res.status(500).json({ error: "Oops! Something went wrong while processing your request." });
  }
});

// Static uploads
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

// PORT and Server Start with graceful error handling
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});
