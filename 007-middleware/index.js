const express = require('express');
const cors = require('cors');

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const { buildUrl } = require('./utils');

const PORT = process.env.PORT || 3000;
const APP_URL = '/api';
const SERVICES_URLS = {
    Books: '/books',
    User : '/user',
}

const USER_URL = buildUrl(APP_URL, SERVICES_URLS.User);
const BOOKS_URL = buildUrl(APP_URL, SERVICES_URLS.Books);

const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.use('/public', express.static(__dirname+"/public"));

app.use('/', indexRouter);
app.use(BOOKS_URL, booksRouter);
app.use(USER_URL, userRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Express app is listening at http://localhost:${PORT}`)
});
