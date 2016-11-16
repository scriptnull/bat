'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({
      name: '1.2.1: Cannot exchange invalid API token'
    });

describe('Attempt to exchange invalid API token', function() {
  var shippable = null;
  this.timeout(0);

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('returns 404 with an invalid token', function(done) {
    shippable = new Shippable(nconf.get('apiEndpoint'), '123456');
    shippable.getAccountIds(function(err, ids) {
      assert.notEqual(err, null);
      done();
    });
  });
});
