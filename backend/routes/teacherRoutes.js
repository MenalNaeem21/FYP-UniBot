const express = require('express');
const Teacher = require('../models/Teacher');
const router = express.Router();
const { faker } = require("@faker-js/faker");
const jwt = require('jsonwebtoken');


const generateTeachers = (count = 10) => {
    let teachers = [];

    for (let i = 0; i < count; i++) {
        let teacher = {
            name: faker.person.fullName(),
            gender: faker.helpers.arrayElement(["Male", "Female"]),
            dob: faker.date.past({ years: 40, refDate: new Date(2000, 0, 1) }).toISOString().split("T")[0],
            cnic: faker.number.int({ min: 1000000000000, max: 9999999999999 }).toString(),
            tid: faker.number.int({ min: 1, max: 100 }).toString(),
            department: faker.helpers.arrayElement(["BS(CS)", "BS(SE)", "BS(AI)"]),
            dateJoined: faker.date.past({ years: 20, refDate: new Date() }).toISOString().split("T")[0],
            campus: faker.helpers.arrayElement(["Lahore", "Karachi", "Islamabad"]),
            email: faker.internet.email(),
            password: "password",  // Default password
            mobile: faker.phone.number("03#########"),
            bloodGroup: faker.helpers.arrayElement(["A", "B", "AB", "O"]),
            address: faker.location.streetAddress(),
            familyInfo: `Wife: ${faker.person.firstName()}`
        };

        teachers.push(teacher);
    }

    return teachers;
};




router.post("/bulk", async (req, res) => {
  try {
    const { teachers } = req.body; // Extract teachers array from request body
    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Insert data into database
    await Teacher.insertMany(teachers);
    res.status(201).json({ message: `${teachers.length} teachers added successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding teachers", error });
  }
});


// Create a new entry
router.post('/', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all entries
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update 
router.put('/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete  
router.delete('/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/teachers/:tid/courses', async (req, res) => {
  const { tid } = req.params;

  try {
    const courses = await Course.find({
      'instructor.id': tid.trim() // Ensure no spaces
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
});
router.get('/teacher/dashboard/:tid', async (req, res) => {
  const { tid } = req.params;

  try {
    const courses = await Course.find({ 'instructor.id': tid });
    const totalCourses = courses.length;

    let totalStudents = 0, pendingTasks = 0, completedTasks = 0, attendanceTotal = 0, attendanceCount = 0;
    let recentClasses = [];

    for (let course of courses) {
      const students = await Student.find({ registeredCourses: { $elemMatch: { id: course.id, section: course.sections } } });
      totalStudents += students.length;

      const classworks = await Classwork.find({ courseId: course.id, courseSection: course.sections });
      pendingTasks += classworks.filter(cw => cw.submissions.length === 0).length;
      completedTasks += classworks.filter(cw => cw.submissions.length > 0).length;

      const attendanceRecords = await Attendance.find({ courseId: course.id, section: course.sections });
      attendanceRecords.forEach(record => {
        const presentCount = record.students.filter(s => s.status === 'P').length;
        const percentage = (presentCount / record.students.length) * 100;
        attendanceTotal += percentage;
        attendanceCount++;
        recentClasses.push({ course: course.name, date: record.date });
      });
    }

    const avgAttendance = attendanceCount > 0 ? (attendanceTotal / attendanceCount).toFixed(2) + '%' : '0%';
    const gradeRequests = await GradeChangeRequest.countDocuments({ 'instructor.id': tid, status: 'pending' });

    res.json({
      totalCourses,
      totalStudents,
      pendingTasks,
      completedTasks,
      avgAttendance,
      gradeRequests,
      recentClasses: recentClasses.slice(0, 3),
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});



module.exports = router;
