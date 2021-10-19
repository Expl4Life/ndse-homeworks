const express = require('express');
const router = express.Router();
const { Book } = require('../../models');
const fileMiddleware = require('../../middleware/file');
const { errorCreator } = require('../../utils');

//BOOKS API

// GET
router.get('/', async (req, res) => {
    const books = await Book.find().select('-__v');
    res.json(books);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const book = await Book.findById(id).select('-__v');
        res.json(book);
    } catch (e) {
        res.status(404);
        res.json(errorCreator(404));
    }
});

// POST
router.post('/', async (req, res) => {
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
        res.status(201);
        res.json(newBook);
    } catch (e) {
        console.error(e);
        res.json(errorCreator(500));
    }
});

// PUT
router.put('/:id', async (req, res) => {
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
        const book = await Book.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });
        res.json(book);
    } catch (e) {
        console.error(e);
        res.json(errorCreator(500));
    }
});


// DELETE
router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        await Book.deleteOne({_id: id});
        res.json(true);
    } catch (e) {
        console.error(e);
        res.json(errorCreator(500));
    }
});


// UPLOAD-DOWNLOAD files
router.post('/upload/:id', fileMiddleware.single('file'), async (req, res) => {
    const { path } = req.file;
    const { id } = req.params;

    if(!req.file) {
        res.json(null);
        return;
    }

    
    try {
        const book = await Book.findByIdAndUpdate(id, { fileBook: path })
        res.json(book);
    } catch (e) {
        res.status(404);
        res.json(errorCreator(404));
    }
});

router.get('/download/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id).select('-__v');
        res.download(__dirname+`/../${book.fileBook}`, book.fileBook, err=> {
            if (err){
                res.json('cannot download')
            }
        });
    } catch (e) {
        res.status(404);
        res.json(errorCreator(404));
    }
});

module.exports = router;
