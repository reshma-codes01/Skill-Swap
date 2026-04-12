const User = require('../models/User');
const Chat = require('../models/Chat');
const generateToken = require('../utils/generateToken');


// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, college_email, password } = req.body;

        // Validation
        if (!name || !college_email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields (name, college_email, password)' });
        }

        // Check if user exists
        const userExists = await User.findOne({ college_email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this college email' });
        }

        // Create user (role defaults to 'Student' via schema)
        const user = await User.create({
            name,
            college_email,
            password
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
        const user = await User.findById(req.user._id).select('-password -__v -savedSwaps');

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
        const user = await User.findById(req.user._id).select('-password -__v -savedSwaps');

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

// @desc    Get public profile of any user by ID
// @route   GET /api/profiles/:id
// @access  Public
const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name bio location skills_offered skills_needed portfolio_links createdAt');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle save/unsave a swap
// @route   POST /api/auth/save/:swapId
// @access  Private
const toggleSaveSwap = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('savedSwaps');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const swapId = req.params.swapId;
        const index = user.savedSwaps.indexOf(swapId);

        if (index > -1) {
            // Unsave
            user.savedSwaps.splice(index, 1);
            await user.save();
            res.json({ saved: false, savedSwaps: user.savedSwaps });
        } else {
            // Save
            user.savedSwaps.push(swapId);
            await user.save();
            res.json({ saved: true, savedSwaps: user.savedSwaps });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all saved swaps (populated)
// @route   GET /api/auth/saved
// @access  Private
const getSavedSwaps = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedSwaps',
            populate: { path: 'postedBy', select: 'name' }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.savedSwaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get connections (users with whom we share an active chat)
// @route   GET /api/auth/connections
// @access  Private
const getConnections = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all chats where the current user is a participant
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'name bio');

        // Extract unique other participants
        const connectionMap = new Map();
        chats.forEach(chat => {
            chat.participants.forEach(p => {
                if (p._id.toString() !== userId.toString() && !connectionMap.has(p._id.toString())) {
                    connectionMap.set(p._id.toString(), p);
                }
            });
        });

        res.json(Array.from(connectionMap.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getPublicProfile,
    toggleSaveSwap,
    getSavedSwaps,
    getConnections
};
