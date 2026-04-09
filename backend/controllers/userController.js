const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, college_email, password, role } = req.body;

        // Validation
        if (!name || !college_email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields (name, college_email, password)' });
        }

        // Check if user exists
        const userExists = await User.findOne({ college_email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this college email' });
        }

        // Create user
        const user = await User.create({
            name,
            college_email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                college_email: user.college_email,
                role: user.role,
                is_verified: user.is_verified,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { college_email, password } = req.body;

        if (!college_email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by college_email
        const user = await User.findOne({ college_email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                college_email: user.college_email,
                role: user.role,
                is_verified: user.is_verified,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                college_email: user.college_email,
                role: user.role,
                is_verified: user.is_verified,
                bio: user.bio,
                location: user.location,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow updating these fields
        user.name = req.body.name || user.name;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.location = req.body.location !== undefined ? req.body.location : user.location;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            college_email: updatedUser.college_email,
            role: updatedUser.role,
            is_verified: updatedUser.is_verified,
            bio: updatedUser.bio,
            location: updatedUser.location,
            createdAt: updatedUser.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
