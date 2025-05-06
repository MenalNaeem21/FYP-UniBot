const mongoose = require('mongoose');

// Helper function to generate random 3-digit ID
const generateTaskId = () => {
  return Math.floor(100 + Math.random() * 900); // Random between 100-999
};

const classworkSchema = new mongoose.Schema({
  taskId: {
    type: Number,
    unique: true,
    required: true,
    default: generateTaskId, // Auto-generate random taskId 🔥
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachmentUrl: {
    type: String,
    default: '', // Optional if no file attached
  },
  dueDate: {
    type: Date,
    required: true,
  },
  courseId: {
    type: String,
  },
  courseSection: {
    type: String,
  },
  courseName: {
    type: String,
  },
  submissions: [
    {
      rollNo: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      submittedFileUrl: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['Submitted', 'Late'],
        default: 'Submitted',
      },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Classwork', classworkSchema);
