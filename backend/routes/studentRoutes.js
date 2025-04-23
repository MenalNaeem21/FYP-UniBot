const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require('../models/Course');
const { faker } = require("@faker-js/faker");

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
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 }),
  mobile: "+92" + faker.string.numeric(10),
  bloodGroup: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  address: faker.location.streetAddress(),
  familyInfo: `Father: ${faker.person.fullName()}`,
});

// Route to seed students
// router.post("/seed", async (req, res) => {
//   try {

//     const students = Array.from({ length: 100 }, generateFakeStudent);
//     await Student.insertMany(students);

//     res.status(201).json({ message: `✅ Inserted ${students.length} dummy students` });
//   } catch (error) {
//     res.status(500).json({ message: "❌ Error inserting data", error });
//   }
// });
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Get  single student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
});

// Update student details
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});

// Delete  student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { courseId, studentEmail, studentRollNo } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findOne({ email: studentEmail, rollNo: studentRollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const alreadyRegistered = student.registeredCourses.includes(course.id);
    const alreadyWaitlisted = student.waitlistedCourses.includes(course.id);

    if (alreadyRegistered || alreadyWaitlisted) {
      return res.status(400).json({ message: "Already registered or waitlisted" });
    }

    if (course.seatAvailability > 0) {
      course.seatAvailability -= 1;
      student.registeredCourses.push(course.id);
      await course.save();
      await student.save();
      return res.status(200).json({ message: "Registered successfully", status: "registered" });
    } else {
      student.waitlistedCourses.push(course.id);
      await student.save();
      return res.status(200).json({ message: "Added to waitlist", status: "waitlisted" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});



router.post("/drop", async (req, res) => {
  try {
    const { courseId, studentEmail, studentRollNo } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findOne({ email: studentEmail, rollNo: studentRollNo });
    if (!student) return res.status(404).json({ message: "Student not found" });

    let actionTaken = '';

    if (student.registeredCourses.includes(course.id)) {
      student.registeredCourses = student.registeredCourses.filter(id => id !== course.id);
      course.seatAvailability += 1;
      actionTaken = 'dropped';
    }
    if (student.waitlistedCourses.includes(course.id)) {
      student.waitlistedCourses = student.waitlistedCourses.filter(id => id !== course.id);
      actionTaken = 'removed_from_waitlist';
    }
    

    await course.save();
    await student.save();

    res.status(200).json({
      message: `Successfully ${actionTaken.replace('_', ' ')}`,
      status: actionTaken,
    });
  } catch (error) {
    console.error("Drop error:", error);
    res.status(500).json({ message: "Server error during course drop" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const { email, rollNo } = req.query;

    if (!email || !rollNo) {
      return res.status(400).json({ message: "Email and roll number are required." });
    }

    const student = await Student.findOne({ email, rollNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const registered = await Course.find({ id: { $in: student.registeredCourses } });
    const waitlisted = await Course.find({ id: { $in: student.waitlistedCourses } });


    res.status(200).json({
      registered,
      waitlisted
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Server error while fetching student courses" });
  }
});

module.exports = router;
