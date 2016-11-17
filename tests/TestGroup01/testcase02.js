'use strict';
var mocha = require('mocha'),
    Shippable = require('../../_common/shippable/Adapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    start = require('../../test.js');

describe('GET /accounts API', function() {
  var shippable = null;
  this.timeout(0);
  before(function() {
    start = new start();
    nconf.argv().env();
  });

  it('returns 401 with an invalid token', function(done) {
    shippable = new Shippable('123456');
    shippable.getAccounts('',
      function(err, accounts) {
        assert.notEqual(err, null);
        return done();
      }
    );
  });
});
