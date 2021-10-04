const express = require('express');
const request = require('request');
const router = express.Router();
const { Book } = require('../models');
const { store } = require('../store');
const COUNTER_API_URL = '/counter';


router.get('/', (req, res) => {
    const {books} = store;
    res.render("books/index", {
        title: "Books",
        books,
    });
});

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        book: {},
    });
});

router.post('/create', (req, res) => {
    const {books} = store;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    } = req.body;

    const newBook = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    });

    books.push(newBook);

    res.redirect('/books')
});

router.get('/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
    
        let counter = 0;
        request.post(`${COUNTER_API_URL}/${id}/cnt`, {port: 3001});
        request.get(`${COUNTER_API_URL}/${id}`, {port: 3001})
            .on('response', response => {
                console.log(response);
                counter = (response && response.body.cnt) || counter;

                res.render("books/view", {
                    title: "Book | view",
                    book: books[idx],
                    cnt: counter + 1
                });
            })
    } else {
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render("books/update", {
            title: "Book | view",
            book: books[idx],
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/update/:id', (req, res) => {
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
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title: title || books[idx].title,
            description: description || books[idx].description,
            authors: authors || books[idx].authors,
            favorite: favorite || books[idx].favorite,
            fileCover: fileCover || books[idx].fileCover,
            fileName: fileName || books[idx].fileName,
            fileBook: fileName || books[idx].fileBook,
        }
        res.redirect(`/books/${id}`);
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/delete/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.redirect(`/books`);
    } else {
        res.status(404).redirect('/404');
    }
});

module.exports = router;

