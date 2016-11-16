'use strict';

var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'TestCase 3.11.1: Enable Project ' +
     'as an Org Collaborator with Public Scope' });

describe('Test Case 3.11.1: Using Github Public token:', function () {
  var shippable = null;
  var ownerShippable = null;
  var projectId = null;
  this.timeout(0);

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('Enable org project as a collaborator', function (done) {
    logger.info('Enabling PublicOrg/sample-python-rethinkdb as shipaye4');
    var store = {};

    var shipaye4 = nconf.get('testAccounts:shipaye2');
    assert(shipaye4);
    assert(shipaye4.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipaye4.apiToken);

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
          if (project.fullName === 'PublicOrg/sample-python-rethinkdb') {
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

  it('Disable org project enabled by a collaborator', function (done) {
    logger.info('Disabling PublicOrg/sample-python-rethinkdb as shipaye2');

    var shipaye2 = nconf.get('testAccounts:shipaye2');
    assert(shipaye2);
    assert(shipaye2.apiToken);
    ownerShippable = new Shippable(nconf.get('apiEndpoint'),
      shipaye2.apiToken);

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
