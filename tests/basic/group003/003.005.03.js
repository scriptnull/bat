'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    BitbucketAdapter = require('../../../lib/shippable/BitbucketAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.5.3: Count Org Repos' });

describe('Test Case 3.5.3: Using Bitbucket token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var bitbucketAdapter = null;
  store.validOrgSubscriptions = [];
  store.validIndividualSubscriptions = [];

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of org repos', function(done) {

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);

    bitbucketAdapter = new BitbucketAdapter(shipayefive.providerToken);

    async.series([
      getOrgsListFromShippable.bind(null, store),
      getProjectsForEachOrg.bind(null, store),
      getOrgsListFromBitbucket.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      done();
    });

    function getOrgsListFromShippable(store, next) {
      logger.info('Getting Orgs list from Shippable');
      shippable.getSubscriptions(function (err, subscriptions) {
        assert.equal(err, null);
        store.subscriptions = subscriptions;
        next();
      });
    }

    function getProjectsForEachOrg(store, next) {
      logger.info('Getting list of projects for each org');
      async.eachSeries(store.subscriptions, function (subscription, nextSub){
        if(subscription.isOrgSubscription) {
          store.validOrgSubscriptions.push(subscription);
        } else {
          store.validIndividualSubscriptions.push(subscription);
        }
        subscription.getProjects(function(err, projects){
          assert.equal(err, null);
          subscription.projects = projects;
          nextSub();
        });
      }, function (){
        next();
      });
    }

    function getOrgsListFromBitbucket (store, next) {
      logger.info('Getting list of projects from Bitbucket');
      bitbucketAdapter.getDashboardRepositories(
        function (err, subscriptionAndRepos) {
        assert.equal(err, null);
        if (!subscriptionAndRepos || !Array.isArray(subscriptionAndRepos)) {
          return next();
        }
        subscriptionAndRepos.forEach(function (subscriptionAndRepo) {
          // Each element in the array returned by Bitbucket is another array,
          // where the first element is the owner (subscription) of the repos
          // listed in the second element.
          if (!Array.isArray(subscriptionAndRepo) ||
              !subscriptionAndRepo[0] || !subscriptionAndRepo[1] ||
              !Array.isArray(subscriptionAndRepo[1])) {
            // Make sure that it is an owner and a list of repos for that owner.
            return;
          }
          subscriptionAndRepo[1].forEach(function (repo) {
            if (!repo || !repo.slug) return;
            if (repo.scm && repo.scm !== 'git') {
              // Currently we support only git. 
              // Exclude Mercurial Repos
              return;
            }
          });
          store.subscriptions.forEach(function (subscription) {
            if(subscription.orgName === subscriptionAndRepo[0].username) {
              assert.equal(subscription.projects.length,
               subscriptionAndRepo[1].length);
            }
          });
        });
        next();
      });
    }
  });
});
