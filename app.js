
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

const db = "mongodb+srv://anjian:anjian@cluster0.kap0r.mongodb.net/yelpcamp?retryWrites=true&w=majority"
// const db = "mongodb://localhost:27017/yelp_camp"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err));
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})