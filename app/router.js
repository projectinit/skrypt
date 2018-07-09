const create = require('./routerfunctions/create')
const auth = require('./routerfunctions/auth')
const mod = require('./routerfunctions/mod')
const mongoose = require('mongoose');
const vars = require('../globalvars')
const userModel = require('./models/user')
const postModel = require('./models/post')
mongoose.connect(vars.monoguri)
const redis = require('redis')
const redisClient = redis.createClient(vars.redisPort, vars.redisIP)
module.exports = function (app) {
  // GET requests
  app.get('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    if (auth.internalVerify(token)) {
      redisClient.get('globalPosts', function (err, reply) {
        if (reply) {
          const replyObject = JSON.parse(reply)
          res.render('home', {
            title: 'User Home',
            user: auth.getToken(token),
            posts: replyObject
          });
        } else {
          postModel.find({}, null, { sort :{ timePosted : -1}}, function (err, posts) {
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
      })
    }
    else res.redirect('/login')

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
    if (auth.internalVerify(token)) res.redirect(`/profile/${user.id}`)
    else res.render('login')
  });

  app.get('/profile/:id', (req, res) => {
    const id = req.params.id
    userModel.findOne({
      "_id": id
    }, 'id email username', function (err, user) {
      if (user) {
        postModel.find({
          "author": id
        }, null, { sort :{ timePosted : -1}}, function (err, posts) {
          if (err) throw err
          if (posts.length > 0) {
            let newPosts = []
            posts.forEach(post => {
              userModel.findOne({
                "_id": post.author
              }, "username id", function (err, user) {
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
      } else res.send("<h1>Cannot find user</h1>")
    })
  })

  app.get('/user/:id', (req, res) => {
    const id = req.params.id
    userModel.findOne({"_id": id}, 'id username fullname bio blurb picture', function (err, user) {
      if (user) {
        res.json({status:"success", user: user})
      }
    })
  })

  app.get('/user/:id/posts', (req, res) => {
    const id = req.params.id
    userModel.findOne({"_id": id}, 'id email username', function (err, user) {
      if (user) {
        postModel.find({"author":id}, null, { sort :{ timePosted : -1}}, function (err, posts) {
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
                if (newPosts.length === posts.length) res.json({status: "success", user: user, posts: newPosts});
                else console.log(newPosts)
              })
            })
          } else res.json({status: "success", user: user, posts: []});
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
          res.json({status: "success", post: newPost});
        })
      }
      else res.send("<h1>Cannot find post</h1>")
    })
  })

  app.get('/logout', (req, res) => {
    res.cookie("token", "", {expires: new Date(0)});
    res.redirect('/')
  })

  app.get('/feed', (req, res) => {
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
            if (newPosts.length === posts.length) res.json({status: "success", posts: newPosts})
            else console.log(newPosts)
          })
        })
      } else res.json({status: "fail"})
    })
  })

  app.get('/post/:id/like', mod.like)

  // POST Requests
  app.post('/user/new', create.user)

  app.post('/login', auth.login)

  app.post('/auth', auth.verify)

  app.post('/post/new', create.post)

  app.post('/', (req, res) => {
    //console.log(req.cookies)
    const token = req.cookies.token
    if (auth.internalVerify(token)) res.render('home', {
      title: 'User Home',
      user: auth.getToken(token)
    });
    else res.render('login')
  });

  app.post('/workplace/new', create.workspace)

  app.all('/*', (req, res) => {
    res.json({error:"Function not available"})
  })
}