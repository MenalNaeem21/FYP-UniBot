// routes/stats.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Complaint = require('../models/Complaint');
const Course = require('../models/Course');
router.get('/students/count', async (req, res) => {
  const count = await Student.countDocuments();
  res.json({ count });
});

router.get('/teachers/count', async (req, res) => {
  const count = await Teacher.countDocuments();
  res.json({ count });
});

router.get('/complaints/count', async (req, res) => {
  const count = await Complaint.countDocuments();
  res.json({ count });
});
router.get('/course/count', async (req, res) => {
    const count = await Course.countDocuments();
    res.json({ count });
  });
module.exports = router;
