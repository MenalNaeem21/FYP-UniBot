// models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  errorTitle: {
    type: String,
    required: true,
  },
  errorDetail: {
    type: String,
    required: true,
  },
}, { timestamps: true });  // createdAt, updatedAt auto

module.exports = mongoose.model('Complaint', complaintSchema);
