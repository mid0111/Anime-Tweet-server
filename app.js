/**
 * Anime-tweet-server.
 */
var express = require('express'),
    http = require('http'),
    config = require('./config/config'),
    routes = require('./routes');

var app = express();

require('./config/express')(app, config);

// routes
app.get('/', routes.index);

var server = http.createServer(app),
    io = require('socket.io').listen(server),
    port = (process.env.PORT || config.port);
server.listen(port);

console.log('port: ' + port);

// Twitter検索条件
// TODO タイトル取得処理は直接Httpリクエスト投げないで、バッチとかで実行する
//     ※現状は、初回起動時のみHttpリクエスト（しかも非同期）でタイトル取得
var titles = '';
var options = {
  host: 'animemap.net',
  path: '/api/table/tokyo.json'
};
http.request(options, function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var items = JSON.parse(str).response.item;

    for (var i = 0 ; i < items.length ; i++) {
      var item = items[i];
      var title = item.title;
      if(title === 'undefined') {
        continue;
      } else if(titles !== null && titles.length != 0) {
        titles += ', ';
      }
      titles += title;
    }
  });
}).end();

//
// Twitterストリーミング
//
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
  
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
});

