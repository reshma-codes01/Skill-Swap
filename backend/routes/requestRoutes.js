const express = require('express');
const router = express.Router();
const { applyForSwap, getReceivedRequests, updateRequestStatus, getSentRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

// All routes are protected
router.use(protect);

// @route   POST /api/requests/apply
router.post('/apply', applyForSwap);

// @route   GET /api/requests/received
router.get('/received', getReceivedRequests);

// @route   GET /api/requests/sent
router.get('/sent', getSentRequests);

// @route   PUT /api/requests/:id/status
router.put('/:id/status', validateObjectId(), updateRequestStatus);

module.exports = router;
