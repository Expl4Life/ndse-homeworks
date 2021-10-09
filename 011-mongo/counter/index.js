const express = require('express');
const redis = require('redis');
const app = express();
const PORT = process.env.PORT || 3001;
const COUNTER_API_URL = '/counter';
const REDIS_URL = process.env.REDIS_URL || 'redis';

const client = redis.createClient(`redis://${REDIS_URL}`);

app.use(express.json());

// COUNTER API
app.get(`${COUNTER_API_URL}/:bookId`, (req, res) => {
    const { bookId } = req.params;

    if(!bookId) {
        res.status(404);
        res.json('Code: 404');
        return;
    }

    client.get(bookId, (err, cnt) => {
        if(err) return res.status(500).json({error: 'Redis error'});

        res.json({
            cnt,
            message: `Counter for bookId=${bookId}, equal: ${cnt}`
        });
    });
});

app.post(`${COUNTER_API_URL}/:bookId/cnt`, (req, res) => {
    const { bookId } = req.params;

    if(!bookId) {
        res.status(404);
        res.json('Code: 404');
        return;
    }

    client.incr(bookId, (err, cnt) => {
        if(err) return res.status(500).json({error: 'Redis error'});

        res.json({
            cnt,
            message: `Counter for bookId=${bookId}, was increased and equal ${cnt}`
        });
    });
});

app.listen(PORT, () => {
    console.log(`Counter app is listening at http://localhost:${PORT}`)
});
