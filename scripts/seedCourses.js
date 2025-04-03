require("dotenv").config({ path: "../backend/.env" });
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Course = require("../backend/models/courses");
// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Error: MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

async function connectDB() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "test",
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 45000, // Increase timeout
      });
      
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
}

// Generate Fake Course Data
const generateFakeCourse = () => ({
  courseCode: `CS${faker.string.numeric(3)}`,
  courseName: faker.lorem.words(3),
  creditHours: faker.helpers.arrayElement([2, 3, 4]),
  department: faker.helpers.arrayElement(["Computer Science", "Mathematics", "Physics", "Humanities", "Engineering"]),
  instructor: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
});

// Insert Fake Courses
const insertDummyCourses = async () => {
  try {
    await connectDB();
    const courses = Array.from({ length: 10 }, generateFakeCourse);
    console.log("Generated Courses:", courses);

    await Course.insertMany(courses);
    console.log(`✅ Successfully inserted ${courses.length} dummy courses.`);
  } catch (error) {
    console.error("❌ Error inserting courses:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
};

// Run the function
insertDummyCourses();
