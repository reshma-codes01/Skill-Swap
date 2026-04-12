const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, toggleSaveSwap, getSavedSwaps, getConnections } = require('../controllers/userController');
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

// @route   POST /api/auth/save/:swapId
// @access  Private - Toggle save/unsave a swap
router.post('/save/:swapId', protect, toggleSaveSwap);

// @route   GET /api/auth/saved
// @access  Private - Get all saved swaps
router.get('/saved', protect, getSavedSwaps);

// @route   GET /api/auth/connections
// @access  Private - Get connected users
router.get('/connections', protect, getConnections);

module.exports = router;
