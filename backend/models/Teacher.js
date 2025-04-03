const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: String,
  cnic: String,
  tid: String,
  department: String,
  datejoined: String,
  campus: String,
  email: String,
  password: String,
  mobile: String,
  bloodGroup: String,
  address: String,
  familyInfo: String
});

module.exports = mongoose.model('Teacher', teacherSchema);
