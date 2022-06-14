const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const appController = require("./controllers/appController");
const isAuth = require("./middleware/isAuth");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

// initialize app and db
const app = express();
connectDB();

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});

// styling 
app.use('/public', express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


// ============ Routes ============ //

// ------ index ------- //
app.get("/", appController.index_page);

// ------ auth ------- //
app.get("/auth", appController.auth);
// retrieve token
app.get("/redirect-url", appController.redirect_url);

// ------ dashboard ------- //
app.get("/dashboard", isAuth, appController.dashboard_get);

// // ------ logout ------- //
app.post("/logout", appController.logout_post);

app.listen(8000, console.log("Server running on port 8000"));