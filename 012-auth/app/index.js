const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const userApiRouter = require('./routes/api/user');
const booksRouter = require('./routes/books');
const { buildUrl } = require('./utils');

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME;
const PasswordDB = process.env.DB_PASSWORD;
const NameDB = process.env.DB_NAME || 'app_database'

const UserAtlasDB = process.env.DB_ATLAS_USERNAME;
const PasswordAtlasDB = process.env.DB_ATLAS_PASSWORD;
const NameAtlasDB = process.env.DB_ATLAS_NAME || 'app_database';

const HostDb = process.env.DB_HOST || 'mongodb://mongodb/'
const APP_URL = '/api';
const SERVICES_URLS = {
    Books: '/books',
    User : '/user',
}

const USER_API_URL = buildUrl(APP_URL, SERVICES_URLS.User);
const BOOKS_API_URL = buildUrl(APP_URL, SERVICES_URLS.Books);
const BOOKS_URL = SERVICES_URLS.Books;

const app = express();


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.set("view engine", "ejs");

app.use('/public', express.static(__dirname+"/public"));

app.use('/', indexRouter);
app.use(BOOKS_API_URL, booksApiRouter);
app.use(USER_API_URL, userApiRouter);
app.use(BOOKS_URL, booksRouter);

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