const mongoose = require('mongoose');
const vars = require('../../globalvars')
const auth = require('./auth')
mongoose.connect(vars.monoguri)
const userModel = require('../models/user')
const postModel = require('../models/post')
const workspaceModel = require('../models/workplace')
exports.user = function (req, res) {
  var bcrypt = require('bcrypt');
  const saltRounds = 10;
  const pass = req.body.password
  const email = req.body.email
  const username = req.body.username
  bcrypt.hash(pass, saltRounds, function (err, hash) {
    const user = new userModel({
      email: email,
      username: username,
      password: hash,
    })
      user.save(function (err, user) {
        if (err) return console.error(err);
        else {
          if (req.headers['content-type'] === "application/x-www-form-urlencoded") res.redirect('/')
          else res.json({status:"success"})
        }
      });
  })
}

exports.post = function(req,res) {
  const content = req.body.content
  let token = req.cookies.token || req.body.token
  if (token && auth.internalVerify(token)) {
    const user = auth.getToken(token)
    console.log(user)
    const post = new postModel({author: user.id, content: content })
    post.save(function(err, post) {
      if (err) throw err
      else res.json({status:"success"})
      userModel.findOne({"_id":user.id}, function(err, user2) {
        if (err) throw err
        let posts = user2.posts
        posts.push(post._id)
        userModel.updateOne({"_id":user.id}, {posts: posts}, function(err, out) {
          if (err) throw err
        })
      })
    })
  } else {
    res.json({status: "fail"})
  }
}

exports.workspace = function (req,res) {
  let token = req.cookies.token || req.body.token
  const user = auth.getToken(token)
  if (token && auth.internalVerify(token)) {
    const workspaceObj = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      employees: (req.body.isEmployee === "true") ? [user.id] : []
    }
    const workspace = new workspaceModel(workspaceObj)
    workspace.save(function (err, workspace) {
      if (err) throw err
      else res.json({status: "success"})
      if (req.body.isEmployee === "true") {
        userModel.findOne({"_id":user.id}, function(err, user2) {
          if (err) throw err
          let workspaces = user2.workplaces
          workspaces.push(workspace._id)
          userModel.updateOne({"_id":user.id}, {workplaces: workspaces}, function(err, out) {
            if (err) throw err
          })
        })
      }
    })
  } else res.json({status: "fail"})
}