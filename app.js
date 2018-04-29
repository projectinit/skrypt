const express = require('express');
const app = express();
//const pgp = require('pg-promise')(/*options*/);
//const db = pgp('postgres://username:password@host:port/database');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('base', {title: 'Index'});
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'Hey', message: 'Home Page' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Profile', message: 'User Profile' });
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});