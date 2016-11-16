'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    BitbucketAdapter = require('../../../lib/shippable/BitbucketAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'Test Case 3.4.3: '});

describe('TestCase 03: Using bitbucket token,' ,
 function() {
  this.timeout(0);
  var shippable = null;
  var bitbucketAdapter = null;

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify all individual repositories match on SCM and Shippable',
   function(done) {
    var store = {};
    store.totalReposReturnedByBitbucket = 0;
    store.totalProjectsOnShippable = 0;
    store.individualProjectsOnShippable = 0;
    store.individualReposReturnedByBitbucket = 0;

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);
    
    async.series([
      getAccountId.bind(null, store),
      getAccount.bind(null, store),      
      getProjectsListFromShippable.bind(null, store),
      getIndividualProjectsListFromBitbucket.bind(null, store)
    ], function (err) {
      if (err) {
        logger.error(err);
      }
      assert.equal(store.individualReposReturnedByBitbucket,
       store.individualProjectsOnShippable);
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

    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');

      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);
        store.projects = projects;
        store.projects.forEach(function(project){
          var userName = project.fullName.split('/')[0];
          if(userName === store.account.identities[0].userName) {
            store.individualProjectsOnShippable++;
          }
        });

        logger.info('Total number of individual repos which the user has' +
          ' on shippable', store.individualProjectsOnShippable);
        next();
      });
    }

    function getIndividualProjectsListFromBitbucket (store, next) {

      logger.info('Getting list of individual repos from Bitbucket');

      bitbucketAdapter = new BitbucketAdapter(shipayefive.providerToken);

      bitbucketAdapter.getRepositories(store.account.identities[0].userName,
        function(err, repos){
          assert.equal(err, null);

          repos.forEach(function(repo){
            if(repo.owner.username === store.account.identities[0].userName) {
              store.individualReposReturnedByBitbucket++;
            }
          });

          logger.info('Total number of individual repos which the user has' +
            ' on bitbucket', store.individualReposReturnedByBitbucket);

          next();
        });
    }
  });
});
