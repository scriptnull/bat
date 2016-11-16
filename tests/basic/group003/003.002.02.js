'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.2.2: Using Github private'+
     ' token, verify the count of public projects for the account' });

describe('Test Case 3.2.2: Using Github Public token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.projects = {};
  store.privateProjectsOnShippable = 0;
  store.totalPrivateReposReturnedByGithub = 0;
  store.totalProjectsOnShippable = 0;
  store.totalPublicReposReturnedByGithub = 0;
  store.publicProjectsOnShippable = 0;

  nconf.argv().env().file({ 
    file: '../../../config', 
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of public projects', function(done) {
    
    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);

    async.series([
      getProjectsListFromShippable.bind(null, store),
      filterPrivateRepositories.bind(null, store),
      getPublicProjectsListFromGithub.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      assert.equal(store.totalPublicReposReturnedByGithub, 
        store.publicProjectsOnShippable);
      done();
    });

    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');

      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);
        store.totalProjectsOnShippable = projects.length;
        store.projects = projects;
        logger.info('Total number of repos which the user has' +
          ' access to on shippable', projects.length);
        next();
      });
    }

    function filterPrivateRepositories (store, next) {
      var count = 0;
      logger.info('Filtering out private repositories');
      store.projects.forEach(function (project) {
        project.loadDetails(function (err, projectObject) {
          assert.equal(err, null);
          if (projectObject && projectObject.isPrivateRepository) {
            store.privateProjectsOnShippable += 1;
          } else {
            store.publicProjectsOnShippable += 1;
          }
          count++;
          if (count === store.projects.length) {
            logger.info('Total number of public repos on shippable ',
              store.publicProjectsOnShippable);
            next();
          }
        });
      });
    }
    function getPublicProjectsListFromGithub (store, next) {
      logger.info('Getting list of public projects from github');
      githubAdapter = new GithubAdapter(shipayeone.providerToken);
      githubAdapter.getAllRepositoriesForUser(function (err, repos) {
        assert.equal(err, null);
        repos.forEach(function (repo) {
          if (repo.private) {
            store.totalPrivateReposReturnedByGithub += 1;
          } else {
            store.totalPublicReposReturnedByGithub += 1;
          }
        });
        logger.info('Total number of public repos returned by github ',
           store.totalPublicReposReturnedByGithub);
        next();
      });
    }
  });
});
