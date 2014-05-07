var chai      = require('chai');
var expect = chai.expect;
var db = require('../config/db');

var AnimeAccessor = require('../accessor/animeAccessor');

describe('AnimeAccessor', function() {
  beforeEach(function(done) {
    var accessor = new AnimeAccessor;
    accessor.create({
      aria: "Shizuoka",
      titles: "nodejs, node, express"
    }, done);
  });

  afterEach(function(done) {
    var accessor = new AnimeAccessor;
    accessor.deleteFromAria('Shizuoka', done);
  });

  it('ariaを指定してデータを取得できること', function(done) {
    var accessor = new AnimeAccessor;

    accessor.searchOneFromAria('Shizuoka', function(model) {
      expect(model).not.to.be.empty;
      expect(model.titles).is.equal('nodejs, node, express');
      expect(model.aria).is.equal('Shizuoka');
      expect(model.id).not.to.be.empty;
      done();
    });
  });

  it('存在しないariaを指定して検索を実行した場合nullになること', function(done) {
    var accessor = new AnimeAccessor;

    accessor.searchOneFromAria('Hawaii', function(model) {
      expect(model).to.be.null;
      done();
    });
  });

  it('データを保存できること', function(done) {
    var accessor = new AnimeAccessor;

    var aria = 'Tokyo';
    var titles = 'nodejs, node, express, google';

    accessor.create({
      aria: aria,
      titles: titles
    }, function() {
      accessor.searchOneFromAria(aria, function(model) {
        expect(model).not.to.be.empty;
        expect(model.titles).is.equal(titles);
        expect(model.aria).is.equal(aria);
        expect(model.id).not.to.be.empty;
        accessor.deleteFromAria(aria, done);
      });
    });
  });

  it('ariaが重複したデータがすでに存在する場合データ保存に失敗すること', function(done) {
    var accessor = new AnimeAccessor;

    var aria = 'Shizuoka';
    var titles = 'nodejs, node, express, google';

    accessor.create({
      aria: aria,
      titles: titles
    }, null, function(err) {
      done();
    });

  });

  it('存在しないデータを削除しようとした場合正常終了すること', function(done) {
    var accessor = new AnimeAccessor;
    accessor.deleteFromAria('Hawaii', done);
  });

});

