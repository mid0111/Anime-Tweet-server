var chai      = require('chai');
var expect = chai.expect;


var client = require('socket.io-client');

describe('socket', function() {

  // describe('socket接続', function() {
  //   it('socketに接続できること', function() {
  //     var socket = client.connect('http://localhost:3000');
  //     socket.emit('disconnect', null);
  //   });
  // });

  describe('socketデータ送信', function() {
    var socket;

    before(function(done) {
      socket = client.connect('http://localhost:3000');
      done();
    });

    after(function() {
      socket.emit('disconnect', null);
    });

    it('期待する形式でsocketからデータを受信できること', function(done) {

      socket.on('tweet', function (data) {
        expect(data.userId).not.to.be.null;
        expect(data.message).not.to.be.null;
        done();
      });
    });
  });
});
