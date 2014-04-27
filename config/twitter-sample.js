// twitter settings
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'xxx',
  consumer_secret: 'yyy',
  access_token_key: 'zzz',
  access_token_secret: 'www'
});

module.exports = twit;

