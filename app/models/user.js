var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    // we can make password unique because its salted
    password: { type: String, required: true, unique: true },
    posts: { type: [ObjectId] },
    fullname: { type: String, default: "" },
    bio: { type: String, default: "" },
    blurb: { type: String, default: "" },
    picture: { type: String, default: "" },
    workplaces: { type: [ObjectId] },
    connections: { type: [ObjectId] }
});

module.exports = mongoose.model('User', userSchema);