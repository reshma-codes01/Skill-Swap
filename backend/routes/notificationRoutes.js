const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', validateObjectId(), markAsRead);

module.exports = router;
