const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');


let indexRouter = require('./routes/index');
let playerRouter = require('./routes/player');

let app = express();


app.use(session({
    secret: ']Vm<)%EQ%O;HzZ9',
    resave: false,
    saveUninitialized: true
}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));


app.use('/', indexRouter);
app.use('/player/', playerRouter);

process.on('exit', function () {
    console.log('About to exit.');
});

module.exports = app;
