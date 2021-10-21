const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    chatId: {
        type: String,
        required: true,
    },
    messages: {
        type: Array,
        required: false,
        default: []
    },
});

module.exports = model('chat', chatSchema);
