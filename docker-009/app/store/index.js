const { Book } = require('../models');

const store = {
    testUser: { id: 1, mail: "test@mail.ru" },
    books: [
        new Book({title: 'Harry Potter', description: 'Magic world', id: '1' }),
        new Book({title: 'A little prince', id: '2'}),
        new Book({title: 'The Idiot', id: '3'}),
    ]
}

module.exports = {
    store
};