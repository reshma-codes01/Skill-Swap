const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    swapId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Swap'
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: [true, 'Please add a proposal message']
    },
    offeredSkill: {
        type: String,
        required: [true, 'Please specify the skill you are offering in exchange']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true,
    toJSON: { transform(doc, ret) { delete ret.__v; return ret; } }
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
module.exports = SwapRequest;
