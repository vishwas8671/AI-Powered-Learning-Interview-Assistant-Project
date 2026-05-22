const express = require('express');
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  addBookmark,
  removeBookmark,
  addNote
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/bookmarks')
  .post(protect, addBookmark)
  .delete(protect, removeBookmark);
router.post('/notes', protect, addNote);

module.exports = router;
