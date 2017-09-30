var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var listings = require('./routes/listings');
var terms = require('./routes/terms');
var feedback = require('./routes/feedback');
var feedbackconfirm = require('./routes/feedback-confirm');

var config = require('./bin/config');
var depts = require('./bin/departments');
var cas = require('./bin/cas');
var session = require('express-session')
var ua = require('universal-analytics');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
//app.use('/users', users);
//app.use('/cas', cas);
//app.use('/listings', listings);
app.use('/terms', terms);
app.use('/feedback', feedback);
app.use('/feedback/confirm', feedbackconfirm);

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: config.cookieduration,
  }
}));

var user = "";
var auth = cas(config.host, config.port);
app.use(ua.middleware("UA-63178606-6", {cookieName: '_ga'}));

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) return next(err)
    auth.logout;
    res.redirect('/');
  });
});

app.get('/users', auth.bounce, users);

app.get('/listings', auth.bounce, listings);

app.get('/admin', auth.bounce, function(req, res){
  res.redirect('/admin/database');
});

app.get('/admin/:page', auth.bounce, admin);

app.post('/listings/removeFavorite/:listingid', listings);

app.post('/listings/addFavorite/:listingid', listings);

// letsencrypt ssl certificate confirmation
app.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send('_Vz9KLmSfZNgaOvmV2SP29dF3UYbRqnxs4u6zuA9nRs.eQwz2bF_dTl8qE6neOOeozqWGRcP-4Jiolfu9-s9xtA')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
