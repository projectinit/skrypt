var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.Types.ObjectId;

var postSchema = Schema({
    author: { type: ObjectId, required: true, ref: 'User' },
    timePosted: { type: Date, default: Date.now },
    parent: { type: ObjectId },
    title: { type: String, trim: true },
    content: { type: String, trim: true , required: true},
    likes: [ {type: ObjectId, ref: 'User'} ],
    comments: [ {type: ObjectId, ref: 'Post'} ]
});

module.exports = mongoose.model('Post', postSchema);