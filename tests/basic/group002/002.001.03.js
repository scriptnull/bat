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
  name: 'Test 2.1.3 Subscription Count matches Bitbucket'
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

  it('checks if subscription count matches bitbucket count',
    function (done) {
      var account = nconf.get('testAccounts:shipayefive');
      shippable = new Shippable(nconf.get('apiEndpoint'), account.apiToken);
      bitbucketAdapter = new BitbucketAdapter(
        nconf.get('bitbucketTokenForshipayefiveAccount'));
      logger.info('');
      var store = {};

      var flow = [
        getShippableSubscriptions,
        getBitbucketRepos,
        countSubscriptionByBitbucketOrg
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

      function getBitbucketRepos(next) {
        logger.info('Getting bitbucket repositories');
        bitbucketAdapter.getVisibleRepositories(
          function (err, repos) {
            store.allRepos = _.uniq(
              repos,
              function (repo) {
                return repo.owner;
              });
            next(err);
          });
      }

      function countSubscriptionByBitbucketOrg(next) {
        logger.info('Counting bitbucket orgs');
        logger.info('all repos length:', store.allRepos.length);
        store.shippableSubscriptionBitbucketOrgList = _.filter(
          store.shippableSubscriptionList,
          function (sub) {
            return sub.provider === 'bitbucket';
          });
        store.allRepos.forEach(
          function (org) {
            logger.info(org.owner);
            var foundOrg = _.find(
              store.shippableSubscriptionBitbucketOrgList,
              function (shipSub) {
                return shipSub.orgName === org.owner;
              });
            assert(foundOrg);
          });
        next();
      }
    });
});
