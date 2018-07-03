const mongoose = require('mongoose');
const express = require('express');
const vars = require('./globalvars')
const router = require('./app/router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000;
const app = express()
// DB Check
mongoose.connect(vars.monoguri)
.then(res => {
	console.log('Successfully connected to the database!');
})
.catch(err => {
	console.log(err);
    console.log('Cannot connect to the database!')
    console.log(vars.monoguri)
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
router(app)

app.listen(port, () => {
    console.log('listening on port 3000');
});
