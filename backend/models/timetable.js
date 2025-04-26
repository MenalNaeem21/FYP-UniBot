const mongoose = require('mongoose');


const TimetableSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Timetable', TimetableSchema);
