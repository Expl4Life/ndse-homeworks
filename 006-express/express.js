const express = require('express');
const { v4: uuid } = require('uuid');
const { buildUrl } = require('./utils');
const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = '/api';
const BOOKS_API_URL = '/books';
const LOGIN_URL = '/user/login';
const booksUrl = createBooksUrl();
const loginUrl = createLoginUrl();

class Book {
    constructor(data) {
        this.id = data.id || uuid(),
        this.title = data.title || ''
        this.description = data.description || ''
        this.authors = data.authors || ''
        this.favorite = data.favorite || ''
        this.fileCover = data.fileCover || ''
        this.fileName = data.fileName || ''
    }
}

const store = {
    testUser: { id: 1, mail: "test@mail.ru" },
    books: [
        new Book({title: 'Harry Potter'}),
        new Book({title: 'A little prince'}),
    ]
}

app.use(express.json());

// USER
app.post(loginUrl, (req, res) => {
    res.status(201);
    res.json(store.testUser);
});

//BOOKS API


// GET
app.get(booksUrl, (req, res) => {
    const { books } = store;
    res.json(books);
});

app.get(`${booksUrl}/:id`, (req, res) => {
    const { books } = store;
    const {id} = req.params;
    const book = books.find((item) => item.id === id);

    if(book) {
        res.json(book);
    } else {
        res.status(404);
        res.json('Code: 404');
    }
});

// POST
app.post(booksUrl, (req, res) => {
    const { books } = store;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;

    const newBook = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    });
    books.push(newBook);
    res.status(201);
    res.json(newBook);
});

// PUT
app.put(`${booksUrl}/:id`, (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;
    const idx = books.findIndex((item) => item.id === id);
    if(idx !== -1) {
        books[idx] = {
            ...books[idx],
            title: title || books[idx].title,
            description: description || books[idx].description,
            authors: authors || books[idx].authors,
            favorite: favorite || books[idx].favorite,
            fileCover: fileCover || books[idx].fileCover,
            fileName: fileName || books[idx].fileName,
        }
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json('Code: 404');
    }
});


// DELETE
app.delete(`${booksUrl}/:id`, (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex((item) => item.id === id);
    if(idx !== -1) {
        books.splice(idx, 1);
        res.json('ok');
    } else {
        res.status(404);
        res.json('Code: 404');
    }
});


app.listen(PORT, () => {
    console.log(`Express app is listening at http://localhost:${PORT}`)
});

function createBooksUrl() {
    return buildUrl(APP_URL, BOOKS_API_URL);
}

function createLoginUrl() {
    return buildUrl(APP_URL, LOGIN_URL);
}
