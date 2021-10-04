const { Book } = require('../models');

const store = {
    testUser: { id: 1, mail: "test@mail.ru" },
    books: [
        new Book({title: 'Harry Potter', description: 'Magic world'}),
        new Book({title: 'A little prince'}),
        new Book({title: 'The Idiot'}),
    ]
}

module.exports = {
    store
};