const mongoose = require('mongoose');
const vars = require('../../globalvars')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
mongoose.connect(vars.monoguri)

exports.login = function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;
  userModel.findOne({"email":email}, 'password email _id username', function(err, user) {
    if (err) console.log(err);
    bcrypt.compare(pass, user.password, function (err, resd) {
      if (resd) {
        const buf = Buffer.from(vars.privkey.exportKey('private'), 'utf8');
        const token = jwt.sign({
          id: user.id,
          email: email,
          username: user.username
        }, buf, { algorithm: 'RS256' })
        res.cookie("token", token)
        if (req.headers['content-type'] === "application/x-www-form-urlencoded") res.redirect('/')
        else res.json({status:"success", token: token})
      } else {
        if (req.headers['content-type'] === "application/x-www-form-urlencoded") res.redirect('/')
        else res.status(401).json({status:"fail"})
      }
    });
  })
};

exports.verify = function(req, res) {
  const buf = Buffer.from(vars.pubkey.exportKey('public'), 'utf8');
  let token = jwt.verify(req.body.token, buf)
  if (token) res.json({status: "success", user: token})
  else res.json({
    status: "fail"
  })
};

exports.internalVerify = function(token) {
  const buf = Buffer.from(vars.pubkey.exportKey('public'), 'utf8');
  var ttoken = null
  if (token) ttoken = jwt.verify(token, buf)
  if (ttoken) return true
  else return false
}

exports.getToken = function(token) {
  var ttoken = null
  if (token) ttoken = jwt.decode(token)
  if (ttoken) return ttoken
  else return {}
}