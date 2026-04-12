const Chat = require('../models/Chat');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get chat history or initiate a new chat if request is accepted
// @route   GET /api/chats/:swapId/:otherUserId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const { swapId, otherUserId } = req.params;
        const currentUserId = req.user._id;

        // 1. Enforce Spam Protection: Check if an 'Accepted' SwapRequest exists between these two users for this swapId
        // The requester could be either the current user (applicant) or the other user.
        const acceptedRequest = await SwapRequest.findOne({
            swapId,
            status: 'Accepted',
            $or: [
                { applicantId: currentUserId },
                { applicantId: otherUserId }
            ]
        });

        if (!acceptedRequest) {
            return res.status(403).json({ 
                message: 'Forbidden: Chat can only be initiated if a swap request has been Accepted.' 
            });
        }

        // 2. Find or Create Chat
        // Sort participants to ensure consistent matching
        const participants = [currentUserId, otherUserId].sort();

        let chat = await Chat.findOne({
            swapId,
            participants: { $all: participants }
        });

        if (!chat) {
            chat = await Chat.create({
                swapId,
                participants,
                messages: []
            });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all chats for the logged-in user
// @route   GET /api/chats
// @access  Private
const getMyChats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find chats where the current user is a participant
        const chats = await Chat.find({
            participants: userId
        })
        .populate('participants', 'name college_email') // Profile details for preview
        .populate('swapId', 'title') // Swap details for context
        .sort({ updatedAt: -1 }); // Most recent activity first

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory,
    getMyChats
};
