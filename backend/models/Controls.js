const mongoose = require('mongoose');

const ControlsSchema = new mongoose.Schema({
  registrationOpen: {
    type: Boolean,
    default: false,
  },
  activeSemester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    default: 'Fall',
  },
  graderOpen: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Controls = mongoose.model('Controls', ControlsSchema);

module.exports = Controls;
