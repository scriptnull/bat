'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '1.1.7: all accounts are saved on the testAccounts nconf object'});
var chai = require('chai');
var assert = chai.assert;

describe('1.1.7: all accounts are saved on the testAccounts nconf object', function() {

  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  this.timeout(0);

  var apiEndpoint = nconf.get(apiEndpoint);

  it('Should have shipayeone in testAccounts', function(done) {
    logger.info('Checking for test accounts on the testAccounts nconf object');
    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert.property(nconf.get('testAccounts'), 'shipayeone');
    assert.equal(shipayeone.account.identities[0].userName, 'shipayeone');
    assert.equal(shipayeone.providerToken, '143a61ab39d2c3275a2142395743f61f1019ba97');
    done();
  });

  it('Should have shipaye2 in testAccounts', function(done) {
    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert.property(nconf.get('testAccounts'), 'shipaye2');
    assert.equal(shipaye2.account.identities[0].userName, 'shipaye2');
    assert.equal(shipaye2.providerToken, '51d84e38717b2a18d4755f98b6f1b62eab433952');
    done();
  });

  it('Should have shipaye3 in testAccounts', function(done) {
    var shipaye3 = nconf.get('testAccounts:shipaye3');
    assert.property(nconf.get('testAccounts'), 'shipaye3');
    assert.equal(shipaye3.account.identities[0].userName, 'shipaye3');
    assert.equal(shipaye3.providerToken, 'f048922848f32e55daf389ed37afd46b187d2d6a');
    done();
  });

  it('Should have shipaye4 in testAccounts', function(done) {
    var shipaye4 = nconf.get('testAccounts:shipaye4');
    assert.property(nconf.get('testAccounts'), 'shipaye4');
    assert.equal(shipaye4.account.identities[0].userName, 'shipaye4');
    assert.equal(shipaye4.providerToken, 'fa0407127c3f6d396346778ba27a5bfd113853d4');
    done();
  });

  it('Should have shipayefive in testAccounts', function(done) {
    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert.property(nconf.get('testAccounts'), 'shipayefive');
    assert.equal(shipayefive.account.identities[0].userName, 'shipayefive');
    done();
  });

  it('Should have shipaye6 in testAccounts', function(done) {
    var shipaye6 = nconf.get('testAccounts:shipaye6');
    assert.property(nconf.get('testAccounts'), 'shipaye6');
    assert.equal(shipaye6.account.identities[0].userName, 'shipaye6');
    done();
  });

});
