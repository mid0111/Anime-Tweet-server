// DB操作用の設定定義.

var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    host     : '127.0.0.1',
    user     : 'postgres',
    password : 'postgres',
    database : 'anime_tweet_test'
  },

  test: {
    host     : '127.0.0.1',
    user     : 'postgres',
    password : 'postgres',
    database : 'anime_tweet_test'
  },

  travisci: {
    host     : '127.0.0.1',
    user     : 'postgres',
    database : 'anime_tweet_test'
  },

  production: {
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  }
};

var  Bookshelf  = require('bookshelf');
exports.initialize = function() {
  if(Bookshelf.PG === undefined) {
    // Bookshelf初期化
    Bookshelf.PG = Bookshelf.initialize({
      client: 'pg',
      connection: {
        host     : config[env].host,
        user     : config[env].user,
        password : config[env].password,
        database : config[env].database,
        charset  : 'UTF8_GENERAL_CI'
      }
    });
  }
};
