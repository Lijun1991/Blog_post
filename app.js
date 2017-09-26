var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");

app.use(bodyParser.urlencoded({extended: true}));
//serve custom style-sheet
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


//MOGOOSE/MODLE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({title: "mongoose moudle create", 
//             image: "https://blog.evernote.com/in/files/2016/05/Travel-Blog.jpg",
//             body: "how to ues mongoose to create content and save in db"
//         }, function(err, blog1){
//             if (err){
//                 console.log(err);
//             }else {
//                 console.log("first blog created and save to mongodb");
//             }
//         })

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlog){
        if (err){
            console.log(err);
        }else{
            res.render("index", {allBlog: allBlog});
        }
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new");
})

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newCreated){
        if (err){
            // console.log(err);
            res.render("new");
        }else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTES
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, found){
        if (err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: found});
        }
    })
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

app.listen(7000, function(){
    console.log("BLOG POST has started");
})
