const mongoose = require('mongoose');
const vars = require('../../globalvars')
const auth = require('./auth')
mongoose.connect(vars.monoguri)
const userModel = require('../models/user')
const postModel = require('../models/post')
const workspaceModel = require('../models/workplace')

// TODO: CLEANUP LIKES CODE
exports.like = function(req, res) {
  let token = req.cookies.token || req.body.token
  const id = req.params.id
  if (token && auth.internalVerify(token)) {
    const user = auth.getToken(token)
    postModel.findOne({"_id": id}, function (err, post) {
      if (err) throw err
      if (post) {
        userModel.findOne({"_id": post.author}, "username id", function (err, user) {
          if (err) throw err
          let likes = post.likes || []
          if (!likes.includes(user.id)) likes.push(user.id)
          else likes.splice(likes.indexOf(user.id), 1)
          console.log(likes)
          postModel.updateOne({"_id": id}, {likes: likes},  function(err, out) {
            if (err) throw err
            res.json({status: "success", post: out});
          })
        })
      }
      else res.send("<h1>Cannot find post</h1>")
    })
  } else {
    res.json({status: "fail"})
  }
}

exports.edituser = (req, res) => {
  let token = req.cookies.token || req.body.token
  const id = req.params.id
  if (token && auth.internalVerify(token)) {
    const user = auth.getToken(token)
    userModel.updateOne({_id: user.id}, {email: req.body.email, username: req.body.username, fullname: req.body.fullname}, (err, out) => {
      if (err) {
        console.log(req.headers)
        res.redirect('/me/edit')
      }
      else {
        res.redirect('/me/edit')
      }
      console.log(out)
    })
  }
}