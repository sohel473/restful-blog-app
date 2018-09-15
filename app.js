const   bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        express             = require("express"),
        app                 = express();
        
        
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});


var Blog = mongoose.model("blog", blogSchema);

// Blog.create({
//         title: "Seoul, South Korea",
//         image: "https://images.unsplash.com/photo-1531632773197-f7f30f6089c1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=be88f29e13de178fa1e24d315117becb&auto=format&fit=crop&w=500&q=60",
//         body: "Night at Seoul *_*"
// });

//RESTFUL ROUTES

//INDEX ROUTES
app.get("/",function (req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTES
app.get("/blogs",function (req, res) {
    Blog.find({}, function (err, blogs) {
        if(err) {
                console.log(err);
        } else {
               res.render("index",{blogs: blogs}); 
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err){
                res.render("new");
        } else {
                res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id,function (err,foundBlog) {
        if(err){
                res.redirect("/blogs");
        } else {
                res.render("show",{blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err){
            res.redirect("/blogs/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err, deletedBlog) {
        if(err){
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("SERVER HAS STARTED........");
});