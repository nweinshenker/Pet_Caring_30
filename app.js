// const sql_query = require('./sql');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var request = require('request');

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

const app = express();

/* --- V7: Using dotenv     --- */
require('dotenv').config();

// Body Parser Config
app.use(bodyParser.urlencoded({
  extended: false
}));

// Authentication Setup
//require('dotenv').load();
require('./auth').init(app);
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())


// View Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/////////////mine
app.use(flash());



// Router Setup
require('./routes').init(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



















// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var bcrypt = require('bcrypt');

// var flash = require('connect-flash');
// var passport = require('passport');
// var request = require('request');
// var session = require('express-session');



// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// // var loginRouter = require('./routes/login')

// //////////////
// var signupOwnerRouter = require('./routes/signupOwner');
// var loginRouter = require('./routes/login');
// var logoutRouter = require('./routes/logout');

// ///////
// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// const expressSession = require('express-session');
// app.use(expressSession({secret: 'mySecretKey'}));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(session({secret: 'keyboard cat'}))

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// // app.use('/login', loginRouter);
// app.use('/users', usersRouter);

// /////////////////
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/signupOwner', signupOwnerRouter);

// app.use('/login',loginRouter);
// app.use('/logout',logoutRouter);
// ////////////////



// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
