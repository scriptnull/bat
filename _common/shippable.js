'use strict';

module.exports = Shippable;

var Account = require('./account.js'),
    Build = require('./build.js'),
    Subscription = require('./subscription.js'),
    Project = require('./project.js'),
    bunyan = require('bunyan'),
    log = bunyan.createLogger({ name: 'shippable.js' });

function Shippable(apiEndpoint, apiToken) {
  //log.debug('Using API endpoint', apiEndpoint);

  var RequestHelper = require('./requestHelper.js');
  var helper = new RequestHelper(apiEndpoint, apiToken, log);
  var util = require('util');

  this.getAccountIds = function(callback) {
    return helper.get('/accounts', callback);
  };

  this.getAllProjects = function (callback) {
    helper.get('/projects', function (err, projects) {
      var projectsInfo = [];
      if (err) return callback(err, null);
      projects.forEach(function (project) {
        var projectObject = null;
        projectObject = new Project(project, helper);
        projectsInfo.push(projectObject);
      });
      callback(err, projectsInfo);
    });
  };

  this.getAccount = function(accountId, callback) {
    var url = util.format('/accounts/%s', accountId);
    helper.get(url, function(err, accountData) {
      var account = null;
      if (!err) account = new Account(accountData, helper);
      callback(err, account);
    });
  };

  this.getSubscription = function(subscriptionId, callback) {
    var url = util.format('/subscriptions/%s', subscriptionId);
    helper.get(url, function(err, subData) {
      var sub = null;
      if (!err) sub = new Subscription(subData, helper);
      callback(err, sub);
    });
  };

  this.forceSyncAccount = function(callback) {
    var url = '/accounts?forceSyncPermissions=true';
    helper.get(url, function(err, accountId) {
      callback(err, accountId);
    });
  }

  this.getSubscriptions = function(callback) {
    var url = '/subscriptions';
    var subscriptionInfo = [];
    helper.get(url, function(err, subs) {
      if (err) callback (err, null);
      subs.forEach(function (sub) {
        var subscription = null;
        subscription = new Subscription(sub, helper);
        subscriptionInfo.push(subscription);
      });
      callback(err, subscriptionInfo);
    });
  };

  this.getProject = function(projectId, callback) {
    var url = util.format('/projects/%s', projectId);
    helper.get(url, function(err, projectData) {
      var project = null;
      if (!err) project = new Project(projectData, helper);
      callback(err, project);
    });
  };

  this.getBuild = function(buildId, callback) {
    var url = util.format('/builds/%s', buildId);
    helper.get(url, function(err, buildData) {
      var build = null;
      if (!err) build = new Build(buildData, helper);
      callback(err, build);
    });
  };

  this.getProjectPermissions = function(callback) {
    var url = '/projectPermissions';
    helper.get(url, function(err, projectPermissions) {
      callback(err, projectPermissions);
    });
  }

  this.getSubscriptionPermissions = function(callback) {
    var url = '/subscriptionPermissions';
    helper.get(url, function(err, subscriptionPermissions) {
      callback(err, subscriptionPermissions);
    });
  }
}
