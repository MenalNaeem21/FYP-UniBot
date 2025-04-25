// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: String,
  courseName: String,
  section: String,
  date: String,
  lectureTitle: String,
  instructor: {
    id: String,
    name: String
  },
  students: [
    {
      rollNo: String,
      name: String,
      status: {
        type: String,
        enum: ['P', 'A', 'L'], // Present, Absent, Late
        default: 'P'
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
