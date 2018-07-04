const create = require('./routerfunctions/create')
const auth = require('./routerfunctions/auth')
const mongoose = require('mongoose');
const vars = require('../globalvars')
const userModel = require('./models/user')
const postModel = require('./models/post')
mongoose.connect(vars.monoguri)

module.exports = function (app) {
  // GET requests
  app.get('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    if (auth.internalVerify(token)) {
      postModel.find({}, function (err, posts) {
        if (posts.length > 0) {
          let newPosts = []
          posts.forEach(post => {
            userModel.findOne({"_id": post.author}, "username id", function (err, user) {
              let newPost = {
                id: post.id,
                author: user,
                content: post.content,
                likes: post.likes,
                title: post.title,
                timePosted: post.timePosted
              }
              newPosts.push(newPost)
              if (newPosts.length === posts.length) res.render('home', {
                title: 'User Home',
                user: auth.getToken(token),
                posts: newPosts
              });
              else console.log(newPosts)
            })
          })
        } else res.render('home', {
          title: 'User Home',
          user: auth.getToken(token),
          posts: []
        });
      })
    }
    else res.render('login')

  });

  app.get('/login', (req, res) => {
    const token = req.cookies.token
    if (!auth.internalVerify(token)) res.render('login')
    else res.redirect('/')
  });

  app.get('/register', (req, res) => {
    const token = req.cookies.token
    if (!auth.internalVerify(token)) res.render('register')
    else res.redirect('/')
  })

  app.get('/me', (req, res) => {
    const token = req.cookies.token
    let user = auth.getToken(token)
    if (auth.internalVerify(token)) res.redirect(`/user/${user.id}`)
    else res.render('login')
  });

  app.get('/user/:id', (req, res) => {
    const id = req.params.id
    userModel.findOne({"_id": id}, 'id email username', function (err, user) {
      if (user) {
        postModel.find({"author":id}, function (err, posts) {
          if (err) throw err
          if (posts.length > 0) {
            let newPosts = []
            posts.forEach(post => {
              userModel.findOne({"_id": post.author}, "username id", function (err, user) {
                let newPost = {
                  id: post.id,
                  author: user,
                  content: post.content,
                  likes: post.likes,
                  title: post.title,
                  timePosted: post.timePosted
                }
                newPosts.push(newPost)
                if (newPosts.length === posts.length) res.render('profile', {
                  title: 'User Profile',
                  user: user,
                  posts: newPosts
                });
                else console.log(newPosts)
              })
            })
          } else res.render('profile', {
            title: 'User Profile',
            user: user,
            posts: []
          });
        })
      }
      else res.send("<h1>Cannot find user</h1>")
    })
  })

  app.get('/post/:id', (req, res) => {
    const id = req.params.id
    postModel.findOne({"_id": id}, function (err, post) {
      if (post) {
        userModel.findOne({"_id": post.author}, "username id", function (err, user) {
          let newPost = {
            id: post.id,
            author: user,
            content: post.content,
            likes: post.likes,
            title: post.title,
            timePosted: post.timePosted
          }
          res.render('partials/post', {post: newPost});
        })
      }
      else res.send("<h1>Cannot find post</h1>")
    })
  })

  app.get('/logout', (req, res) => {
    res.cookie("token", "", {expires: new Date(0)});
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

  app.post('/new/workspace', create.workspace)

  app.all('/*', (req, res) => {
    res.json({error:"Function not available"})
  })
}