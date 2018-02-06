const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//bbdd
const { dbUrl } = require('./config');
mongoose.connect(dbUrl).then(() => console.log('db running'));
//routes
const index = require('./routes/index');
const users = require('./routes/users');
const signup = require('./routes/signup');
const login = require('./routes/login');
const tweets = require('./routes/tweetsController');

// const authController     = require("./routes/authController");
const profileController  = require("./routes/profileController");

const passportConfig = require('./passport')
const isLogged = require('./middlewares/isLogged');
const timelineController = require("./routes/timelineController");
//app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//config cookies
app.use(session ({
  secret: 'twitter-clone',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection, 
    ttl: 24 * 60 * 60
  })
}));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport config
passportConfig(app);

//locale
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.title = 'Twitter clone';
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/signup', signup);
app.use('/login', login);
app.use('/tweets', tweets);
app.use('/tweets', timelineController);
app.use("/profile", profileController);


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
