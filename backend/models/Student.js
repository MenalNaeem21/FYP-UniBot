const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: Date,
  cnic: String,
  rollNo: String,
  degreeProgram: String,
  batch: String,
  campus: String,
  email: String,
  password: String,
  mobile: String,
  bloodGroup: String,
  address: String,
  familyInfo: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },

  registeredCourses: [
    {
      id: String,      // e.g. 'CS101'
      section: String, // e.g. 'A'
    }
  ],
  waitlistedCourses: [
    {
      id: String,
      section: String,
    }
  ],
  
  
});

// Hash password before saving the user
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
  this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  next();
});

studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
