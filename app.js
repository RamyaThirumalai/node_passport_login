const express = require("express");
const expresslayouts = require("express-ejs-layouts")
const mongoose = require('mongoose')
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/key').mongoURI;

//connect to mongodb
mongoose
  .connect(
    db,
    { useNewUrlParser: true , useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//EJS
app.use(expresslayouts);
app.set('view engine', 'ejs')

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Express body parser
app.use(express.urlencoded({ extended: true }));


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));


//COonnecting to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running on Port ${PORT}`));