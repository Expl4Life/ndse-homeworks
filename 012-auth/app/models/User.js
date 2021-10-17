const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        default: 'none'
    },
    password: {
        type: String,
        required: true,
        default: ''
    },
    displayName: {
        type: String,
        required: false,
        default: 'none'
    },
    email: {
        type: Array,
        required: false,
        default: ['none']
    },
});

module.exports = model('user', userSchema);
