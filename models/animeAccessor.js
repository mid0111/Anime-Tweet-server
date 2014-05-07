var Log = console.log;

// DB初期化.
require('../config/db').initialize();

var Bookshelf = require('bookshelf').PG;

// Model定義
var model = Bookshelf.Model.extend({
  tableName: 'anime'
});

// Collection定義
var collection = Bookshelf.Collection.extend({
    model: model
});

var AnimeAccessor = function() {
  // 指定されたModelのレコードを登録する.
  this.create = function(json, success, error) {
    new model({
      aria: json.aria,
      titles: json.titles
    }).save()
      .then(function() {
        if ( typeof success == 'function' ) {
          success();
        }
      })
      .catch(function(err) {
        Log('Failed to create data.');
        Log('reason: [' + err.clientError.name + ':' + err.clientError.message + ']');
        if ( typeof error == 'function' ) {
          error(err);
        }
      }) ;
  };

  // 指定されたariaに一致するレコードを1件検索する.
  this.searchOneFromAria = function(aria, callback) {
    collection.forge()
      .query({where: {aria: aria}})
      .fetchOne()
      .then(function(model) {
        if ( typeof callback == 'function' ) {
          if(model == null) {
            callback(model);
          } else {
            callback(model.toJSON());
          }
        }
      });
  };

  // 指定されたariaに一致するレコードを1件削除する.
  this.deleteFromAria = function(aria, callback) {
    collection.forge()
      .query({where: {aria: aria}})
      .fetchOne()
      .then(function(model) {
        if(model == null) {
          callback();
        } else {
          model.destroy()
            .then(function() {
              if ( typeof callback == 'function' ) {
                callback();
              }
            });
        }
      });
  };

};

module.exports = AnimeAccessor;
