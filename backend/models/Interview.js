const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR', 'Aptitude'],
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number, // overall out of 100
    default: 0
  },
  feedback: {
    confidenceScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    strengths: [String],
    improvements: [String]
  },
  transcript: [{
    question: String,
    answer: String,
    score: Number,
    feedback: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);
