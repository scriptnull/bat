'use strict';
/* global describe, it, before */
var Shippable = require('../../../lib/shippable/shippable.js');
var nconf = require('nconf');
var async = require('async');
var assert = require('assert');
var _ = require('underscore');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name:
  'TestCases 004.004.1' });
var GithubAdapter = require('../../../lib/shippable/GithubAdapter.js');

describe('Test 004.004.01: Run webhook build with Github public scope',
  function() {

  nconf.argv().env().file({
    file: '../../../config', format: nconf.formats.json});
  nconf.load();
  // env vars to use for test
  var thisAccount = null;
  var providerToken = null;
  var provider = 'github';

  // projects to use for test:
  var projectName = 'test004-004-x';

  var myProjects = [];
  var shippable = null;
  var thisIdentity = null;
  var skipWebhook = false;
  var maxBuildTimeout = 5; // in minutes

  before(function(done) {
    this.timeout(0);
    thisAccount = nconf.get('testAccounts:shipaye2');
    providerToken = nconf.get('githubPublicTokenForshipaye2Account');
    if (!thisAccount) done(new Error('no account'));
    skipWebhook =
      nconf.get('apiEndpoint').toLowerCase().indexOf('localhost') !== -1;
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

  it('can run a webhook build', function(done) {
    this.timeout(0);

    logger.info('triggering a webhook build');

    var store = {
      githubAdapter: new GithubAdapter(providerToken),
      project: null,
      build: null,
      hook: null
    };
    async.series([
      findProject.bind(null, store),
      enableProject.bind(null, store),
      findHook.bind(null, store),
      triggerHook.bind(null, store),
      getLatestBuild.bind(null, store),
      waitForBuildCompletion.bind(null, store),
      removeFinishedBuild.bind(null, store)
    ], function(err) {
      assert(!err);
      done(err);
    });
  });

  function findProject(store, next) {
    logger.info('finding project ' + projectName);
    var someProject = _.find(myProjects, function(project) {
      // myProject is defined at the top
      return project.fullName === thisIdentity.userName + '/' + projectName;
    });
    if (!someProject) {
      next(new Error(thisIdentity.userName +
        '/' + projectName + ' not found.'));
    }
    store.project = someProject;
    next();
  }

  function enableProject(store, next) {
    if (store.project.autoBuild !== true) {
      logger.info('autoBuild !== true; Enabling now');
      store.project.enableBuilds(function(err) {
        if (err) {
          err = new Error('Error enabling auto build for project' + err);
        }
        next(err);
      });
    } else {
      logger.info('autoBuild === true');
      // give the project some time to finished enablement
      setTimeout(next, 1000);
    }
  }

  function findHook(store, next) {
    logger.info('getting webhooks for project ' + projectName);
    store.githubAdapter.getHooks(thisIdentity.userName, projectName,
      function(err, hooks) {
      if (err || !hooks)
        return next(new Error('no hooks found for project ' + projectName));
      store.hook = _.find(hooks, function(hook) {
        return hook.active && hook.config.url.indexOf(nconf.get('apiEndpoint'));
      });
      logger.info('got a hook:' + store.hook.id);
      next();
    });
  }

  function triggerHook(store, next) {
    if (skipWebhook)
      return next();
    logger.info('triggering webhook build');
    // (owner, repo, hookId, callback)
    store.githubAdapter.testHook(thisIdentity.userName, projectName,
      store.hook.id, function(err) {
        next(err);
    });
  }

  function getLatestBuild(store, next) {
    if (skipWebhook)
      return next();
    logger.info('getting latest build');
    var waitForBuildStart = 3000; // 3 seconds
    setTimeout(getBuildInfo, waitForBuildStart);
    function getBuildInfo() {
      store.project.getLatestBuild(function (err, build) {
        if (err || !build)
          return next(new Error ('error getting build for ' +
            projectName + ' ' + err));
        logger.info('got a build: ' + build.id);
        store.build = build;
        next();
      });
    }
  }

  function waitForBuildCompletion(store, next) {
    if (skipWebhook)
      return next();
    logger.info('Inside wait for build');
    var pollCount = 0,
        pollInterval = 10 * 1000, // 10 seconds
        timeout = maxBuildTimeout * 60 * 1000;

    if (!store.project.autoBuild)
      return next(new Error('project ' +
        store.project.fullName + ' not enabled'));

    setTimeout(pollForBuild, pollInterval);

    function pollForBuild() {
      pollCount++;
      if (pollCount * pollInterval > timeout) {
        return next(new Error('Timed out waiting for build'));
      } else {
        store.build.loadDetails(function(err) {
          // 400 means we cant' find the buildId
          if (err === 400 || store.build.isCompleted === false) {
            logger.info('Waiting for', store.project.fullName, ':',
              store.build.buildGroupNumber, 'to complete...');
            setTimeout(pollForBuild, pollInterval);
          } else if (err) {
            logger.error('Error waiting for build to complete', err);
            next(err);
          } else if (store.build.status === 80) {
            next(new Error('build failed'));
          } else {
            logger.info('Build completed');
            assert(store.build.status === 30);
            next();
          }
        });
      }
    }
  }

  function removeFinishedBuild(store, next) {
    logger.info('disabling finished build');
    store.project.disableBuilds(function (err) {
      next(err);
    });
  }

});
