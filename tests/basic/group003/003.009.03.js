'use strict';

var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'TestCase 3.9.3: Enable Project ' +
     'as a Bitbucket Collaborator' });

describe('Test Case 3.9.3: Using Bitbucket token:', function () {
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
    logger.info('Enabling shipayefive/sample_scala as shipaye6');

    var store = {};

    var shipaye6 = nconf.get('testAccounts:shipaye6');
    assert(shipaye6);
    assert(shipaye6.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye6.apiToken);

    async.series([
      getProjectId,
      getProject,
      enableProject,
      checkEnabled
    ], function (err) {
      assert.equal(err, null);
      done();
    });

    function getProjectId(next) {
      shippable.getAllProjects(function (err, projects) {
        assert.equal(err, null);
        assert.equal(Array.isArray(projects), true);

        projects.some(function (project) {
          if (project.fullName === 'shipayefive/sample_scala') {
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
    logger.info('Disabling shipayefive/sample_scala as shipayefive');

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    ownerShippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);

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
