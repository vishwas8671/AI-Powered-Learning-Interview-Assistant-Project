const express = require('express');
const {
  getProblems,
  getProblemById,
  runCode,
  getSubmissions
} = require('../controllers/practiceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/problems', protect, getProblems);
router.get('/problems/:id', protect, getProblemById);
router.post('/run', protect, runCode);
router.get('/submissions', protect, getSubmissions);

module.exports = router;
