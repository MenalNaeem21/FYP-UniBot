// models/Marks.js
const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  courseId: String,
  section: String,
  type: {
    type: String,
    enum: ['Quiz', 'Assignment', 'Sessional 1', 'Sessional 2', 'Project', 'Final']
  },
  specificType: String, // e.g., Quiz 1, Assignment 2
  totalMarks: Number,
  instructor: {
    id: String,
    name: String
  },
  students: [
    {
      rollNo: String,
      name: String,
      marks: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
