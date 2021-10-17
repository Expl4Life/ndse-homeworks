const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

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

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/me', isAuth, (req, res) => {
    res.render("user/me", {
        title: "Персональные данные",
        route: 'me',
        user: req.user || {}
    });
});

module.exports = router;

