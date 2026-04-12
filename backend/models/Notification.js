const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['request_accepted', 'request_rejected', 'new_chat', 'new_request'],
        required: true
    },
    swapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Swap',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { transform(doc, ret) { delete ret.__v; return ret; } }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
