const express = require('express');
const router = express.Router();
const { User } = require('../../models');

router.post('/login', (req, res) => {
    res.status(201);
    res.json(new User());
});

module.exports = router;
