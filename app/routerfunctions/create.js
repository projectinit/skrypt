const mongoose = require('mongoose');
const vars = require('../../globalvars')
const auth = require('./auth')
mongoose.connect(vars.monoguri)
exports.user = function (req, res) {
  const userModel = require('../models/user')
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
        else res.json({status: "success"})
      });
  })
  console.log(req.body)
}

exports.post = function(req,res) {
  const postModel = require('../models/post')
  const content = req.body.content
  let token = req.cookies.token || req.body.token
  if (token && auth.internalVerify(token)) {
    const user = auth.getToken(token)
    console.log(user)
    const post = new postModel({author: user.id, content: content })
    post.save(function(err, post) {
      if (err) throw err
      else res.json({status:"success"})
    })
  }
}