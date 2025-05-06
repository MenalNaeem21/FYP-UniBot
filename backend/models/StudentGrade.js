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
  status: String,
  gradeType: { type: String, enum: ['absolute', 'relative'], default: 'absolute' },
  changeRequested: {
    type: Boolean,
    default: false,
  },
  changeComment: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model('StudentGrade', studentGradeSchema);
