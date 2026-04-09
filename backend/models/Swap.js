const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
    offerSkill: {
        type: String,
        required: [true, 'Please add a skill you offer']
    },
    offerCategory: {
        type: String,
        default: 'General'
    },
    seekSkill: {
        type: String,
        required: [true, 'Please add a skill you are seeking']
    },
    seekCategory: {
        type: String,
        default: 'General'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In-Progress', 'Completed'],
        default: 'Open'
    }
}, {
    timestamps: true
});

const Swap = mongoose.model('Swap', swapSchema);
module.exports = Swap;
