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
  name: 'Test 2.3.3 Subscription Collaborator is Collaborator Bitbucket'
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

  it('Test 002.003.03: checks if subscription count matches bitbucket count',
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

      function getSubscriptionPermissions(next){
        logger.info('Getting subscription permissions');
        shippable.getSubscriptionPermissions(
          function(err, subPermissions){
            store.subscriptionPermissions = subPermissions;
            if(store.subscriptionPermissions){
              store.currentSubscription =
                _.find(store.shippableSubscriptionList, function(sub){
                    return sub.orgName === store.bitbucketUser.username;
              });

              store.collaboratorSubList = [];
              store.subscriptionPermissions.forEach(
                function(subPerm){
                  if (subPerm.subscriptionId !== store.currentSubscription.id &&
                    (!_.contains(subPerm.roles, 'owner') &&
                      _.contains(subPerm.roles, 'collaborator'))) {
                        store.collaboratorSubList.push(subPerm.subscriptionId);
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

            var isCollaborator = _.some (store.collaboratorSubList,
              function (subId) {
                return sub.id === subId;
              });

            return sub.provider === 'bitbucket' &&
              sub.id !== store.currentSubscription.id &&
                !sub.isOrgSubscription &&
                  isCollaborator;
          });
        filteredSubs.forEach(
          function (sub) {
            assert.notStrictEqual(store.bitbucketUser.login, sub.orgName);
          });
        next();
      }

      function checkOrgSubscriptionByBitbucketMembership(next) {
        logger.info('Cross checking subscription collaboration with' +
        ' bitbucket membership');
        store.shippableSubscriptionBitbucketMemberList = _.filter(
          store.shippableSubscriptionList,
          function (sub) {
            var isCollaborator = _.some (store.collaboratorSubList,
              function (subId) {
                return sub.id === subId;
              });

            return sub.provider === 'bitbucket' &&
              sub.id !== store.currentSubscription.id &&
                sub.isOrgSubscription &&
                  isCollaborator;
          });
        store.shippableSubscriptionBitbucketMemberList.forEach(
          function (sub) {
            if (store.bitbucketMembershipList.teams[sub.orgName])
              assert.strictEqual(
                store.bitbucketMembershipList.teams[sub.orgName],
                'collaborator');
          });
        next();
      }
    });
});
