const express = require('express');
const app = express();
var port = process.env.PORT || 3000;
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

app.listen(port, () => {
    console.log('listening on port 3000');
});
