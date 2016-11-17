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

  it('gets an account with a valid token', function(done) {
    shippable = new Shippable(config.apiToken);
    shippable.getAccounts('',
      function(err, accounts) {
        assert.equal(err, null);
        return done();
      }
    );
  });
});
