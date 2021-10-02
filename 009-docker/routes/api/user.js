const express = require('express');
const router = express.Router();
const { store } = require('../../store');

router.post('/login', (req, res) => {
    res.status(201);
    res.json(store.testUser);
});

module.exports = router;
