// grab the packages for article model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// article schema
var ArticleSchema = new Schema({
    title: String,
    article_body: String,
    owner_id: String  
});

// return the model
module.exports = mongoose.model('Article', ArticleSchema);