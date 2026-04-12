const express = require('express');
const router = express.Router();
const { getChatHistory, getMyChats, markMessagesAsSeen } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// @route   GET /api/chats
router.get('/', protect, getMyChats);

// Get/Initiate chat history
// @route   GET /api/chats/:swapId/:otherUserId
router.get('/:swapId/:otherUserId', protect, validateObjectId('swapId'), validateObjectId('otherUserId'), getChatHistory);

// Mark chat as seen
// @route   PUT /api/chats/seen/:chatId
router.put('/seen/:chatId', protect, validateObjectId('chatId'), markMessagesAsSeen);

module.exports = router;
