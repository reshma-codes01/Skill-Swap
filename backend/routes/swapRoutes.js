const express = require('express');
const router = express.Router();
const { createSwap, getSwaps, getUserSwaps, updateSwap, deleteSwap } = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// @route   GET /api/swaps
router.get('/', getSwaps);

// @route   POST /api/swaps
router.post('/', protect, createSwap);

// @route   GET /api/swaps/me
router.get('/me', protect, getUserSwaps);

// @route   PUT /api/swaps/:id
router.put('/:id', protect, validateObjectId(), updateSwap);

// @route   DELETE /api/swaps/:id
router.delete('/:id', protect, validateObjectId(), deleteSwap);

module.exports = router;

