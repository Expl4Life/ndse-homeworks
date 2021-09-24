const { Book } = require('../models');

const store = {
    testUser: { id: 1, mail: "test@mail.ru" },
    books: [
        new Book({title: 'Harry Potter'}),
        new Book({title: 'A little prince'}),
    ]
}

module.exports = {
    store
};