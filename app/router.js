const create = require('./routerfunctions/create')
const auth = require('./routerfunctions/auth')
const mongoose = require('mongoose');
const vars = require('../globalvars')
const userModel = require('./models/user')
mongoose.connect(vars.monoguri)

module.exports = function(app) {
  app.get('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    if (auth.internalVerify(token)) res.render('home', { title: 'User Home', user: auth.getToken(token) });
    else res.render('login')
  });
  
  app.get('/login', (req, res) => {
    res.render('login')
  });

  app.get('/me', (req, res) => {
    const token = req.cookies.token
    if (auth.internalVerify(token)) res.render('profile', { title: 'Home', user: auth.getToken(token) });
    else res.render('login')
  });

  app.get('/user/:id', (req,res) => {
    const id = req.params.id
    userModel.findOne({"_id":id}, 'id email username', function(err, user) {
      if (user) res.render('profile', { title: 'User Profile', user: user });
      else res.send("<h1>Cannot find user</h1>")
    })
  })

  app.post('/new/user', create.user)

  app.post('/login', auth.login)

  app.post('/auth', auth.verify)
}