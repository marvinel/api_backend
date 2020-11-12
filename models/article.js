'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

module.exports = moongose.model('Article',ArticleSchema);
// 
