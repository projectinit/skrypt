var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var profileSchema = new Schema({
    fullname: { type: String },
    bio: { type: String },
    blurb: { type: String },
    picture: { type: String },
    workplaces: { type: [ObjectId] }
});

var userSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    profile: profileSchema,
    posts: { type: [ObjectId] },
    connections: { type: [ObjectId] }
});

module.exports = mongoose.model('User', userSchema);