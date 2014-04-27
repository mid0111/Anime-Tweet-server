var chai      = require('chai');
var expect = chai.expect;

var app = require('../app');

var client = require('socket.io-client');

describe('socket接続', function() {

  it('socketに接続できること', function() {
    var socket = client.connect('http://localhost:3000');
  });

  it('socketに接続できること', function(done) {
    var socket = client.connect('http://localhost:3000');
    socket.on('tweet', function (data) {
      expect(data.userId).not.to.be.null;
      expect(data.message).not.to.be.null;
      done();
    });
  });

});
