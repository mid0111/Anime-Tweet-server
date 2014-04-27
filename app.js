/**
 * Anime-tweet-server.
 */
var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    config = require('./config/config'),
    routes = require('./routes');

var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

require('./config/express')(app, config);

// routes
app.get('/', routes.index);

server.listen(config.port);

// socket open
io.sockets.on('connection', function (socket) {
  var data = {
    userId: 'user0001',
    message: 'hello'
  };
  socket.emit('tweet', data);
});
