const express = require('express');
const Teacher = require('../models/Teacher');
const router = express.Router();
const { faker } = require("@faker-js/faker");



const generateTeachers = (count = 10) => {
    let teachers = [];

    for (let i = 0; i < count; i++) {
        let teacher = {
            name: faker.person.fullName(),
            gender: faker.helpers.arrayElement(["Male", "Female"]),
            dob: faker.date.past({ years: 40, refDate: new Date(2000, 0, 1) }).toISOString().split("T")[0],
            cnic: faker.number.int({ min: 1000000000000, max: 9999999999999 }).toString(),
            tid: faker.number.int({ min: 1, max: 100 }).toString(),
            department: faker.helpers.arrayElement(["BS(CS)", "BS(SE)", "BS(AI)"]),
            dateJoined: faker.date.past({ years: 20, refDate: new Date() }).toISOString().split("T")[0],
            campus: faker.helpers.arrayElement(["Lahore", "Karachi", "Islamabad"]),
            email: faker.internet.email(),
            password: "password",  // Default password
            mobile: faker.phone.number("03#########"),
            bloodGroup: faker.helpers.arrayElement(["A", "B", "AB", "O"]),
            address: faker.location.streetAddress(),
            familyInfo: `Wife: ${faker.person.firstName()}`
        };

        teachers.push(teacher);
    }

    return teachers;
};




router.post("/bulk", async (req, res) => {
  try {
    const { teachers } = req.body; // Extract teachers array from request body
    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Insert data into database
    await Teacher.insertMany(teachers);
    res.status(201).json({ message: `${teachers.length} teachers added successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding teachers", error });
  }
});


// Create a new entry
router.post('/', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all entries
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update 
router.put('/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete  
router.delete('/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
