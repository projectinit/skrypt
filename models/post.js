var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var postSchema = Schema({
    author: { type: String, required: true },
    timePosted: { type: Date, required: true },
    parent: { type: ObjectId },
    title: { type: String },
    content: { type: String },
    likes: { type: [ObjectId] },
    comments: { type: [ObjectId] }
});

module.exports = mongoose.model('Post', postSchema);