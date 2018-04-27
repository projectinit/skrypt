const express = require('express');
const app = express();
//const pgp = require('pg-promise')(/*options*/);
//const db = pgp('postgres://username:password@host:port/database');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello SKRYPT!');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});