const User = require('../models/User');
const Interview = require('../models/Interview');
const Submission = require('../models/Submission');

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSystemAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    // Group interviews by type
    const interviewGroups = await Interview.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 }, avgScore: { $avg: '$score' } } }
    ]);

    // Group submissions by language
    const submissionGroups = await Submission.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    // Format results
    const interviewStats = { Technical: 0, HR: 0, Aptitude: 0 };
    const avgScores = { Technical: 0, HR: 0, Aptitude: 0 };
    
    interviewGroups.forEach(g => {
      if (interviewStats[g._id] !== undefined) {
        interviewStats[g._id] = g.count;
        avgScores[g._id] = Math.round(g.avgScore || 0);
      }
    });

    const languageStats = { javascript: 0, python: 0, cpp: 0, java: 0 };
    submissionGroups.forEach(g => {
      if (languageStats[g._id] !== undefined) {
        languageStats[g._id] = g.count;
      }
    });

    // Provide default demo/trend data to populate charts on first run
    const userGrowthTrend = [
      { month: 'Jan', users: Math.max(5, Math.round(totalUsers * 0.2)) },
      { month: 'Feb', users: Math.max(12, Math.round(totalUsers * 0.4)) },
      { month: 'Mar', users: Math.max(25, Math.round(totalUsers * 0.6)) },
      { month: 'Apr', users: Math.max(48, Math.round(totalUsers * 0.8)) },
      { month: 'May', users: Math.max(75, totalUsers) }
    ];

    const practiceTrend = [
      { date: 'Mon', solved: Math.min(totalSubmissions, 5) },
      { date: 'Tue', solved: Math.min(totalSubmissions, 12) },
      { date: 'Wed', solved: Math.min(totalSubmissions, 8) },
      { date: 'Thu', solved: Math.min(totalSubmissions, 18) },
      { date: 'Fri', solved: Math.min(totalSubmissions, 25) }
    ];

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalInterviews,
        totalSubmissions
      },
      interviews: {
        types: interviewStats,
        averages: avgScores
      },
      languages: languageStats,
      trends: {
        userGrowth: userGrowthTrend,
        practiceTrend: practiceTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote/Demote user admin status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const toggleAdminStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent de-promoting oneself
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot modify your own administrator permissions');
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own profile');
    }

    await User.deleteOne({ _id: user._id });
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemAnalytics,
  getAllUsers,
  toggleAdminStatus,
  deleteUser
};
