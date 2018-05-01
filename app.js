const express = require('express');
const app = express();
//const pgp = require('pg-promise')(/*options*/);
//const db = pgp('postgres://username:password@host:port/database');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', { title: 'User Home', username: 'Bob' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile', username: 'Bob' });
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});