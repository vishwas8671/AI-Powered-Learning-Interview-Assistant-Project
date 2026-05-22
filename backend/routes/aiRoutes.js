const express = require('express');
const {
  getAITutorExplanation,
  getAIQuiz,
  startInterview,
  evaluateInterview
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tutor', protect, getAITutorExplanation);
router.post('/quiz', protect, getAIQuiz);
router.post('/interview/start', protect, startInterview);
router.post('/interview/evaluate', protect, evaluateInterview);

module.exports = router;
