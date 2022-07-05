const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const appController = require("./controllers/appController");
const userController = require("./controllers/userController");
const orderController = require("./controllers/orderController");
const allergyController = require("./controllers/allergyController");
const conditionController = require("./controllers/conditionController");
const immunizationController = require("./controllers/immunizationController");

const isAuth = require("./middleware/isAuth");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");


// initialize app and db
const app = express();
connectDB();

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "meditech",
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

// session & cookies
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 3600000 * 24,
    }
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
app.get("/dashboard", isAuth, userController.dashboard_get);

// ------ immunizations ------- //
app.get("/immunizations", isAuth, immunizationController.immunizations_get);

// ------ immunization ------- //
app.get("/immunization/:id", isAuth, immunizationController.immunization_get);

// ------ conditions ------- //
app.get("/conditions", isAuth, conditionController.conditions_get);

// ------ condition ------- //
app.get("/condition/:id", isAuth, conditionController.condition_get);

// ------ orders ------- //
app.get("/orders", isAuth, orderController.orders_get);

// ------ order ------- //
app.get("/order/:id", isAuth, orderController.order_get);

// ------ allergies ------- //
app.get("/allergies", isAuth, allergyController.allergies_get);

// ------ allergy ------- //
app.get("/allergy/:id", isAuth, allergyController.allergy_get);

// // ------ logout ------- //
app.post("/logout", appController.logout_post);

app.listen(8000, console.log("Server running on port 8000"));