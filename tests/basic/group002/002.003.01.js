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
  name: 'Test 2.3.1 Subscription Collaborator is Collaborator Github Public ' +
  'Scope'
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

  it('checks if user is collaborator of their public github subscriptions',
    function (done) {
      var account = nconf.get('testAccounts:shipaye2');
      shippable = new Shippable(nconf.get('apiEndpoint'), account.apiToken);
      githubAdapter = new GithubAdapter(
        nconf.get('githubPublicTokenForshipaye2Account'));
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

      function getSubscriptionPermissions(next){
        logger.info('Getting subscriptions permissions');
        shippable.getSubscriptionPermissions(
          function(err, subPermissions){
            store.subscriptionPermissions = subPermissions;
            if (store.subscriptionPermissions) {
              store.currentSubscription =
                _.find(store.shippableSubscriptionList, function(sub){
                  return sub.orgName === store.githubUser.login;
                });

              store.collaboratorSubList = [];
              store.subscriptionPermissions.forEach(
                function (subPerm){
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

      function checkSubscriptionByGithubAccount(next) {
        logger.info('Checking user subscription');

        var filteredSubs = _.filter(store.shippableSubscriptionList,
          function (sub) {

            var isCollaborator = _.some (store.collaboratorSubList,
              function (subId) {
                return sub.id === subId;
              });

            return sub.provider === 'github' &&
              sub.id !== store.currentSubscription.id &&
                !sub.isOrgSubscription &&
                  isCollaborator;
          });

        filteredSubs.forEach(
          function (sub) {
            assert.notStrictEqual(store.githubUser.login, sub.orgName);
          });
        next();
      }

      function checkOrgSubscriptionByGithubMembership(next) {
        logger.info('Cross checking subscription collaboration with github ' +
        'membership');
        store.shippableSubscriptionGithubMemberList = _.filter(
          store.shippableSubscriptionList, function (sub) {

            var isCollaborator = _.some (store.collaboratorSubList,
              function (subId) {
                return sub.id === subId;
              });

            return sub.provider === 'github' &&
              sub.id !== store.currentSubscription.id &&
                sub.isOrgSubscription &&
                  isCollaborator;
          });
        store.shippableSubscriptionGithubMemberList.forEach(
          function (sub) {
            var foundOrg = _.find(store.githubMembershipList,
              function (githubSub) {
                return githubSub.organization.login === sub.orgName;
              });
            assert(foundOrg);
            assert.strictEqual(foundOrg.role, 'member');
          });
        next();
      }
    });
});
