var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function(socket) {
    io.sockets.sockets[socket.id].emit('Hello', socket.id);
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    
    socket.on('control', function(msg) {
        var tmp=msg.split("=");
        io.sockets.sockets[tmp[0]].emit('control', tmp[1]+"="+tmp[2]+"="+tmp[3]);
    });
    
    socket.on('pongControl', function(msg) {
        var tmp=msg.split("=");
        console.log(tmp[1]+"="+tmp[2]+"="+tmp[3]+"="+tmp[4])
        io.sockets.sockets[tmp[0]].emit('pongControl', tmp[1]+"="+tmp[2]+"="+tmp[3]+"="+tmp[4]);
    });
});

module.exports = app;
