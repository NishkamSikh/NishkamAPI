require("dotenv").config();
const cors = require("cors");
var express = require('express');
var bodyParser = require('body-parser')
const fileupload = require("express-fileupload");
const db = require('./db')
var path = require('path');
var logger = require('morgan');
const session = require('express-session'); //for using sessions
const flash = require('express-flash'); //for displaying flash messages
var app = express();
var index = require('./routes/index');
var nodemailer = require('nodemailer');
const passport = require('passport'); //for authentication
const initializePassport = require('./passportConfig');

initializePassport(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',

  resave: false,

  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(fileupload());

app.use(cors());
  
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


// set path for static assets
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {status:err.status, message:err.message});
});





module.exports = app;
