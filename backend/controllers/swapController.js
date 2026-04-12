const Swap = require('../models/Swap');

// @desc    Create a new swap
// @route   POST /api/swaps
// @access  Private
const createSwap = async (req, res) => {
    try {
        const { title, offerSkill, offerCategory, seekSkill, seekCategory } = req.body;

        if (!title || !offerSkill || !seekSkill) {
            return res.status(400).json({ message: 'Please provide title, offerSkill, and seekSkill' });
        }

        const swap = await Swap.create({
            title,
            offerSkill,
            offerCategory,
            seekSkill,
            seekCategory,
            postedBy: req.user._id
        });

        res.status(201).json(swap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all swaps
// @route   GET /api/swaps
// @access  Public
const getSwaps = async (req, res) => {
    try {
        // Optionally populate 'postedBy' to get user details attached to swap requests
        const swaps = await Swap.find().populate('postedBy', 'name college_email');
        res.status(200).json(swaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get swaps created by logged-in user
// @route   GET /api/swaps/me
// @access  Private
const getUserSwaps = async (req, res) => {
    try {
        const swaps = await Swap.find({ postedBy: req.user._id }).populate('postedBy', 'name college_email');
        res.status(200).json(swaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a swap
// @route   PUT /api/swaps/:id
// @access  Private (owner only)
const updateSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check ownership
        if (swap.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this swap' });
        }

        const { offerSkill, offerCategory, seekSkill, seekCategory, status } = req.body;

        swap.offerSkill = offerSkill || swap.offerSkill;
        swap.offerCategory = offerCategory || swap.offerCategory;
        swap.seekSkill = seekSkill || swap.seekSkill;
        swap.seekCategory = seekCategory || swap.seekCategory;
        swap.status = status || swap.status;

        const updatedSwap = await swap.save();
        const populated = await updatedSwap.populate('postedBy', 'name college_email');

        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a swap
// @route   DELETE /api/swaps/:id
// @access  Private (owner only)
const deleteSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // Check ownership
        if (swap.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this swap' });
        }

        await swap.deleteOne();
        res.status(200).json({ message: 'Swap deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSwap,
    getSwaps,
    getUserSwaps,
    updateSwap,
    deleteSwap
};

