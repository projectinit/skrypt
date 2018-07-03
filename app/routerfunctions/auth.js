const mongoose = require('mongoose');
const vars = require('../../globalvars')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
mongoose.connect(vars.monoguri)
exports.login = function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;
  userModel.findOne({"email":email}, 'password', function(err, user) {
    if (err) console.log(err);
    bcrypt.compare(pass, user.password, function (err, resd) {
      if (resd) {
        res.json({status:"success"})
      } else {
        res.status(401).json({status:"fail"})
      }
    });
  })
}