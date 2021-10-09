const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        default: 'testUser'
    },
});

module.exports = model('user', userSchema);
