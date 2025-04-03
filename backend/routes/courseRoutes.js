const express = require("express");
const Course = require("../models/courses");
const router = express.Router();

router.post("/bulk", async (req, res) => {
    try {
      const courses = req.body; // Get array from request body
      const insertedCourses = await Course.insertMany(courses);
      res.status(201).json({ message: "✅ Courses added successfully", insertedCourses });
    } catch (error) {
      res.status(500).json({ message: "❌ Error inserting courses", error });
    }
  });

// Get all courses
router.get("/", async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// Add a course
router.post("/", async (req, res) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json({ message: "Course added successfully!" });
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
