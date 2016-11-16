'use strict';
var mocha = require('mocha');
var bunyan = require('bunyan');
var nconf = require('nconf');
var assert = require('assert');
var async = require('async');
var _ = require('underscore');
var BitbucketAdapter = require('../../../lib/shippable/BitbucketAdapter.js');
var Shippable = require('../../../lib/shippable/shippable.js');
var logger = bunyan.createLogger({
  name: 'Test 2.2.3 Subscription Owner is Owner on Bitbucket'
});

describe('GET /subscriptions API', function () {
  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();
  var shippable = null;
  var bitbucketAdapter = null;
  this.timeout(0);

  it('Test 002.002.01: Checks if subscription count matches bitbucket count',
    function (done) {
      var account = nconf.get('testAccounts:shipayefive');
      shippable = new Shippable(nconf.get('apiEndpoint'), account.apiToken);
      bitbucketAdapter = new BitbucketAdapter(account.providerToken);

      logger.info('');
      var store = {};

      var flow = [
        getShippableSubscriptions,
        getBitbucketUser,
        getBitbucketMemberships,
        getSubscriptionPermissions,
        checkSubscriptionByBitbucketAccount,
        checkOrgSubscriptionByBitbucketMembership
        ];

      async.series(flow,
        function (err) {
          assert.equal(err, null);
          done();
        });

      function getShippableSubscriptions(next) {
        logger.info('Getting shippable subscirptions');
        shippable.getSubscriptions(
          function (err, subs) {
            store.shippableSubscriptionList = subs;
            next(err);
          });
      }

      function getBitbucketUser(next) {
        logger.info('Getting bitbucket user');
        bitbucketAdapter.getUser(null,
          function (err, user) {
            store.bitbucketUser = user;
            next(err);
          });
      }

      function getBitbucketMemberships(next) {
        logger.info('Getting bitbucket memberships');
        bitbucketAdapter.getPrivileges(
          function (err, memberships) {
            store.bitbucketMembershipList = memberships;
            next(err);
          });
      }

      function getSubscriptionPermissions(next) {
        logger.info('Getting subscription permissions');
        shippable.getSubscriptionPermissions(
          function (err, subPermissions) {
            store.subscriptionPermissions = subPermissions;
            if (store.subscriptionPermissions) {

              store.currentSubscription =
                _.find(store.shippableSubscriptionList, function(sub) {
                  return sub.orgName === store.bitbucketUser.username;
                });

              store.subscriptionPermissions.forEach(
                function (subPerm) {
                  if (subPerm.subscriptionId === store.currentSubscription.id &&
                    subPerm.roles.indexOf('owner') !== -1) {
                      store.currentSubscription.isOwner = true;
                  }
                });
            }
            next(err);
          });
      }

      function checkSubscriptionByBitbucketAccount(next) {
        logger.info('Checking user subscription');
        var filteredSubs = _.filter(store.shippableSubscriptionList,
          function (sub) {
            return sub.provider ===
              'bitbucket' && sub.id ===
                store.currentSubscription.id &&
                  store.currentSubscription.isOwner && !sub.isOrgSubscription;
          });
        assert.strictEqual(filteredSubs.length, 1);
        filteredSubs.forEach(
          function (sub) {
            assert.strictEqual(store.bitbucketUser.username, sub.orgName);
          });
        next();
      }

      function checkOrgSubscriptionByBitbucketMembership(next) {
        logger.info('Cross checking subscription ownership with ' +
          'bitbucket membership');
        store.shippableSubscriptionBitbucketOwnerList = _.filter(
          store.shippableSubscriptionList,
          function (sub) {
            return sub.provider ===
              'bitbucket' && sub.id ===
                store.currentSubscription.id &&
                  store.currentSubscription.isOwner && sub.isOrgSubscription;
          });
        store.shippableSubscriptionBitbucketOwnerList.forEach(
          function (sub) {
            assert(store.bitbucketMembershipList.teams[sub.orgName]);
            assert.strictEqual(
              store.bitbucketMembershipList.teams[sub.orgName], 'admin');
          });
        next();
      }
    });
});
