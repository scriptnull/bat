'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '99.1.2: Delete shipaye2 account'});
var assert = require('assert');
var async = require('async');
var Shippable = require('../../../lib/shippable/shippable.js');

describe('99.1.2: Delete shipaye2 account',
  function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  it('Should delete shipaye2', function(done) {
    var shipaye2 = nconf.get('testAccounts:shipaye2');
    var id;
    var shipayeoneAccount;

    this.timeout(0);

    var shippable = new Shippable(nconf.get('apiEndpoint'), shipaye2.apiToken);

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
          shipayeoneAccount = account;
          next(err);
        });
      });
    }

    function deleteAccount(next) {
      shipayeoneAccount.deleteAccount(function(err, message) {
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
