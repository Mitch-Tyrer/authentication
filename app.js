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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//+============
//ROUTES
//=============


app.get("/", function(req, res){
    res.render("home");
});
// User login required page
app.get("/secret", isLoggedIn, function(req, res){
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

// Login ROutes
//render login form

app.get("/login", function(req, res) {
    res.render("login");
});

//login logic
//middleware  --  code that runs before final route callback.
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

// Logout Route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running");
});