'use strict';
/* global describe, it, before */
var Shippable = require('../../../lib/shippable/shippable.js');
var nconf = require('nconf');
var async = require('async');
var assert = require('assert');
var _ = require('underscore');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name:
  'TestCases 201.007.1' });

describe('Test 201.007.01: sample_go_mongo',
  function() {

  nconf.argv().env().file({
    file: '../../../config', format: nconf.formats.json});
  nconf.load();
  // env vars to use for test
  var thisAccount = null;
  var provider = 'github';

  // projects to use for test:
  var projectName = 'sample_go_mongo';

  var myProjects = [];
  var shippable = null;
  var thisIdentity = null;

  before(function(done) {
    this.timeout(0);
    thisAccount = nconf.get('testAccounts:shipaye2');
    if (!thisAccount) return done(new Error('no account'));
    shippable = new Shippable(nconf.get('apiEndpoint'), thisAccount.apiToken);
    async.series([
      getIdentity,
      getProjects
    ], function(err) {
      done(err);
    });
  });

  function getIdentity(next) {
    logger.info('finding identity for account');
    thisIdentity = _.find(thisAccount.account.identities, function(identity) {
      return identity.provider === provider;
    });
    if (!thisIdentity)
      return next(new Error('no ' + provider + ' identity found for account'));
    next();
  }

  function getProjects(next) {
    logger.info('getting list of projects for user ' + thisIdentity.userName);
    shippable.getAllProjects(function (err, projects) {
      if (err || !projects)
        return next(new Error('couldnt get projects: ' + err));
      myProjects = projects;
      next();
    });
  }

  function enableProject(project, callback) {
    if (project.autoBuild !== true) {
      logger.info('autoBuild !== true; Enabling now');
      project.enableBuilds(function(err) {
        if (err) {
          err = new Error('Error enabling auto build for project' + err);
        }
        callback(err);
      });
    } else {
      logger.info('autoBuild === true');
      callback();
    }
  }

  function waitForBuildCompletion(store, cb) {
    logger.info('Inside wait for build');
    var pollCount = 0,
        pollInterval = 10 * 1000, // 10 seconds
        timeout = 5 * 60 * 1000; // 5 minutes
    if (!store.project.autoBuild)
      return cb(new Error('project ' +
        store.project.fullName + ' not enabled'));

    setTimeout(pollForBuild, pollInterval);

    function pollForBuild() {
      pollCount++;
      if (pollCount * pollInterval > timeout) {
        return cb('Timed out waiting for build to start');
      } else {
        store.build.loadDetails(function(err) {
          // 400 means we cant' find the buildId
          if (err === 400 || store.build.isCompleted === false) {
            logger.info('Waiting for', store.project.fullName, ':',
              store.build.buildGroupNumber, 'to complete...');
            setTimeout(pollForBuild, pollInterval);
          } else if (err) {
            logger.error('Error waiting for build to complete', err);
            cb(err);
          } else if (store.build.status === 80) {
            cb(new Error('build failed'));
          } else {
            logger.info('Build completed');
            assert(store.build.status === 30);
            cb();
          }
        });
      }
    }
  }

  function handleFinishedBuild(store, done, err) {
    if (err) return done(new Error('error waiting for build:' + err));
    logger.info('disabling finished build');
    store.project.disableBuilds(function (err) {
      done(err);
    });
  }

  it('can run a build', function(done) {
    this.timeout(0);
    var myProject = projectName;
    var myUserName = thisIdentity.userName;
    var someProject = _.find(myProjects, function(project) {
      // myProject is defined at the top
      return project.fullName === myUserName + '/' + myProject;
    });
    if (!someProject) {
      return done(new Error(myUserName + '/' + myProject + ' not found.'));
    }

    logger.info('enabling project:', myProject);
    enableProject(someProject, function(err) {
      if (err)
        return done(new Error ('error enabling ' + myProject + ' ' + err));
      logger.info(myProject, 'is now enabled');
      logger.info('triggering build', someProject.fullName,
        someProject.id);
      someProject.build(function (err, build) {
        assert(err === null);
        var store = {
          build: build,
          project: someProject
        };
        waitForBuildCompletion(store,
          handleFinishedBuild.bind(null, store, done));
      });
    });
  });
});
