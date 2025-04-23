const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   POST /api/courses
// @desc    Add a new course
router.post('/', async (req, res) => {
  try {
    const { id, name, instructorId, instructorName, semester, sections, seatAvailability, creditHours, prerequisites } = req.body;

    const newCourse = new Course({
      id,
      name,
      instructorId,
      instructorName,
      semester,
      sections,
      seatAvailability,
      creditHours,
      prerequisites
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
});

// @route   GET /api/courses
// @desc    Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error while fetching course' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course by MongoDB _id
router.put('/:id', async (req, res) => {
  try {
    const {
      id,
      name,
      instructor, // expected: { id: "...", name: "..." }
      semester,
      sections,
      seatAvailability,
      creditHours,
      prerequisites // expected: array of course IDs
    } = req.body;

    if (!instructor || !instructor.id || !instructor.name) {
      return res.status(400).json({ message: 'Instructor data is required (id and name).' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        id,
        name,
        instructor: {
          id: instructor.id,
          name: instructor.name
        },
        semester,
        sections,
        seatAvailability,
        creditHours,
        prerequisites: Array.isArray(prerequisites) ? prerequisites : []
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error while updating course' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course by MongoDB _id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
});

module.exports = router;
