const Roadmap = require('../models/Roadmap');

// @desc    Get user roadmaps
// @route   GET /api/roadmaps
// @access  Private
const getUserRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id });
    res.json({ success: true, roadmaps });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle topic completion
// @route   POST /api/roadmaps/toggle
// @access  Private
const toggleTopic = async (req, res, next) => {
  try {
    const { title, topic } = req.body;

    let roadmap = await Roadmap.findOne({ user: req.user._id, title });

    if (!roadmap) {
      roadmap = new Roadmap({
        user: req.user._id,
        title,
        completedTopics: []
      });
    }

    const index = roadmap.completedTopics.indexOf(topic);
    if (index > -1) {
      // Remove topic (uncomplete)
      roadmap.completedTopics.splice(index, 1);
    } else {
      // Add topic (complete)
      roadmap.completedTopics.push(topic);
    }

    roadmap.updatedAt = Date.now();
    await roadmap.save();

    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserRoadmaps,
  toggleTopic
};
