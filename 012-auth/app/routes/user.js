const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render("user/login", {
        title: "Войти в систему",
        route: 'login'
    });
});

router.get('/signup', (req, res) => {
    res.render("user/signup", {
        title: "Регистрация",
        route: 'signup'
    });
});

module.exports = router;

