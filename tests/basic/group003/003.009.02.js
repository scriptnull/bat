'use strict';

var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'TestCase 3.9.2: Enable Project ' +
     'as a GitHub Collaborator with Private Scopes' });

describe('Test Case 3.9.2: Using Github Private token:', function () {
  var shippable = null;
  var ownerShippable = null;
  var projectId = null;
  this.timeout(0);

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('Enable project in another user\'s subscription', function (done) {
    logger.info('Enabling shipaye3/EmptyPrivateRepository as shipayeone');

    var store = {};

    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayeone.apiToken);

    var shipaye3 = nconf.get('testAccounts:shipaye3');
    assert(shipaye3);
    assert(shipaye3.apiToken);
    ownerShippable = new Shippable(nconf.get('apiEndpoint'), shipaye3.apiToken);

    async.series([
      forceSyncShipayeone,
      getProjectId,
      getProject,
      enableProject,
      checkEnabled
    ], function (err) {
      assert.equal(err, null);
      done();
    });

    function forceSyncShipayeone(next) {
      logger.info('force syncing shipaye3 (owner account)');
      ownerShippable.forceSyncAccount(function(err, accountId){
        assert.equal(err, null);
        assert(accountId);
        logger.info('shipaye3 sync returns accountId: ', accountId);
        next();
      });
    }

    function getProjectId(next) {
      shippable.getAllProjects(function (err, projects) {
        assert.equal(err, null);
        assert.equal(Array.isArray(projects), true);

        projects.some(function (project) {
          if (project.fullName === 'shipaye3/EmptyPrivateRepository') {
            projectId = project.id;
            return true;
          }
        });
        assert(projectId);
        next();
      });
    }

    function getProject(next) {
      shippable.getProject(projectId, function (err, project) {
        assert.equal(err, null);
        store.project = project;
        assert(store.project);
        assert.equal(store.project.autoBuild, false);
        next();
      });
    }

    function enableProject(next) {
      store.project.enableBuilds(function(err) {
        assert.equal(err, null);
        next();
      });
    }

    function checkEnabled(next) {
      shippable.getProject(store.project.id, function (err, project) {
        assert.equal(err, null);
        assert.equal(project.autoBuild, true);
        next();
      });
    }

  });

  it('Disable project enabled by another user', function (done) {
    logger.info('Disabling shipaye3/EmptyPrivateRepository as shipaye3');

    var shipaye3 = nconf.get('testAccounts:shipaye3');
    assert(shipaye3);
    assert(shipaye3.apiToken);
    ownerShippable = new Shippable(nconf.get('apiEndpoint'), shipaye3.apiToken);

    ownerShippable.getProject(projectId, function (err, project) {
      assert.equal(err, null);
      assert(project);
      project.disableBuilds(function(err) {
        assert.equal(err, null);
        done();
      });
    });

  });

});
