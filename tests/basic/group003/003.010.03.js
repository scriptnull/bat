'use strict';

var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'TestCase 3.10.3: Enable Project ' +
     'in Team Owned by Bitbucket User' });

describe('Test Case 3.10.3: Using Bitbucket token:', function () {
  var shippable = null;
  this.timeout(0);

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('Enable org project as an owner', function (done) {
    logger.info('Enabling PublicOrg/sample_python_sqllite as shipayefive');

    var store = {};

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);

    async.series([
      getProjectId,
      getProject,
      enableProject,
      checkEnabled,
      disableProject
    ], function (err) {
      assert.equal(err, null);
      done();
    });

    function getProjectId(next) {
      shippable.getAllProjects(function (err, projects) {
        assert.equal(err, null);
        assert.equal(Array.isArray(projects), true);
        store.projectId = null;
        projects.some(function (project) {
          if (project.fullName === 'PublicOrg/sample_python_sqllite') {
            store.projectId = project.id;
            return true;
          }
        });
        assert(store.projectId);
        next();
      });
    }

    function getProject(next) {
      shippable.getProject(store.projectId, function (err, project) {
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

    function disableProject(next) {
      store.project.disableBuilds(function(err) {
        assert.equal(err, null);
        next();
      });
    }

  });
});
