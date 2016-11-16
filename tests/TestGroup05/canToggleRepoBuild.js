'use strict';
/* global describe, it, before */
var mocha = require('mocha'),
    Shippable = require('../../lib/shippable/shippable.js'),
    nconf = require('nconf'),
    async = require('async'),
    assert = require('assert'),
    _ = require('underscore'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'canToggleRepoBuild' });

describe('Enable/disable project auto build', function() {
  var allSubscriptions = [],
      sampleProjects = [],
      shippable = null;

  before(function(done) {
    nconf.argv().env();
    this.timeout(0);
    shippable = new Shippable(nconf.get('apiEndpoint'), nconf.get('apiToken'));
    async.series([
      loadAllSubscriptions,
      loadProjectsInShippableSamplesSubscription
   ], function(err) {
     done(err);
   });
  });

  function loadAllSubscriptions(next) {
    logger.info('Loading all subscriptions');
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
    logger.info('Looking for shippableSamples subscription');
    var shippableSamplesSubscription = _.find(allSubscriptions, function(sub) {
      return sub.orgName === 'shippableSamples';
    });

    if (!shippableSamplesSubscription) {
      throw new Error('Cannot find shippableSamples subscription');
    }

    logger.info('Loading all projects in shippableSamples subscription');
    shippableSamplesSubscription.getProjects(function(err, projects) {
      sampleProjects = projects;
      if (err) {
        err = new Error('Error getting projects for subscription' + err);
      }
      return next(err);
    });
  }

  it('can enable auto build for a project', function(done) {
    this.timeout(0);
    var someDisabledProject = _.find(sampleProjects, function(project) {
      return project.autoBuild === false;
    });
    if (!someDisabledProject) {
      throw new Error('No disabled projects found in shippableSamples!');
    }
    logger.info('Enabling project', someDisabledProject.fullName,
      someDisabledProject.id);
    someDisabledProject.enableBuilds(function(err) {
      assert(err === null);
      done();
    });
  });

  it('can disable auto build for a project', function(done) {
    this.timeout(0);
    var someEnabledProject = _.find(sampleProjects, function(project) {
      return project.autoBuild === true;
    });
    if (!someEnabledProject) {
      throw new Error('No enabled projects found in shippableSamples!');
    }
    logger.info('Disabling project', someEnabledProject.fullName,
      someEnabledProject.id);
    someEnabledProject.disableBuilds(function(err) {
      assert(err === null);
      done();
    });
  });

});
