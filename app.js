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

//
// Twitterストリーミング
//
var twit = require('./config/twitter');

// Twitter検索条件
// TODO: Anime map apiから取得した値に変更（現状は仮で固定値を指定）
var tracks = 'node, express, mocha, google';

io.sockets.on('connection', function (socket) {
  console.log('socket connected.');
  // Twitterストリーム作成
  var twitStream = twit.stream('statuses/filter', {'track': tracks}, function(stream) {
    stream.on('data', function (data) {
      console.log('tweets: ' + JSON.stringify(data));
      var twitterMessage = {
        userId: data.user.name,
        message: data.text
      };
      socket.emit('tweet', twitterMessage);
    });
  });
  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });
});

