const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const bearerToken = require("express-bearer-token");
const jwt = require("jsonwebtoken");
require("./config/env.js");


// set port to the environment variable settings or 3001 if none exist
const port = process.env.PORT || 3001;

// connect to db using environment variables
let databaseConnectionString = `mongodb://${process.env.DB_USERNAME}:${
  process.env.DB_PASSWORD
}@`;

/* istanbul ignore else  */
if (process.env.NODE_ENV === 'test') {
  databaseConnectionString += `${process.env.DB_TEST_URI}`;
} else if (process.env.NODE_ENV === 'development'){
  // development
  databaseConnectionString += `${process.env.DB_DEV_URI}`;
} else {
  // production
  databaseConnectionString += `${process.env.DB_URI}`;
}

mongoose.Promise = global.Promise;

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  family: 4,  
  keepAlive: 1, 
  connectTimeoutMS: 30000
};

mongoose.connect(
  databaseConnectionString,
  dbOptions
);

// instantiate express app
const app = express();
const router = express.Router();

// middleware that accepts urlencoded form data
// https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({ extended: true }));

// middleware that accepts json
// https://github.com/expressjs/body-parser#bodyparserjsonoptions
app.use(bodyParser.json());

// extracts bearer token from request
// https://github.com/tkellen/js-express-bearer-token
app.use(bearerToken());

// instantiate passport
app.use(passport.initialize());

// set passport login and signup strategies
const localSignupStrategy = require("./passport/local-signup");
const localLoginStrategy = require("./passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

// set cross origin resource sharing (CORS) policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Authorization, Origin, Accept, X-Requested-With, Content-Type, X-Access-Token"
  );
  res.header("Cache-Control", "no-cache");
  next();
});

// static info routes
require("./routes/static.js")(router);

// authentication routes
require("./routes/auth.js")(router, passport);

// reset password routes
require("./routes/reset.js")(router);

// user routes
require("./routes/users.js")(router, passport);

// lab routes
require("./routes/labs.js")(router);

// container routes
require("./routes/containers.js")(router);

// virtual routes
require("./routes/virtuals.js")(router);

// physical routes
require("./routes/physicals.js")(router);

app.use('/api/v1', router);

// launch server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

module.exports = app;
