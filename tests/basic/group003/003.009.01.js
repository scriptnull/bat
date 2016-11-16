'use strict';

var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'TestCase 3.9.1: Enable Project ' +
     'as a GitHub Collaborator with Public Scope' });

describe('Test Case 3.9.1: Using Github Public token:', function () {
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
    logger.info('Enabling shipayeone/sample_node as shipaye2');
    var store = {};

    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert(shipaye2);
    assert(shipaye2.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye2.apiToken);

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
          if (project.fullName === 'shipayeone/sample_node') {
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
    logger.info('Disabling shipayeone/sample_node as shipayeone');

    var shipayeone = nconf.get('testAccounts:shipayeone');
    assert(shipayeone);
    assert(shipayeone.apiToken);
    ownerShippable = new Shippable(nconf.get('apiEndpoint'),
      shipayeone.apiToken);

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
