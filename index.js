const mongoose = require('mongoose');
const express = require('express');
const vars = require('./globalvars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = vars.port;
const redis = require('redis')
const app = express()

// DB Check
mongoose.connect(vars.monoguri)
.then(res => {
	console.log('Successfully connected to the database '+vars.monoguri);
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
app.use('/api', require('./app/apirouter'))
app.use(require('./app/router'))

app.listen(port, () => {
    console.log('listening on port ' + port);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});