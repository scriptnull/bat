'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '299.000.03: All accounts are deleted from the testAccounts nconf object'});
var chai = require('chai');
var assert = chai.assert;

describe('299.000.03: All accounts are deleted from the testAccounts nconf object', function() {

  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();
  it('Should deleted all acounts from the testAccounts object', function(done) {
    nconf.set('testAccounts', {});

    assert.notProperty(nconf.get('testAccounts'), 'shipayeone');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye2');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye3');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye4');
    assert.notProperty(nconf.get('testAccounts'), 'shipayefive');
    assert.notProperty(nconf.get('testAccounts'), 'shipaye6');

    done();
  });

});
