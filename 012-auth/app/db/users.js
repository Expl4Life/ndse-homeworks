const { User } = require('../models');

exports.findById = async (id, cb) => {
    console.log('%cusers.js line:4 id', 'color: #007acc;', id);
    const user = await User.findById(`${id}`).select('-__v');

    if (user) {
        cb(null, user)
    } else {
        cb(new Error('User ' + id + ' does not exist'));
    }
}

exports.findByUserName = async(userName, cb) => {
    const users = await User.find().select('-__v');
    const user = users.find((user) => user.userName === userName);
    return user ? cb(null, user) : cb(null, null);
}

exports.verifyPassword = (user, password) => {
    return user.password === password;
}

exports.addUser = async (user) => {
    console.log('%cusers.js line:25 user', 'color: #007acc;', user);
    const newUser = new User(user);
    await newUser.save();
};
