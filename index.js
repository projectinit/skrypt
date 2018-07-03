'use strict';


const mongoose = require('mongoose');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

var port = process.env.PORT || 3000;
var mongoose = require('mongoose');

// DB Check
mongoose.connect('mongodb://skrypt_db:27017')
.then(res => {
	console.log('Successfully connected to the database!');
})
.catch(err => {
	console.log(err);
	console.log('Cannot connect to the database!')
});

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
