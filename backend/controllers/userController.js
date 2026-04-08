const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, college_email, password, role } = req.body;

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
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { college_email, password } = req.body;

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

module.exports = {
    registerUser,
    loginUser
};
