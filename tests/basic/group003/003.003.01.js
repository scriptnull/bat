'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.3.1: Using Github Public'+
     ' token, verify the count of only private projects for the account' });

describe('Test Case 3.3.1: Using Github Public token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.projects = {};
  store.totalReposReturnedByGithub = 0;
  store.privateProjectsOnShippable = 0;
  store.totalProjectsOnShippable = 0;
  store.privateReposReturnedByGithub = 0;

  nconf.argv().env().file({ 
    file: '../../../config', 
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of only private projects', function(done) {
    
    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert(shipaye2);
    assert(shipaye2.apiToken);
    
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye2.apiToken);

    async.series([
      getProjectsListFromShippable.bind(null, store),
      filterPublicRepositories.bind(null, store),
      getProjectsListFromGithub.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      logger.info('Total number of private projects on shippable: ',
       store.privateProjectsOnShippable);
      assert.equal(store.privateReposReturnedByGithub, 
        store.privateProjectsOnShippable);
      done();
    });

    function getProjectsListFromShippable (store, next) {
      logger.info('Getting list of projects from shippable');
      shippable.getAllProjects(function (err, projects) {
        assert.equal(err, null);
        store.totalProjectsOnShippable = projects.length;
        store.projects = projects;
        logger.info('Total number of projects on shippable: ', projects.length);
        next();
      });
    }

    function filterPublicRepositories (store, next) {
      var count = 0;
      logger.info('Filtering out public repositories');
      store.projects.forEach(function (project) {
        project.loadDetails(function (err, projectObject) {
          assert.equal(err, null);
          count++;
          if (projectObject && projectObject.isPrivateRepository) {
            store.privateProjectsOnShippable.push += 1;
            if (count === store.projects.length)
              next();
            return;
          }
          if (count === store.projects.length)
            next();
        });
      });
    }
    function getProjectsListFromGithub (store, next) {
      logger.info('getting list of projects from shippable');
      githubAdapter = new GithubAdapter(shipaye2.providerToken);
      githubAdapter.getAllRepositoriesForUser(function (err, repos) {
        assert.equal(err, null);
        repos.forEach(function (repo) {
          if (repo.private) {
            store.privateReposReturnedByGithub += 1; 
          }
        });
        logger.info('total private repos returned by Github',
         store.privateReposReturnedByGithub);
        next();
      });
    }
  });
});
