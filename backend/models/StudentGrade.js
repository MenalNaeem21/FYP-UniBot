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
  gradeType: { type: String, enum: ['absolute', 'relative'], default: 'absolute' },
});

module.exports = mongoose.model('StudentGrade', studentGradeSchema);
