'use strict';
var mocha = require('mocha'),
    Shippable = require('../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert');

describe('GET /accounts API', function() {
  var shippable = null;
  this.timeout(0);
  before(function() {
    nconf.argv().env();
  });

  it('gets an account with a valid token', function(done) {
    shippable = new Shippable(nconf.get('apiEndpoint'), nconf.get('apiToken'));
    shippable.getAccountIds(function(err, ids) {
      assert.equal(err, null);
      done();
    });
  });
});
