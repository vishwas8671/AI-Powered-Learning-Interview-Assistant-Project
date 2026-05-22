const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  completedTopics: [{
    type: String // Completed topic/node identifier
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicate roadmaps per user per title
RoadmapSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
