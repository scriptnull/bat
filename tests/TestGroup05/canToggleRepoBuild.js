'use strict';
/* global describe, it, before */
var mocha = require('mocha'),
    Shippable = require('../../_common/shippable/Adapter.js'),
    nconf = require('nconf'),
    async = require('async'),
    assert = require('assert'),
    _ = require('underscore'),
    start = require('../../test.js');

describe('Enable/disable project auto build', function() {
  var allSubscriptions = [],
      sampleProjects = [],
      shippable = null;

  before(function(done) {
    this.timeout(0);
    start = new start();
    nconf.argv().env();

    shippable = new Shippable(config.apiToken);
    async.series([
      _loadAllSubscriptions,
      _loadProjectsInShippableSubscription
   ], function(err) {
     return done(err);
   });
  });

  function _loadAllSubscriptions(next) {
    logger.info('Loading all subscriptions');
    shippable.getSubscriptions('',
      function(err, subs) {
        if (err) {
          logger.warn(who, util.format('Failed to get subscriptions'), err);
          return next(true);
        } else {
          allSubscriptions = subs;
          return next();
        }
    });
  }

  function _loadProjectsInShippableSubscription(next) {
    logger.info('Looking for Shippable subscription');
    var shippableSubscription = _.find(allSubscriptions, function(sub) {
      return sub.orgName === 'Shippable';
    });

    if (!shippableSubscription) {
      throw new Error('Cannot find Shippable subscription');
    }

    logger.debug('Loading all projects in Shippable subscription');

    var query = util.format('subscriptionIds=%s',shippableSubscription.id);
    shippable.getProjects(query,
      function(err, projs) {
        if (err) {
          logger.warn(who, util.format('Failed to get projects'), err);
          return next(true);
        } else {
          sampleProjects = projs;
          return next();
        }
      }
    );
  }

  it('can enable auto build for a project', function(done) {
    this.timeout(0);
    var someDisabledProject = _.find(sampleProjects, function(project) {
      return project.autoBuild === null;
    });

    if (!someDisabledProject) {
      throw new Error('No disabled projects found in Shippable!');
    }

    logger.info('Enabling project', someDisabledProject.fullName,
      someDisabledProject.id);
    var body = {
      projectId: someDisabledProject.projectId,
      type: 'ci'
    };
    shippable.enableProjectById(someDisabledProject.projectId, body,
      function(err) {
        assert(err === null);
        return done();
      }
    );
  });
});
