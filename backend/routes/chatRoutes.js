const express = require('express');
const router = express.Router();
const { getChatHistory, getMyChats } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/chats
router.get('/', protect, getMyChats);

// Get/Initiate chat history
// @route   GET /api/chats/:swapId/:otherUserId
router.get('/:swapId/:otherUserId', protect, getChatHistory);

module.exports = router;
