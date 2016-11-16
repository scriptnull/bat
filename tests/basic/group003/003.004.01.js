'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    _ = require('underscore'),
    logger = bunyan.createLogger({name:'Test Case 3.4.1: '});

describe('Test Case 3.4.1: Using Github Public token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.totalIndividualReposReturnedByGithub = 0;
  store.totalIndividualProjectsOnShippable = 0;

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of individual projects', function(done) {

    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert(shipaye2);
    assert(shipaye2.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye2.apiToken);

    async.series([
      getAccountId.bind(null, store),
      getAccount.bind(null, store),
      getIndividualProjectsListFromGithub.bind(null, store),
      getProjectsListFromShippable.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      assert.equal(store.totalIndividualReposReturnedByGithub, 
        store.totalIndividualProjectsOnShippable);
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
        next();
      });
    }        

    function getIndividualProjectsListFromGithub (store, next) {

      logger.info('Getting individual projects from github');

      githubAdapter = new GithubAdapter(shipaye2.providerToken);

      githubAdapter.getUserRepositories(store.account.identities[0].userName,
        function (err, repos) {
          assert.equal(err, null);

          store.totalIndividualReposReturnedByGithub = repos.length;

          logger.info('Total number of individual projects returned by github',
            ' ' + store.totalIndividualReposReturnedByGithub);

          next();
      });
    }

    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');
      
      var countOfIndividualShippableProjects = 0;

      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);

        _.forEach(projects, function (project) {
          var userName = project.fullName.split('/')[0];
          if(userName === store.account.identities[0].userName) {
            countOfIndividualShippableProjects++;
          }
        });

        store.totalIndividualProjectsOnShippable = 
          countOfIndividualShippableProjects;

        logger.info('Total number of individual projects which the user has' +
          ' on shippable', store.totalIndividualProjectsOnShippable);

        next();
      });
    }
  });
});
