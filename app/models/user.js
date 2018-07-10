var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   , ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    // we can make password unique because its salted
    password: { type: String, required: true, unique: true },
    posts: [ {type: ObjectId, ref: 'Post'} ],
    fullname: { type: String, default: "" },
    bio: { type: String, default: "" },
    blurb: { type: String, default: "" },
    picture: { type: String, default: "" },
    workplaces: [ {type: ObjectId, ref: 'Workplace'} ],
    connections: [ {type: ObjectId, ref: 'User'} ]
});

module.exports = mongoose.model('User', userSchema);