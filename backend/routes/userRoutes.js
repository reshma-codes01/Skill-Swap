const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
router.post('/signup', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @access  Private (Needs Token)
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/auth/profile
// @access  Private (Needs Token)
router.put('/profile', protect, updateUserProfile);

module.exports = router;
