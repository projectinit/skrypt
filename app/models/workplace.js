var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   , ObjectId = Schema.Types.ObjectId;

var workplaceSchema = Schema({
    name: { type: String, required: true },
    description: { type: String },
    picture: { type: String },
    location: { type: String },
    geolocation: { type: [Number] },
    employees: [ {type: ObjectId, ref: 'User'} ]
});

module.exports = mongoose.model('Workplace', workplaceSchema);