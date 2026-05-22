const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eduai_jwt_secret_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        streak: user.streak,
        analytics: user.analytics,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Manage Streak updates
      const today = new Date();
      const lastActive = new Date(user.lastActiveDate);
      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }

      user.lastActiveDate = today;
      await user.save();

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        streak: user.streak,
        analytics: user.analytics,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        streak: user.streak,
        analytics: user.analytics,
        bookmarks: user.bookmarks,
        notes: user.notes,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        streak: updatedUser.streak,
        analytics: updatedUser.analytics,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add bookmark
// @route   POST /api/auth/bookmarks
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { item } = req.body;

    if (!user.bookmarks.includes(item)) {
      user.bookmarks.push(item);
      await user.save();
    }

    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/auth/bookmarks
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { item } = req.body;

    user.bookmarks = user.bookmarks.filter(b => b !== item);
    await user.save();

    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update user note
// @route   POST /api/auth/notes
// @access  Private
const addNote = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { questionTitle, content } = req.body;

    const existingNoteIdx = user.notes.findIndex(n => n.questionTitle === questionTitle);

    if (existingNoteIdx > -1) {
      user.notes[existingNoteIdx].content = content;
      user.notes[existingNoteIdx].date = Date.now();
    } else {
      user.notes.push({ questionTitle, content });
    }

    await user.save();
    res.json({ success: true, notes: user.notes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  addBookmark,
  removeBookmark,
  addNote
};
