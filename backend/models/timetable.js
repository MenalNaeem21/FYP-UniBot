const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  faculty: { type: String, required: true }, // Instructor name
  section: { type: String, required: true },
  day: { type: [String], required: true }, // ["Monday", "Wednesday"]
  timeSlot: { type: String, required: true }, // "10:00-11:30 AM"
  room: { type: String, required: true },
  capacity: { type: Number, required: true },
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
