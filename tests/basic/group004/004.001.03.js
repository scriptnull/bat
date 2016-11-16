'use strict';
/* global describe, it, before */
var Shippable = require('../../../lib/shippable/shippable.js');
var nconf = require('nconf');
var async = require('async');
var assert = require('assert');
var _ = require('underscore');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name:
  'TestCases 004.001.3' });

describe('Test 004.001.03: Run a manual build with bitbucket account',
  function() {

  nconf.argv().env().file({
    file: '../../../config', format: nconf.formats.json});
  nconf.load();

  // env vars to use for test
  var thisAccount = null;
  var provider = 'bitbucket';

  // projects to use for test:
  var projectName = 'test004-001-x';


  var myProjects = [];
  var shippable = null;
  var thisIdentity = null;
  var maxBuildTimeout = 5; // in minutes

  before(function(done) {

    this.timeout(0);
    thisAccount = nconf.get('testAccounts:shipayefive');
    var apiToken = null;
    if (!thisAccount || !thisAccount.account) {
      apiToken = nconf.get('apiTokenForshipayefiveAccount');
      logger.info('no nconf for ' + provider + ' user');
    } else {
      apiToken = thisAccount.apiToken;
    }
    shippable = new Shippable(nconf.get('apiEndpoint'), apiToken);
    async.series([
      getAccount,
      getIdentity,
      getProjects
    ], function(err) {
      done(err);
    });
  });

  function getAccount(next) {
    if (!thisAccount || !thisAccount.account) {
      thisAccount = {};
      shippable.getAccountIds(function (err, ids) {
        if (err) return next(new Error('couldnt get account ids'));
        shippable.getAccount(ids[0], function (err, account) {
          if (err) return next(new Error('couldnt get account'));
          thisAccount.account = account;
          next();
        });
      });
    } else next();
  }

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
        timeout = maxBuildTimeout * 60 * 1000;

    if (!store.project.autoBuild)
      return cb(new Error('project ' +
        store.project.fullName + ' not enabled'));

    setTimeout(pollForBuild, pollInterval);

    function pollForBuild() {
      pollCount++;
      if (pollCount * pollInterval > timeout) {
        return cb(new Error('Timed out waiting for build'));
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
    assert(!err);
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

  it('can run a webhook build', function(done) {
    this.timeout(0);
    var skipWebhook =
      nconf.get('apiEndpoint').toLowerCase().indexOf('localhost') !== -1;
    if (skipWebhook) {
      logger.info('running on localhost, skipping webhook build');
      return done();
    }
    logger.info('triggering a webhook build for bitbucket');
    done();
  });
});
