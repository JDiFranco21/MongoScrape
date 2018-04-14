var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var Article = require("./articleModel")

var app = express()
var port = 3000

mongoose.connect("mongodb://newuser:newuser123@ds153198.mlab.com:53198/newsscraper")

app.engine("handlebars",expressHandlebars({defualtLayout:"main"}));
app.set("view engine","handlebars")

var myObject = {
    name: "Joe",
    favoriteColor: "Blue"
}

app.get("/",function(req,res){
    res.send("this is the root");
})

app.get("/test",function(request,response){
    response.send(myObject);
})

//scraper route - scrapes and saves articles to mongoDB
app.get("/scraper",function(req,res){
    request("https://www.nytimes.com",function(error,response,html){
        var $ = cheerio.load(html)
        var array = []
        $(".story-heading").each(function(){
            var title = $(this).children("a").text();
            var link = $(this).children("a").attr("href");
            var summary = $(this).siblings("p").text();
            if(title && link && summary){
                array.push({title:title,link:link,summary:summary});
                var article = new Article({title:title,link:link,summary:summary});

                article.save()
            }
        })

        res.send(array)
    })
})

//gets all articles from mongoDB
app.get("/all-articles",function(request,response){
    Article.find()
    .exec()
    .then(function(doc){
        response.send(doc)
    })

})

//clears all articles from MongoDB
app.get("/delete",function(req,res){
    Article.remove({})
    .exec()
    .then(function(doc){
        res.send(doc)
    }).catch(function(error){
        res.send(error);
    })
})

//loads data from databse into handlebars
app.get("/all-handlebars",function(req,res){
    Article.find()
    .exec()
    .then(function(doc){
        res.render("allarticles",{article:doc})
    })
})

app.listen(port,function(){
    console.log("app is listening on http://localhost:" + port)
})
