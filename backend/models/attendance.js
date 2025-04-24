const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: String,       // e.g. "CS101"
  section: String,        // e.g. "A"
  date: String,           // YYYY-MM-DD
  lectureTitle: String,
  students: [
    {
      rollNo: String,
      name: String,
      status: { type: String, enum: ['P', 'A', 'L'], default: 'P' },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
