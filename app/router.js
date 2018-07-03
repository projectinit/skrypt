const create = require('./routerfunctions/create')
const auth = require('./routerfunctions/auth')
const mongoose = require('mongoose');
const vars = require('../globalvars')
const userModel = require('./models/user')
const postModel = require('./models/post')
mongoose.connect(vars.monoguri)

module.exports = function(app) {
  // GET requests
  app.get('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    postModel.find({}, function(err, posts) {
      let nPosts = []
      posts.forEach(post => {
        userModel.findOne({
          "_id": post.author
        }, 'username', function (err, user) {
          if (user) post.author = user.username
          else post.author = "Deleted User"
          nPosts.push(post)
          console.log(nPosts)
        })
      });
      posts = nPosts
      if (auth.internalVerify(token)) res.render('home', { title: 'User Home', user: auth.getToken(token), posts: posts });
      else res.render('login')
    })
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

  app.get('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.redirect('/')
  })

  // POST Requests
  app.post('/new/user', create.user)

  app.post('/login', auth.login)

  app.post('/auth', auth.verify)

  app.post('/new/post', create.post)

  app.post('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    if (auth.internalVerify(token)) res.render('home', {
      title: 'User Home',
      user: auth.getToken(token)
    });
    else res.render('login')
  });
}