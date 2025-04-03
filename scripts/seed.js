/*require("dotenv").config({ path: "../backend/.env" });
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Student = require("../backend/models/Student");

// Validate MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

async function connectDB() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test", // Ensure database exists
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB Connected");

    // Debug: List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📂 Collections in DB:", collections.map((c) => c.name));
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
}

// Generate fake student data
const generateFakeStudent = () => ({
  name: faker.person.fullName(),
  gender: faker.helpers.arrayElement(["Male", "Female"]),
  dob: faker.date.birthdate({ min: 18, max: 30, mode: "age" }),
  cnic: faker.string.numeric(5) + "-" + faker.string.numeric(7) + "-" + faker.string.numeric(1),
  rollNo: `${faker.string.numeric(2)}L-${faker.string.numeric(4)}`,
  degreeProgram: faker.helpers.arrayElement(["BS(CS)", "BS(IT)", "BS(SE)", "BBA", "BS(AI)"]),
  batch: faker.string.numeric(4),
  campus: faker.helpers.arrayElement(["Lahore", "Islamabad", "Karachi", "Peshawar"]),
  email: faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName(), provider: "example.com" }),
  password: faker.internet.password({ length: 10 }),
  mobile: "+92" + faker.string.numeric(10),
  bloodGroup: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  address: faker.location.streetAddress(),
  familyInfo: `Father: ${faker.person.fullName()}`,
});



// Insert dummy data
const insertDummyData = async () => {
  try {
    await connectDB();

    const students = Array.from({ length: 100 }, generateFakeStudent);
    console.log("Generated Students:", students.slice(0, 5)); // Print first 5 students for debugging
    mongoose.connection.on("connected", () => console.log("✅ MongoDB Connected"));
mongoose.connection.on("error", (err) => console.log("❌ MongoDB Error:", err));


    await Student.insertMany(students);
    console.log(`✅ Successfully inserted ${students.length} dummy students.`);
  } catch (error) {
    console.error("❌ Error inserting data:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
};

// Run the function
insertDummyData();
*/
require("dotenv").config({ path: "../backend/.env" });
const mongoose = require("mongoose");
const Student = require("../backend/models/Student");

// Validate MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

async function connectDB() {
    try {
      console.log("Connecting to:", process.env.MONGO_URI);
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "test",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
  
      const connectionState = mongoose.connection.readyState;
      console.log("🛠 MongoDB Connection State:", connectionState); // 1 means connected
  
      if (connectionState !== 1) {
        throw new Error("MongoDB is not properly connected.");
      }
  
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ Connection Error:", error);
      process.exit(1);
    }
  }
  

async function testInsert() {
  try {
    await connectDB();

    const testStudent = await Student.create({ 
      name: "Test User", 
      rollNo: "00L-0000" 
    });

    console.log("✅ Test student inserted:", testStudent);
  } catch (error) {
    console.error("❌ Error inserting test student:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

// Run the test
testInsert();
