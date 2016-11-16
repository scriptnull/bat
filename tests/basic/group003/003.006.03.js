'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    BitbucketAdapter = require('../../../lib/shippable/BitbucketAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    _ = require('underscore'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'Test Case 3.6.3: '});

describe('TestCase 3.6.3: Using bitbucket token,' ,
 function() {
  this.timeout(0);
  var shippable = null;
  var bitbucketAdapter = null;

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify all owner repositories match on SCM and Shippable',
   function(done) {
    var store = {};
    store.bitbucketOwnerRepos = 0;
    store.shippableOwnerRepos = 0;

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);
    
    async.series([
      getShippableSubscriptions.bind(null, store),
      getBitbucketCountofOwnerRepos.bind(null, store),
      getProjectPermissions.bind(null, store)
    ], function (err) {
      if (err) {
        logger.error(err);
      }
      assert.equal(store.bitbucketOwnerRepos,
       store.shippableOwnerRepos);
      done();
    });

    function getShippableSubscriptions (store, next) {
      logger.info('gettting shippable subscriptions');
      shippable.getSubscriptions(function (err, subscriptions){
        assert.equal(err, null);
        store.subscriptions = subscriptions;
        next();
      });
    }

    function getBitbucketCountofOwnerRepos (store, next) {
      logger.info('getting bitbucket subscriptions');

      bitbucketAdapter = new BitbucketAdapter(shipayefive.providerToken);

      async.eachSeries(store.subscriptions,
        function(subscription, nextSubscription){

          bitbucketAdapter.getRepositories(subscription.orgName,
            function(err, repos){
              assert.equal(err, null);
              store.bitbucketOwnerRepos += repos.length;
              nextSubscription();
            });
        }, function(){
            logger.info('bitbucketOwnerRepos length: ',
             store.bitbucketOwnerRepos);
            next();
        });
    }

    function getProjectPermissions (store, next) {
      logger.info('getting project permissions from shippable');

      shippable.getProjectPermissions(function(err, projectPermissions){
        assert.equal(err, null);
        async.eachSeries(projectPermissions,
          function(permission, nextPermission) {
          var isOwner = _.contains(permission.roles, 'owner');
          if(isOwner) {
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
