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
  name: 'Test 2.1.2 Subscription Count matches Github Private Scope'
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

  it('checks if subscription count matches private github count',
    function (done) {
      var account = nconf.get('testAccounts:shipayeone');
      shippable = new Shippable(nconf.get('apiEndpoint'), account.apiToken);
      githubAdapter = new GithubAdapter(
        nconf.get('githubPrivateTokenForshipayeoneAccount'));
      logger.info('');
      var store = {};

      var flow = [
        getShippableSubscriptions,
        getGithubRepoOwners,
        getGithubOrgs,
        countSubscriptionByRepoOwner,
        countSubscriptionByGithubOrg
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

      function getGithubRepoOwners(next) {
        logger.info('Getting github repositories');
        githubAdapter.getAllRepositories(
          function (err, repos) {
            store.allRepos = _.uniq(
              repos,
              function (repo, key, a) {
                return repo.owner.login;
              });
            next(err);
          });
      }

      function getGithubOrgs(next) {
        logger.info('Getting github orgs');
        githubAdapter.getUserOrganizations(
          function (err, orgs) {
            store.githubOrgList = orgs;
            next(err);
          });
      }

      function countSubscriptionByRepoOwner(next) {
        logger.info('Counting repo owners');
        store.allRepos.forEach(
          function (repo) {
            var foundOwner = _.find(
              store.shippableSubscriptionList,
              function (shipSub) {
                return shipSub.orgName === repo.owner.login;
              });
            assert(foundOwner);
          });
        next();
      }

      function countSubscriptionByGithubOrg(next) {
        logger.info('Counting github orgs');
        store.shippableSubscriptionGithubOrgList = _.filter(
          store.shippableSubscriptionList,
          function (sub) {
            return sub.provider === 'github' && sub.isOrgSubscription;
          });
        store.githubOrgList.forEach(
          function (org) {
            var foundOrg = _.find(
              store.shippableSubscriptionGithubOrgList,
              function (shipSub) {
                return shipSub.orgName === org.login;
              });
            assert(foundOrg);
          });
        next();
      }
    });
});
