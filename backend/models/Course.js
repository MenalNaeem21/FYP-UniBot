const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  instructor: {
    type: instructorSchema,
    required: true
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: true
  },
  sections: {
    type: String,
    enum: ['A', 'B', 'C','D','E','F','G','H'],
    required: true
  },
  seatAvailability: {
    type: Number,
    required: true
  },
  creditHours: {
    type: Number,
    required: true
  },
  prerequisites: {
    type: [String], // array of course IDs like ['CS101', 'MA202']
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
