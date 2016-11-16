'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    _ = require('underscore'),
    logger = bunyan.createLogger({name:'Test Case 3.4.2: '});

describe('Test Case 3.4.2: Using Github Private token, ' ,
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

    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);

    async.series([
      getAccountId.bind(null, store),
      getAccount.bind(null, store),
      getProjectsListFromGithub.bind(null, store),
      getProjectsListFromShippable.bind(null, store),
      filterPrivateRepositories.bind(null, store)
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

    function getProjectsListFromGithub (store, next) {

      logger.info('Getting individual projects from github');

      githubAdapter = new GithubAdapter(shipayeone.providerToken);

      githubAdapter.getRepositories(function (err, repos) {
          assert.equal(err, null);

          var privateGithubReposCount = 0;

          _.forEach(repos, function(repo){
            if(repo.private === true) {
              privateGithubReposCount++;
            }
          });

          store.totalIndividualReposReturnedByGithub = 
            privateGithubReposCount;

          logger.info('Total number of private individual projects' +
           ' returned by github '+
           store.totalIndividualReposReturnedByGithub);

          next();
      });
    }

    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');
      
      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);

        store.projects = projects;

        logger.info('Total number of individual projects which' +
          '  the user has on shippable', store.projects.length);
        next();
      });
    }

    function filterPrivateRepositories (store, next) {
      logger.info('Filtering out private repositories');

      async.eachSeries(store.projects, function(project, nextProject) {
        project.loadDetails(function (err, projectObject) {
          var userName = projectObject.fullName.split('/')[0];
          if (projectObject && projectObject.isPrivateRepository
           && userName === store.account.identities[0].userName) {
            store.totalIndividualProjectsOnShippable++;
          }
          nextProject()
        });
      }, next);
    }
  });
});
