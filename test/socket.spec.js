var chai      = require('chai');
var expect = chai.expect;

var app = require('../app');
var client = require('socket.io-client');


describe('socket接続', function() {

  it('socketに接続できること', function() {
    var socket = client.connect('http://anime-tweet.herokuapp.com:32722');
  });

});
