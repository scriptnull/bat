'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.1.2: Using Github Private'+
    'token, verify the count of public and private projects for the account'});

describe('TestCase02: Using Github Private Token, ',
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.totalReposReturnedByGithub = 0;
  store.totalReposReturnedByBitbucket = 0;
  store.totalProjectsOnShippable = 0;
  store.syncPrivateForks = false;

  nconf.argv().env().file({ 
    file: '../../../config', 
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of public and private projects', function(done) {
    
    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);

    async.series([
      getAccountId.bind(null, store),
      getAccount.bind(null, store),
      getAccountSettings.bind(null, store),
      getProjectsListFromShippable.bind(null, store),
      getProjectsListFromGithub.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      assert.equal(store.totalReposReturnedByGithub, 
        store.totalProjectsOnShippable);
      done();
    });

    function getAccountId (store, next) {

      logger.info('Getting account Id');

      shippable.getAccountIds(function(err, ids) {
        assert.equal(err, null);
        store.accountId = ids[0];
        next();
      });
    }

    function getAccount (store, next) {

      logger.info('Getting account info');

      shippable.getAccount(store.accountId, function (err, account) {
        assert.equal(err, null);
        store.account = account;

        account.identities.forEach(function (identity) {
          if (identity.provider === 'github') {
            store.providerId = identity.providerId;
          }
        });
        next();
      });
    } 

    function getAccountSettings (store, next) {

      logger.info('Getting account Settings');

      store.account.getAccountSettings( function (err, Settings) {
        assert.equal(err, null);
        if (Settings[0] && Settings[0].syncPrivateForks)
          store.syncPrivateForks = Settings[0].syncPrivateForks;
        next();
      });
    }


    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');

      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);
        store.totalProjectsOnShippable = projects.length;
        logger.info('Total number of repos which the user has' +
          ' access to on shippable', projects.length);
        next();
      });
    }

    function getProjectsListFromGithub (store, next) {
      logger.info('Getting list of public projects from github');
      githubAdapter = new GithubAdapter(shipayeone.providerToken);
      githubAdapter.getAllRepositoriesForUser(function (err, repos) {
        assert.equal(err, null);
        repos.forEach(function (repo) {
          if (!store.syncPrivateForks && repo.fork && repo.private &&
              ((repo.owner && repo.owner.id && repo.owner.id.toString()) !==
              (store.providerId && store.providerId.toString()))) {
            // Exclude forks of private repositories not belonging to the user
            return;
          }
          store.totalReposReturnedByGithub += 1;
        });
        logger.info('Total number of repos returned by github ',
           store.totalReposReturnedByGithub);
        next();
      });
    }
  });
});
