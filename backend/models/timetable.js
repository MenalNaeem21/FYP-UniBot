const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
