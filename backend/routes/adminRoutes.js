const express = require('express');
const {
  getSystemAnalytics,
  getAllUsers,
  toggleAdminStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/analytics', protect, admin, getSystemAnalytics);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, toggleAdminStatus);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
