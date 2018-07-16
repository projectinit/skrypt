const create = require('./routerfunctions/create')
const auth = require('./routerfunctions/auth')
const mod = require('./routerfunctions/mod')
const mongoose = require('mongoose');
const vars = require('../globalvars')
const userModel = require('./models/user')
const postModel = require('./models/post')
mongoose.connect(vars.monoguri)
const redis = require('redis')
const multer = require('multer');
const express = require('express');
const app = express.Router();
const upload = multer()

app.all('/', (req,res)=> {
  res.json({name:"Skrypt API",version:"v0.0.1-firstrun"})
  console.log(vars.privkey.exportKey('private') + "\n\n" + vars.pubkey.exportKey('public'))
})

app.get('/user/:id', (req, res) => {
  const id = req.params.id
  userModel.findOne({
    "_id": id
  }, 'username _id picture fullname bio blurb').exec((err, user) => {
    if (user) res.json({
      status: "success",
      user: user
    })
    else res.json({
      status: "fail",
      error: "cannot find user"
    })
  })
})

app.get('/user/:id/posts', (req, res) => {
  const id = req.params.id
  userModel.findOne({
    "_id": id
  }, 'id email username posts').populate({
    path: 'posts',
    populate: {
      path: 'author',
      select: 'username _id picture fullname'
    }
  }).exec((err, user) => {
    if (user) res.json({
      status: "success",
      user: user
    })
    else res.json({
      status: "fail",
      error: "cannot find user"
    })
  })
})

app.get('/post/:id', (req, res) => {
  const id = req.params.id
  postModel.findOne({
    "_id": id
  }).populate({
    path: 'author',
    select: 'username _id picture fullname'
  }).populate({
    path: 'likes',
    select: 'username _id picture fullname'
  }).exec((err, post) => {
    if (post) {
      res.json({
        status: "success",
        post: post
      });
    } else res.json({status: "fail",error: "Cannot find post"})
  })
})

app.get('/feed', (req, res) => {
  postModel.find({}, function (err, posts) {
    if (err) throw err
    if (posts.length > 0) {
      let newPosts = []
      posts.forEach(post => {
        userModel.findOne({
          "_id": post.author
        }, "username _id fullname", function (err, user) {
          let newPost = {
            id: post.id,
            author: user,
            content: post.content,
            likes: post.likes,
            title: post.title,
            timePosted: post.timePosted
          }
          newPosts.push(newPost)
          if (newPosts.length === posts.length) res.json({
            status: "success",
            posts: newPosts
          })
        })
      })
    } else res.json({
      status: "fail", error: "No posts"
    })
  })
})

app.get('/post/:id/like', mod.like)

// POST Requests
app.post('/user/new', create.user)

app.post('/login', auth.login)

app.post('/auth', auth.verify)

app.post('/post/new', create.post)

app.post('/me/edit', mod.edituser)

app.post('/workplace/new', create.workspace)

app.post('/filetest', upload.single('avatar'), function (req, res, next) {
  const token = req.cookies.token || req.body.token
  if (token && auth.internalVerify(token)) {
    const base64 = req.file.buffer.toString('base64')
    const user = auth.getToken(token);
    userModel.updateOne({
          "_id": user.id
        }, {"picture": "data:image/png;base64, "+base64}, (err, raw) => {
      res.json({"status":"success"})
    })
  }
});

// Default Route
app.all('/*', (req, res) => {
  res.status(405).render('405', {
    url: req.originalUrl
  })
})

module.exports = app