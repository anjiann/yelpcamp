
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

var User        = require("./models/user")
   
var campgroundRoutes = require("./routes/campgrounds"),  
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index")

var seedDB      = require("./seeds")
// seedDB();

mongoose.connect("mongodb+srv://anjian:yelpcampdemo@cluster0.kap0r.gcp.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
app.set("view engine", "ejs")

// ======== passport configuration =========
app.use(require("express-session")({
    secret: "Imma get a dog real soon",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

const port = 3000;
app.listen(port, function() {
    console.log("yelpcamp server has started");
})