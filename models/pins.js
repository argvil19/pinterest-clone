var mongoose = require('mongoose');

var pinSchema = {
    name:String,
    imgURL:String,
    author:String
}

module.exports = mongoose.model('Pin', pinSchema, 'pins');