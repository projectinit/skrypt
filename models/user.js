var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    posts: { type: [ObjectId] },
    fullname: { type: String },
    bio: { type: String },
    blurb: { type: String },
    picture: { type: String },
    workplaces: { type: [ObjectId] },
    connections: { type: [ObjectId] }
});

module.exports = mongoose.model('User', userSchema);