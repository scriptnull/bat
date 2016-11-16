'use strict';
/* global describe, it, before */
var mocha = require('mocha'),
    Shippable = require('../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    async = require('async'),
    assert = require('assert'),
    _ = require('underscore'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'buildAllSamples' });

describe('Run basic ubuntu1204 sample projects', function() {
  var allSubscriptions = [],
      sampleProjects = [],
      shippable = null;

  before(function(done) {
    nconf.argv().env();
    shippable = new Shippable(nconf.get('apiEndpoint'), nconf.get('apiToken'));
    async.series([
      loadAllSubscriptions,
      loadProjectsInShippableSamplesSubscription
      ], function(err) {
        done(err);
      });
  });

  function loadAllSubscriptions(next) {
    shippable.getAccountIds(function(err, accountIds) {
      if (err) throw new Error('Error getting account ids: ' + err);
      // Assuming we only get one account ID for now
      shippable.getAccount(accountIds[0], function(err, account) {
        account.getSubscriptions(function(err, subs) {
          allSubscriptions = subs;
          if (err) {
            err = new Error('Error getting subscriptions for account. ' + err);
          }
          return next(err);
        });
      });
    });
  }

  function loadProjectsInShippableSamplesSubscription(next) {
    var shippableSamplesSubscription = _.find(allSubscriptions, function(sub) {
      return sub.orgName === 'shippableSamples';
    });

    shippableSamplesSubscription.getProjects(function(err, projects) {
      sampleProjects = projects;
      if (err) {
        err = new Error('Error getting projects for subscription' + err);
      }
      return next(err);
    });
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
      next();
    }
  }

  function triggerBuild(store, next) {
    logger.info('Triggering build on project', store.project.id);
    store.project.build(function(err, build) {
      if (err) {
        err = new Error('Error triggering build' + err);
      } else {
        logger.info('Build triggered', build);
        store.build = build;
      }

      return next(err);
    });
  }

  function findProjectByName(name) {
    return _.find(sampleProjects, function(project) {
      return project.name === name;
    });
  }

  function waitForBuildCompletion(store, done, err) {
    logger.info('Inside wait for build');
    if (err) return done(err);
    var pollCount = 0,
        pollInterval = 15 * 1000, // 15 seconds
        timeout = 10 * 60 * 1000; // 10 minutes

    setTimeout(pollForBuild, pollInterval);

    function pollForBuild() {
      pollCount++;
      if (pollCount * pollInterval > timeout) {
        return done('Timed out waiting for build to start');
      } else {
        store.build.loadDetails(function(err) {
          // For some strange and mysterious reason, API returns 400 Bad Request
          // if it can't find a build with the given ID. This should have been a
          // 404 Not Found but for now we will just put up with what API returns
          if (err === 400 || store.build.isCompleted === false) {
            logger.info('Waiting for', store.project.fullName, ':',
              store.build.buildGroupNumber, 'to complete...');
            setTimeout(pollForBuild, pollInterval);
          } else if (err) {
            logger.error('Error waiting for build to complete', err);
            done(err);
          } else {
            logger.info('Build completed');
            assert(store.build.status === 30);
            done();
          }
        });
      }
    }
  }

  function runProject(projectName, done) {
    logger.info('Processing project', projectName);
    var project = findProjectByName(projectName);
    if (!project) { throw new Error('Project not found: ' + projectName); }

    var store = {
      project: project,
      build: null
    };

    async.series([
        enableProject.bind(null, store),
        triggerBuild.bind(null, store)
    ], waitForBuildCompletion.bind(null, store, done));
  }

  it('runs sample_ubuntu1204_java', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_java', done);
  });

  it('runs sample_ubuntu1204_php', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_php', done);
  });

  it('runs sample_ubuntu1204_python', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_python', done);
  });

  it('runs sample_ubuntu1204_nodejs', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_nodejs', done);
  });

  it('runs sample_ubuntu1204_go', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_go', done);
  });

  it('runs sample_ubuntu1204_ruby', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_ruby', done);
  });

  it('runs sample_ubuntu1204_scala', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_scala', done);
  });

  it('runs sample_ubuntu1204_clojure', function(done) {
    this.timeout(0);
    runProject('sample_ubuntu1204_clojure', done);
  });

});
