const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../../db');
const { errorCreator } = require('../../utils');

router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/user/login',
            successRedirect : '/user/me', 
        },
    ),
    (req, res) => {
        console.log("req.user: ", req.user);
        res.redirect('/user/me');
    });

router.get('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

router.post('/signup',
    async (req, res) => {
        const { userName, password, repeatPassword } = req.body;
        if(userName && password && password === repeatPassword) {
            await db.users.addUser({
                userName,
                password,
            });
            res.redirect('/user/login');
        } else {
            res.redirect('/user/signup');
        }
    });

router.get('/auth-github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/user/login'}),
    async (req, res) => {
        console.log("req.user: ", req.user);
        res.redirect('/user/me');
    });



module.exports = router;
