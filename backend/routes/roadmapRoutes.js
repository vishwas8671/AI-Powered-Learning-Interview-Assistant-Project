const express = require('express');
const { getUserRoadmaps, toggleTopic } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserRoadmaps);
router.post('/toggle', protect, toggleTopic);

module.exports = router;
