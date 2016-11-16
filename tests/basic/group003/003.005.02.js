'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.5.2: Count Org Repos' });

describe('Test Case 3.5.2: Using Github Private token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.validOrgSubscriptions = [];
  store.validIndividualSubscriptions = [];

  nconf.argv().env().file({ 
    file: '../../../config', 
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of org repos', function(done) {

    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);
    githubAdapter = new GithubAdapter(shipayeone.providerToken);

    async.series([
      getOrgsListFromShippable.bind(null, store),
      getProjectsForEachOrg.bind(null, store),
      getOrgsListFromGithub.bind(null, store),
      getProjectsFromGithubForEachOrg.bind(null, store),
      getListOfRepositoriesForAccounts.bind(null, store),
      compareTheListOfOrgRepos.bind(null, store)
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

    function getOrgsListFromGithub (store, next) {
      logger.info('Getting list of orgs from github');
      githubAdapter.getUserOrganizations(function (err, orgs) {
        assert.equal(err, null);
        store.orgsReturnedByGithub = orgs;
        assert.equal(store.orgsReturnedByGithub.length, 
          store.validOrgSubscriptions.length);
        next();
      });
    }

    function getProjectsFromGithubForEachOrg (store, next) {
      logger.info('getting list of projects for each org from Github');
      async.eachSeries(store.orgsReturnedByGithub, function (org, nextOrg){
        githubAdapter.getOrgRepositories(org.login, function (err, repos) {
          assert.equal(err, null);
          org.projects = repos;
          nextOrg();
        });
      }, function (){
        next();
      });
    }

    function getListOfRepositoriesForAccounts (store, next) {
      logger.info('Getting list of projects for each account from github');
      githubAdapter.getAllRepositoriesForUser(function (err, repos) {
        store.AllRepos = repos;
        store.validIndividualSubscriptions.forEach(function (sub){
          var validReposForThisAccount = 0;
          sub.projects.forEach(function (project) {
            store.AllRepos.forEach(function (repo) {
              /* jshint camelcase: false */
              if(repo.full_name === project.fullName){
                validReposForThisAccount += 1;
              }
            });
          });
          assert.equal(validReposForThisAccount, sub.projects.length);
        });
        next();
      });
    }

    function compareTheListOfOrgRepos (store, next) {
      logger.info('comparing the list of repos for each orgs');
      store.validOrgSubscriptions.forEach(function (subscription) {
        store.orgsReturnedByGithub.forEach(function (org) {
          if (org.login === subscription.orgName) {
            assert.equal(subscription.projects.length, org.projects.length);
          }
        });
        next(); 
      });
    }
  });
});