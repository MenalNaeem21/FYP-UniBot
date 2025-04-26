// models/StudentGrade.js
const mongoose = require('mongoose');

const studentGradeSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  courseId: String,
  courseName: String,
  section: String,
  weightedScore: Number,
  grade: String,
  gpa: String,
});

module.exports = mongoose.model('StudentGrade', studentGradeSchema);
