const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const userApiRouter = require('./routes/api/user');
const booksRouter = require('./routes/books');
const { buildUrl } = require('./utils');

const PORT = process.env.PORT || 3000;
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

app.listen(PORT, () => {
    console.log(`Express app is listening at http://localhost:${PORT}`)
});
