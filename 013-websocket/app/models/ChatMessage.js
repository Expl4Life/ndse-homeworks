const { Schema, model } = require('mongoose');

const chatMessageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: false,
        default: new Date(),
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

module.exports = model('chatMessage', chatMessageSchema);
