var mongoose = require("mongoose");

var articleSchema = mongoose.Schema({
    title:String,
    link:String,
    summary:String
})

module.exports = mongoose.model("Article",articleSchema)
