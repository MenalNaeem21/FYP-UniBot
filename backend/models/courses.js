const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    
    courseCode: String,
    courseName: String,
    creditHours: Number,
    department: String,
    instructor: String,
    prerequisites: [String]
});

module.exports = mongoose.model("Course", CourseSchema);
