const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');
const sessionMiddleware = require('./middleware/session');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const userApiRouter = require('./routes/api/user');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const { buildUrl } = require('./utils');
const db = require('./db')

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME;
const PasswordDB = process.env.DB_PASSWORD;
const NameDB = process.env.DB_NAME || 'app_database';
const HostDb = process.env.DB_HOST || 'mongodb://mongodb/'

const UserAtlasDB = process.env.DB_ATLAS_USERNAME;
const PasswordAtlasDB = process.env.DB_ATLAS_PASSWORD;
const NameAtlasDB = process.env.DB_ATLAS_NAME || 'app_database';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '95e150b655f5a193d9d4';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '6b6f7d00796b6915f1caa4cc4337c78f4d1ef26e';


const APP_URL = '/api';
const SERVICES_URLS = {
    Books: '/books',
    User : '/user',
}

const USER_API_URL = buildUrl(APP_URL, SERVICES_URLS.User);
const BOOKS_API_URL = buildUrl(APP_URL, SERVICES_URLS.Books);
const BOOKS_URL = SERVICES_URLS.Books;
const USER_URL = SERVICES_URLS.User;

const authOptions = {
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: false,
}

function verify (username, password, done) {
    console.log('%cindex.js line:50 username', 'color: #007acc;', username);
    console.log('%cindex.js line:50 password', 'color: #007acc;', password);
    db.users.findByUserName(username, (err, user) => {
        if (err) { return done(err) };
        if (!user) { return done(null, false) };

        if (!db.users.verifyPassword(user, password)) { return done(null, false) };

        return done(null, user);
    })
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(authOptions, verify));
console.log(`http://localhost:${PORT}${USER_API_URL}/github/callback`);
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}${USER_API_URL}/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        
         // asynchronous verification, for effect...
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        await db.users.addUser({
            id: `${profile.id}`,
            userName: profile.login,
            displayName: profile.name,
            avatarUrl: profile.avatar_url,
            emails: [profile.email || '']
        });
        
        return done(null, profile);
    }
));

// Конфигурирование Passport для сохранения пользователя в сессии
// passport.serializeUser((user, cb) => {
//     console.log('%cindex.js line:62 user', 'color: #007acc;', user);
//     cb(null, user.id);
// })

// passport.deserializeUser( (id, cb) => {
//     console.log('%cindex.js line:67 id', 'color: #007acc;', id);
//     cb(null, user);
//     db.users.findById(id,  (err, user) => {
//         if (err) { return cb(err) };
//         cb(null, user);
//     })
// })

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

const app = express();


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware());
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(loggerMiddleware);


app.use('/public', express.static(__dirname+"/public"));

app.use('/', indexRouter);
app.use(BOOKS_API_URL, booksApiRouter);
app.use(USER_API_URL, userApiRouter);
app.use(BOOKS_URL, booksRouter);
app.use(USER_URL, userRouter);

app.use(errorMiddleware);

async function start() {
    try {
        console.log(`mongodb+srv://${UserAtlasDB}:${PasswordAtlasDB}@cluster0.ctq8h.mongodb.net/${NameAtlasDB}?retryWrites=true&w=majority`);
        const UrlDB = `mongodb+srv://${UserAtlasDB}:${PasswordAtlasDB}@cluster0.ctq8h.mongodb.net/${NameAtlasDB}?retryWrites=true&w=majority`;
        await mongoose.connect(UrlDB);
        
        // await mongoose.connect(HostDb, {
        //     user: UserDB,
        //     pass: PasswordDB,
        //     dbName: NameDB,
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Express app is listening at http://localhost:${PORT}`)
        });
    } catch (e) {
        console.log(e);
    }
}

start();