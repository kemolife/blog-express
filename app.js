var http = require("http");
var express = require('express');
var passport = require("passport");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var config = require("./app/config/config");
var session = require("express-session");
var flash = require("connect-flash");
var routes = require('./routes/routes');
var expressController = require("express-controller");
// configuration
mongoose.connect(config.database);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// =================================================
//                 Authentication
// =================================================


// // post auth
// app.post('/login', passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true }), function(req, res) {
//     if (req.body.remember) {
//         req.session.cookie.maxAge = 1000 * 60 * 3;
//     } else {
//         req.session.cookie.expires = false;
//     }
//     res.redirect("/admin");
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//load controller
expressController
    .setDirectory(__dirname + '/app/controllers')
    .bind(app);

var port = '3000';
http.createServer(app).listen(port).listen(function() {
    console.log('Now running at localhost:'+port);
});
