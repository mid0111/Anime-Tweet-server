
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    config = require('./config/config'),
    routes = require('./routes');
  // , http = require('http')
  // , path = require('path');

var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

require('./config/express')(app, config);

// routes
app.get('/', routes.index);

server.listen(config.port);
