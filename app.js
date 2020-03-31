const express = require("express");
const app = new express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true,  useNewUrlParser: true })
const articleSchema = {
  title : String,
  content : String
}
const Article = mongoose.model ("Article", articleSchema)

//////////////////////REST API Methods ///////////////////////////////////////////////
app.route("/articles")

.get(function (req,res) {
  Article.find(function (err, foundArticles) {
    if(!err) {
      res.send(foundArticles)
    }
    else {
      res.send(err)
    }
  });
})

.post(function (req,res) {
const newArticle = new Article ( {
  title: req.body.title,
  content: req.body.content
});
newArticle.save(function (err) {
  if (!err) {
  res.send ("Response is successful, record added successfully")
  }
  else {
    res.send (err)
  }
})
})

.delete(function(req,res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Successfully Deleted all reocrds")
    }
    else {
      res.send(err)
    }
  })
})
////////////////////////////////////////Request Targeting to a specific article/////////////////////////////

app.route("/articles/:articleTitle")

.get(function (req,res) {
  Article.findOne({title:req.params.articleTitle}, function (err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle)
    }
    else {
      res.send("No Articles found")
    }
  });
})

.put(function (req,res) {
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    {overwrite: true},
    function(err, updateArticle) {
      if (updateArticle) {
        res.send("Record updated successfully")
      }
      else
      {
        res.send(err)
      }
    }
  )
})

.patch(function (req,res) {
  Article.update({title:req.params.articleTitle}, {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Record updated successfully")
      }
      else
      {
        res.send(err)
      }
    });
})


.delete(function (req,res) {
  Article.deleteOne({title:req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Record deleted successfully")
      }
      else
      {
        res.send(err)
      }
    });
})



app.listen(port, function () {
    console.log("Server is running");
})
