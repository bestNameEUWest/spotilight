const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');


let indexRouter = require('./routes/index');

let app = express();


app.use(session({
    secret: ']Vm<)%EQ%O;HzZ9',
    resave: false,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));


app.use('/', indexRouter);

module.exports = app;
