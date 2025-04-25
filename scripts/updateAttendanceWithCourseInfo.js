const mongoose = require('mongoose');
const Attendance = require('../backend/models/attendance'); // Adjust path if needed
const Course = require('../backend/models/Course'); // Adjust path if needed

// ✅ Directly use your Mongo URI here
const mongoURI = 'mongodb+srv://aj:Messi19@fyp.5tfvo.mongodb.net/test?retryWrites=true&w=majority&appName=fyp';

async function updateAttendanceRecords() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const records = await Attendance.find();

    for (const record of records) {
      const course = await Course.findOne({
        id: record.courseId,
        sections: record.section,
      });

      if (course) {
        record.courseName = course.name;
        record.instructor = {
          id: course.instructor.id,
          name: course.instructor.name,
        };

        await record.save();
        console.log(`✅ Updated attendance record for course ${record.courseId} (section ${record.section})`);
      } else {
        console.warn(`⚠️ No course found for ${record.courseId} section ${record.section}`);
      }
    }

    console.log('🎉 All attendance records updated successfully.');
  } catch (err) {
    console.error('❌ Error updating attendance records:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateAttendanceRecords();
