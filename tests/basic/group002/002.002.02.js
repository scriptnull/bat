'use strict';
var mocha = require('mocha');
var bunyan = require('bunyan');
var nconf = require('nconf');
var assert = require('assert');
var async = require('async');
var _ = require('underscore');
var GithubAdapter = require('../../../lib/shippable/GithubAdapter.js');
var Shippable = require('../../../lib/shippable/shippable.js');
var logger = bunyan.createLogger({
  name: 'Test 2.2.2 Subscription Owner is Owner Github Private Scope'
});

describe('GET /subscriptions API', function () {
  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();
  var shippable = null;
  var githubAdapter = null;
  this.timeout(0);

  it('Test 002.002.02: checks if subscription count matches' +
    ' private github count',
    function (done) {
      var account = nconf.get('testAccounts:shipayeone');
      shippable = new Shippable(nconf.get('apiEndpoint'), account.apiToken);
      githubAdapter = new GithubAdapter(
        nconf.get('githubPrivateTokenForshipayeoneAccount'));
      logger.info('');
      var store = {};

      var flow = [
        getShippableSubscriptions,
        getGithubUser,
        getGithubMemberships,
        getSubscriptionPermissions,
        checkSubscriptionByGithubAccount,
        checkOrgSubscriptionByGithubMembership
        ];

      async.series(flow,
        function (err) {
          assert.equal(err, null);
          done();
        });

      function getShippableSubscriptions(next) {
        logger.info('Getting shippable subscriptions');
        shippable.getSubscriptions(
          function (err, subs) {
            store.shippableSubscriptionList = subs;
            next(err);
          });
      }

      function getGithubUser(next) {
        logger.info('Getting github user');
        githubAdapter.getUser(null,
          function (err, user) {
            store.githubUser = user;
            next(err);
          });
      }

      function getGithubMemberships(next) {
        logger.info('Getting github memberships');
        githubAdapter.getMemberships(
          function (err, memberships) {
            store.githubMembershipList = memberships;
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
                  return sub.orgName === store.githubUser.login;
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

      function checkSubscriptionByGithubAccount(next) {
        logger.info('Checking user subscription');

        var filteredSubs = _.filter(store.shippableSubscriptionList,
          function (sub) {
            return sub.provider ===
              'github' && sub.id ===
                store.currentSubscription.id &&
                  store.currentSubscription.isOwner && !sub.isOrgSubscription;
          });
        assert.strictEqual(filteredSubs.length, 1);
        filteredSubs.forEach(
          function (sub) {
            assert.strictEqual(store.githubUser.login, sub.orgName);
          });
        next();
      }

      function checkOrgSubscriptionByGithubMembership(next) {
        logger.info('Cross checking subscription ownership ' +
          ' with github membership');
        store.shippableSubscriptionGithubOwnerList = _.filter(
          store.shippableSubscriptionList,
          function (sub) {
            return sub.provider ===
              'github' && sub.id ===
                store.currentSubscription.id &&
                  store.currentSubscription.isOwner && sub.isOrgSubscription;
          });
        store.shippableSubscriptionGithubOwnerList.forEach(
          function (sub) {
            var foundOrg = _.find(store.githubMembershipList,
              function (githubSub) {
                return githubSub.organization.login === sub.orgName;
              });
            assert(foundOrg);
            assert.strictEqual(foundOrg.role, 'admin');
          });
        next();
      }
    });
});
