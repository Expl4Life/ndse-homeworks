const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render("auth/login", {
        title: "Войти в систему",
        route: 'login'
    });
});

router.get('/signup', (req, res) => {
    res.render("auth/signup", {
        title: "Зарегистрироваться",
        route: 'signup'
    });
});

module.exports = router;

