const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    swapId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Swap'
    },
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        validate: [
            {
                validator: function (val) {
                    return val.length === 2;
                },
                message: 'A chat must have exactly two participants.'
            },
            {
                validator: function (val) {
                    // Ensure unique ObjectIds
                    return new Set(val.map(id => id.toString())).size === 2;
                },
                message: 'Participants must be unique.'
            }
        ]
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['sent', 'seen'],
                default: 'sent'
            }
        }
    ]
}, {
    timestamps: true,
    toJSON: { transform(doc, ret) { delete ret.__v; return ret; } }
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
