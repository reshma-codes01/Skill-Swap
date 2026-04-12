const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../controllers/userController');

// @route   GET /api/profiles/:id
// @access  Public
router.get('/:id', getPublicProfile);

module.exports = router;
