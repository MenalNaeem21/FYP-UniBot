// models/Faq.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });  // createdAt, updatedAt auto

module.exports = mongoose.model('Faq', faqSchema);
