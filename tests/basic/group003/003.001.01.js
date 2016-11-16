'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({name:'Test Case 3.1.1: Using Github Public'+
     ' token, verify the count of public projects for the account' });

describe('Test Case 3.1.1: Using Github Public token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.totalPublicReposReturnedByGithub = 0;
  store.totalProjectsOnShippable = 0;

  nconf.argv().env().file({ 
    file: '../../../config', 
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of public projects', function(done) {

    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert(shipaye2);
    assert(shipaye2.apiToken);
    
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye2.apiToken);

    async.series([
      getProjectsListFromShippable.bind(null, store),
      getPublicProjectsListFromGithub.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      assert.equal(store.totalPublicReposReturnedByGithub, 
        store.totalProjectsOnShippable);
      done();
    });

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

    function getPublicProjectsListFromGithub (store, next) {
      logger.info('Getting list of public projects from github');
      githubAdapter = new GithubAdapter(shipaye2.providerToken);
      githubAdapter.getAllRepositoriesForUser(function (err, repos) {
        assert.equal(err, null);
        store.totalPublicReposReturnedByGithub = repos.length;
        logger.info('Total number of public repos returned by github ',
           store.totalPublicReposReturnedByGithub);

        next();
      });
    }
  });
});
