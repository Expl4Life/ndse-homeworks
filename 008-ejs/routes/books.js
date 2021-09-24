const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const { store } = require('../store');
const fileMiddleware = require('../middleware/file');
const { errorCreator } = require('../utils');

//BOOKS API

// GET
router.get('/', (req, res) => {
    const { books } = store;
    res.json(books);
});

router.get('/:id', (req, res) => {
    const { books } = store;
    const {id} = req.params;
    const book = books.find((item) => item.id === id);

    if(book) {
        res.json(book);
    } else {
        res.status(404);
        res.json(errorCreator(404));
    }
});

// POST
router.post('/', (req, res) => {
    const { books } = store;
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
    res.status(201);
    res.json(newBook);
});

// PUT
router.put('/:id', (req, res) => {
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
            fileBook: fileName || books[idx].fileBook,
        }
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json(errorCreator(404));
    }
});


// DELETE
router.delete('/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex((item) => item.id === id);
    if(idx !== -1) {
        books.splice(idx, 1);
        res.json('ok');
    } else {
        res.status(404);
        res.json(errorCreator(404));
    }
});


// UPLOAD-DOWNLOAD files
router.post('/upload/:id', fileMiddleware.single('file'), (req, res) => {
    const { books } = store;

    if(!req.file) {
        res.json(null);
        return;
    }

    const { path } = req.file;
    const { id } = req.params;
    const idx = books.findIndex((item) => item.id === id);

    if(idx !== -1) {
        books[idx] = {
            ...books[idx],
            fileBook: path
        }
    } else {
        res.status(404);
        res.json(errorCreator(404));
    }

    res.json(path);
});

router.get('/download/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex((item) => item.id === id);

    if(idx !== -1 && books[idx].fileBook) {
        res.download(__dirname+`/../${books[idx].fileBook}`, books[idx].fileBook, err=> {
            if (err){
                res.json('cannot download')
            }
        });
    } else {
        res.status(404);
        res.json(errorCreator(404));
    }
});

module.exports = router;
