const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const app =express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema={
  title:String,
  content:String
};

const Article = mongoose.model("article",articleSchema);
//
// const newArticle= new Article({
// name: "bootstrap",
// content:"好用的網站套件"
// })
// newArticle.save()

 // Article.findByIdAndRemove("625ecdcd788444fa21f28abe",function(err){
 //   if(err){
 //     console.log(err)
 //   }else{
 //     console.log("deleted")
 //   }
 // })

app.route("/articles")

.get(function(req,res){

  Article.find({},function(err,results){
    if(err){
      res.send(err);
    }else{
      res.send(results);
    }
  })
})

.post(function(req,res){

const newArticle= new Article ({
  title:req.body.title,
  content:req.body.content
})
newArticle.save(function(err){
  if(!err){
  res.send("successfully added article");
}else{
  res.send(err);
}
});
})

.delete(function(req,res){

 Article.deleteMany({},function(err){
   if(!err){
     res.send("Successfully deleted all articles");
   }else{
  res.send(err);
   }
 });
});

//////////////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,articleFound){
    if(articleFound){
      res.send(articleFound)
    }else{
      res.send("No article that matching that title was found")
    }
  })
})

.put(function(req,res){
  Article.replaceOne(
  {title:req.params.articleTitle},
  {title:req.body.title , content:req.body.content},
  function(err){
    if(!err){
      res.send("Successfully updated article")
    }else{
      res.send(err)
    }
    }
  )
})

.patch(function(req,res){

  Article.updateOne(
  {title:req.params.articleTitle},
  {$set :req.body},
  function(err){
  if(!err){
    res.send("Update completed ")
  }else{
    res.send(err)
  }
  }
  )
})

.delete(function(req,res){

Article.deleteOne({title:req.params.articleTitle},function(err){
  if(!err){
    res.send("Successfully deleted")
  }else{
    res.send(err)
  }
})
});












app.listen(3000,function(){
  console.log("Server successfully started at port 3000 ");
});
