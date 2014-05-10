/**
 * Anime-tweet-server.
 */
var express = require('express'),
    http = require('http'),
    config = require('./config/config'),
    routes = require('./routes'),
    fs = require('fs');

var app = express();

require('./config/express')(app, config);

// routes
app.get('/', routes.index);

var server = http.createServer(app),
    io = require('socket.io').listen(server),
    // heroku 用に環境変数からポートを読み込む
    port = (process.env.PORT || config.port);

server.listen(port);
console.log('port: ' + port);

// Twitter検索条件
// TODO ユーザの地域に基づいて検索条件を取得する
//     ※現状は、固定値
var titles = '';
var AnimeAccessor = require('./accessor/animeAccessor');
var accessor = new AnimeAccessor;
console.log('search condition for twitter stream');
accessor.searchOneFromAria('Saitama', function(model) {
  titles = model.titles;
  console.log('titles: ' + titles);
  //
  // Twitterストリーミング
  //
  var twitter = require('ntwitter');
  if(fs.existsSync('./config/twitter.js')) {
    var tweet = require('./config/twitter');
  }
  var twit = new twitter({
    consumer_key: (process.env.TWITTER_API_KEY || tweet.consumer_key),
    consumer_secret: (process.env.TWITTER_API_SECRET || tweet.consumer_secret),
    access_token_key: (process.env.TWITTER_ACCESS_TOKEN || tweet.access_token_key),
    access_token_secret: (process.env.TWITTER_ACCESS_TOKEN_SECRET || tweet.access_token_secret)
  });
  console.log('configuration of twitter: ' + twit);
  
  io.sockets.on('connection', function (socket) {
    console.log('socket connected.');
    // Twitterストリーム作成
    var twitStream = twit.stream('statuses/filter', {'track': titles}, function(stream) {
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
      console.log('user disconnected.');
      io.sockets.emit('user disconnected');
    });
    socket.on('close', function () {
      console.log('user disconnected.');
      io.sockets.emit('user disconnected');
    });
  });
});
