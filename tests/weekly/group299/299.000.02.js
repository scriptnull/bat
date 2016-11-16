'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '299.000.02: Delete shipayefive account'});
var assert = require('assert');
var async = require('async');
var Shippable = require('../../../lib/shippable/shippable.js');

describe('299.000.02: Delete shipayefive account',
  function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  this.timeout(0);

  it('Should delete shipayefive', function(done) {
    var shipayefive = nconf.get('testAccounts:shipayefive');
    var id;
    var shipayefiveAccount;

    var shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);

    async.series([
      getAccount,
      deleteAccount,
      getDeletedAccount
    ], function(err) {
      assert.equal(err, 404);
      done();
    });

    function getAccount(next) {
      shippable.getAccountIds(function (err, accountIds) {
        if (err) throw new Error('Error getting account id: ' + err);
        id = accountIds[0];
        shippable.getAccount(id, function(err, account) {
          if (err) throw new Error('Error getting account: ' + err);
          shipayefiveAccount = account;
          next(err);
        });
      });
    }

    function deleteAccount(next) {
      shipayefiveAccount.deleteAccount(function(err, message) {
        logger.info('Deleting account');
        assert.equal(err, null);
        assert.equal(message, 'Deleted ' + id);
        next(err);
      });
    }

    function getDeletedAccount(next) {
      shippable.getAccount(id, function(err, res) {
        logger.info('Trying to get a deleted account');
        assert.equal(err, 404);
        next(err);
      });
    }

  });
});
