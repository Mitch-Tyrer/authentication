var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");
    
    

mongoose.connect("mongodb://localhost:27017/auth_demo_app", { useNewUrlParser: true });    

app.use(require("express-session")({
    secret: "I Love Cara Gilman",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//+============
//ROUTES
//=============


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

//Auth Routes

//show sign up form
app.get("/register", function(req, res) {
   res.render("register"); 
});

//Handling user signup
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
           console.log(err); 
           return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running");
});