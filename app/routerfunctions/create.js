const mongoose = require('mongoose');
const vars = require('../../globalvars')
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