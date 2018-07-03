var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var postSchema = Schema({
    author: { type: ObjectId, required: true },
    timePosted: { type: Date, default: Date.now },
    parent: { type: ObjectId },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    likes: { type: [ObjectId] },
    comments: { type: [ObjectId] }
});

module.exports = mongoose.model('Post', postSchema);