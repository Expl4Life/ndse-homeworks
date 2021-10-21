const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Book } = require('../models');
const COUNTER_API_URL = `http://${process.env.COUNTER_URL}:${process.env.COUNTER_PORT || '3001'}/counter`;

router.get('/', async (req, res) => {
    const books = await Book.find();
    res.render("books/index", {
        title: "Books",
        books,
        route: 'books',
        user: req.user || {}
    });
});

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        book: {},
        route: 'books',
        user: req.user || {}
    });
});

router.post('/create', async (req, res) => {
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

    try {
        await newBook.save();
        res.redirect('/books')
    } catch (e) {
        console.error(e);
    }    
});

router.get('/:id', async(req, res) => {
    const {id} = req.params;

    axios.post(`${COUNTER_API_URL}/${id}/cnt`);
    axios
        .get(`${COUNTER_API_URL}/${id}`)
        .then(async (response) => {
            let book;

            try {
                book = await Book.findById(id);
            } catch (e) {
                console.error(e);
                res.status(404).redirect('/404');
            }

            res.render("books/view", {
                title: "Book | view",
                book: book,
                cnt: (Number(response.data && response.data.cnt || 0)),
                route: 'books',
                user: req.user || {}
            });
        })
        .catch((e) => {
            console.error(e);
            res.status(404).redirect('/404');
        })
});

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;

    let book;

    try {
        book = await Book.findById(id);
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("books/update", {
        title: "Book | view",
        book: book,
        route: 'books',
        user: req.user || {}
    });
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;

    try {
        await Book.findByIdAndUpdate(id, {        
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books/${id}`);
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.deleteOne({_id: id});
    } catch (e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books`);
});

module.exports = router;

