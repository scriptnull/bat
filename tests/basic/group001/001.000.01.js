'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '1.0.1: Creating the testAccounts object'});
var chai = require('chai');
var assert = chai.assert;

describe('1.0.1: Creating the testAccounts object', function() {

  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  var apiEndpoint = nconf.get(apiEndpoint);

  it('Should create an empty testAccounts object', function(done) {
    nconf.set('testAccounts', {});
    logger.info('Creating an empty testAccounts object');
    assert.notProperty(nconf.get('testAccounts'), 'shipayeone');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye2');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye3');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye4');
    assert.notProperty(nconf.get('testAccounts'), 'shipayefive');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye6');

    done();
  });

});
