var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose"),
    Category = require("./models/category"),
    Post = require("./models/post");
    
//require routes
var categoryRoutes = require("./routes/categories"),
    authRoutes     = require("./routes/index"),
    postRoutes     = require("./routes/posts");
    
//APP CONFIG
    
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

//connect to db
var promise = mongoose.connect("mongodb://localhost/sharelyfe_db", {
    useMongoClient: true
});
promise.then();
// use routes
app.use("/categories",categoryRoutes);
app.use("/categories/:id/posts", postRoutes);
app.use(authRoutes);

//put in some data
var newPost = new Post({
    title: 'Water Skis',
    image: 'awesome image',
    description: 'you should buy this',
    price: '$100'
})

newPost.save();

Category.findOne({name: 'Recreation'}, function(err, foundCategory) {
    if (err) {
        console.log(err);
    } else {
        foundCategory.posts.push(newPost);
        foundCategory.save();
    }
});




//set up server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server is listening");
});