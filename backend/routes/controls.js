const express = require('express');
const router = express.Router();
const Controls = require('../models/Controls');

// Get current controls
router.get('/', async (req, res) => {
  try {
    let controls = await Controls.findOne();
    if (!controls) {
      controls = await Controls.create({});
    }
    res.json(controls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update controls
router.put('/', async (req, res) => {
  try {
    const { registrationOpen, activeSemester, graderOpen } = req.body;
    let controls = await Controls.findOne();
    if (!controls) {
      controls = await Controls.create({});
    }
    if (registrationOpen !== undefined) controls.registrationOpen = registrationOpen;
    if (activeSemester) controls.activeSemester = activeSemester;
    if (graderOpen !== undefined) controls.graderOpen = graderOpen;
    await controls.save();
    res.json({ message: 'Controls updated successfully', controls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
