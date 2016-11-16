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

  it('returns 404 with an invalid token', function(done) {
    shippable = new Shippable(nconf.get('apiEndpoint'), '123456');
    shippable.getAccountIds(function(err, ids) {
        assert.notEqual(err, null);
        done();
    });
  });
});
