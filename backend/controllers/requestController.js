const SwapRequest = require('../models/SwapRequest');
const Swap = require('../models/Swap');
const Notification = require('../models/Notification');

// @desc    Apply for a skill swap
// @route   POST /api/requests/apply
// @access  Private
const applyForSwap = async (req, res) => {
    try {
        const { swapId, message, offeredSkill } = req.body;
        const applicantId = req.user._id;

        // 1. Check if swap exists
        const swap = await Swap.findById(swapId);
        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        // 2. Ensure user is not applying to their own swap
        const ownerId = swap.postedBy._id || swap.postedBy;
        if (String(applicantId) === String(ownerId)) {
            return res.status(400).json({ message: 'You cannot apply to your own swap posting' });
        }

        // 3. Check for multiple applications from same user
        const existingRequest = await SwapRequest.findOne({ swapId, applicantId });
        if (existingRequest) {
            return res.status(400).json({ message: 'You have already applied for this swap' });
        }

        // 4. Create request
        const request = await SwapRequest.create({
            swapId,
            applicantId,
            message,
            offeredSkill
        });

        res.status(201).json(request);

        // --- Notification Logic ---
        try {
            const io = req.app.get('socketio');
            const notification = await Notification.create({
                recipient: ownerId,
                sender: applicantId,
                type: 'new_request',
                swapId: swapId,
                message: `has applied for your swap: ${swap.title}`
            });

            const populatedNotify = await Notification.findById(notification._id).populate('sender', 'name');
            io.to(`user_${ownerId}`).emit('new_notification', populatedNotify);
        } catch (notifyErr) {
            console.error('Notification Error (Apply):', notifyErr);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests received for swaps owned by the logged-in user
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all swaps owned by the CURRENT authenticated user
        const userSwaps = await Swap.find({ postedBy: userId });
        const swapIds = userSwaps.map(swap => swap._id);

        // 2. Find requests only associated with the logged-in user's swapId list
        const requests = await SwapRequest.find({ swapId: { $in: swapIds } })
            .populate('applicantId', 'name college_email')
            .populate('swapId', 'title');

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update swap request status (Accepted/Rejected)
// @route   PUT /api/requests/:id/status
// @access  Private (Swap owner only)
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;

        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Accepted or Rejected' });
        }

        // 1. Find the request and populate the swap to check ownership
        const request = await SwapRequest.findById(requestId).populate('swapId');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // 2. Check if the current user is the owner of the swap
        if (request.swapId.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this request' });
        }

        // 3. Update status
        request.status = status;
        await request.save();

        res.status(200).json(request);

        // --- Notification Logic ---
        try {
            const io = req.app.get('socketio');
            const notification = await Notification.create({
                recipient: request.applicantId,
                sender: req.user._id,
                type: status === 'Accepted' ? 'request_accepted' : 'request_rejected',
                swapId: request.swapId._id,
                message: `has ${status.toLowerCase()} your swap request for: ${request.swapId.title}`
            });

            const populatedNotify = await Notification.findById(notification._id).populate('sender', 'name');
            io.to(`user_${request.applicantId}`).emit('new_notification', populatedNotify);
        } catch (notifyErr) {
            console.error('Notification Error (Status Update):', notifyErr);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all requests sent by the logged-in user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
    try {
        const requests = await SwapRequest.find({ applicantId: req.user._id })
            .populate('swapId', 'title offerSkill seekSkill postedBy')
            .populate({
                path: 'swapId',
                populate: { path: 'postedBy', select: 'name college_email' }
            });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForSwap,
    getReceivedRequests,
    updateRequestStatus,
    getSentRequests
};
