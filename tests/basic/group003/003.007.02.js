'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    GithubAdapter = require('../../../lib/shippable/GithubAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    _ = require('underscore'),
    logger = bunyan.createLogger({name:'Test Case 3.7.2: '});

describe('Test Case 3.7.2: Using Github Public token, ' ,
 function() {
  this.timeout(0);
  var store = {};
  var shippable = null;
  var githubAdapter = null;
  store.githubOwnerRepos = 0;
  store.shippableOwnerRepos = 0;

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify the count of all owner projects', function(done) {

    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);

    async.series([
      getGithubOwnerRepos.bind(null, store),
      getProjectPermissions.bind(null, store)
    ], function (err) {
      if (err) {
        done(err);
      }
      assert.equal(store.githubOwnerRepos, 
        store.shippableOwnerRepos);
      done();
    });

    function getGithubOwnerRepos (store, next) {
      logger.info('getting owner repos from Github');
      githubAdapter = new GithubAdapter(shipayeone.providerToken);

      githubAdapter.getAllRepositoriesForUser(function(err, repos){
        assert.equal(err, null);
        async.eachSeries(repos, function(repo, nextRepo){
          if(!repo.permissions.admin) {
            store.githubOwnerRepos++;
          }
          nextRepo();
        }, function(){
            logger.info('count of github owner projects: ',
              store.githubOwnerRepos);
            next();
        });
      });
    }

    function getProjectPermissions (store, next) {
      logger.info('getting project permissions from shippable');

      shippable.getProjectPermissions(function(err, projectPermissions){
        assert.equal(err, null);
        async.eachSeries(projectPermissions,
          function(permission, nextPermission) {
          var isCollaborator = 
            (!_.contains(permission.roles, 'owner') &&
              _.contains(permission.roles, 'collaborator'));
          if(isCollaborator) {
            store.shippableOwnerRepos++;
          }
          nextPermission();
        }, function(){
            logger.info('count of shippable owner projects: ',
              store.shippableOwnerRepos);
            next();
        });
      });
    }
  });
});
