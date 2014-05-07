// DB操作用の設定定義.
var  Bookshelf  = require('bookshelf');

exports.initialize = function() {
  if(Bookshelf.PG === undefined) {
    // Bookshelf初期化
    Bookshelf.PG = Bookshelf.initialize({
      client: 'pg',
      connection: {
        host     : '127.0.0.1',
        user     : 'postgres',
        password : 'postgres',
        database : 'anime_tweet_test',
        charset  : 'UTF8_GENERAL_CI'
      }
    });
  }
};
