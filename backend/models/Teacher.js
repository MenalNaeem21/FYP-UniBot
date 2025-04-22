const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

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
  familyInfo: String,
  role: { type: String, default: "teacher", enum: ["teacher"] }
});
// Hash password before saving the user
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
  this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  next();
});

teacherSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('Teacher', teacherSchema);
