const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../controllers/userController');
const validateObjectId = require('../middleware/validateObjectId');

// @route   GET /api/profiles/:id
// @access  Public
router.get('/:id', validateObjectId(), getPublicProfile);

module.exports = router;
