'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Subscriptions Dashboard';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';
var run = {};
var runId;

describe('Subscriptions Dashboard',
  function () {

    describe(testSuite,
      function () {

        it('Get Run Status By SubscriptionId',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            subscriptionId = nconf.get("shiptest-GITHUB_ORG_1:subscriptionId");
            var query = 'type=ci&isGitTag=false';
            shippable.getRunStatusBySubscriptionId(subscriptionId, query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get runs failed with error: %s for subscriptionId: %s' +
                      testSuiteDesc, err, subscriptionId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  run = _.first(runs);
                  runId = run.id;
                  console.log('Fetched Run Status By SubscriptionId: '+ subscriptionId);
                  return done();
                }
              }
            );
          }
        );

        it('Trigger New Build',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            projectId = run.projectId;
            var payload = {
              projectId: projectId,
              branchName: run.branchName,
              type: 'push'
            };
            shippable.triggerNewBuildByProjectId(projectId, payload,
              function (err, msg) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s trigger new build failed for projectId: $s'+
                      'with error: %s' + testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  runId = msg.runId;
                  console.log('Triggered new build for projectId: '+ projectId);
                }
              }
            );
          }
        );

        it('Get inflight runs',
          function (done) {
            var query = util.format('projectIds=%s&status=incomplete',
              projectId);
            shippable.getRuns(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting inflight runs failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  console.log('Inflight runs fetched');
                  return done();
                }
              }
            );
          }
        );

        it('Cancel run',
          function (done) {
            if (!runId) return done();
            shippable.cancelRunById(runId,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Cancelling run runId: %s failed with ' +
                      'error: %s', testSuiteDesc, runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  console.log('Run successfully cancelled');
                  return done();
                }
              }
            );
          }
        );

        it('Get runs',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = util.format('runIds=%s',runId)
            shippable.getRuns(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                       '\n - [ ] %s get runById failed for runId: $s'+
                      'with error: %s' + testSuiteDesc, runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  runId = res.id;
                  console.log('Fetched run by id for runId: runId');
                }
              }
            );
          }
        );
      }
    );

    describe('Should run after above test suites',
      function () {
        it('Creating Github Issue if test cases failed',
          function (done) {
            this.timeout(0);
            if (isTestFailed) {
              var githubAdapter =
                new adapter(config.githubToken, config.githubUrl);
              var title = util.format('Failed test suite %s', testSuite);
              var body = util.format(
                'Failed test cases are:\n%s',testCaseErrors);
              var data = {
                title: title,
                body: body
              };
              githubAdapter.pushRespositoryIssue('deepikasl', 'VT1', data,
                function(err) {
                  if (err)
                    logger.warn("Creating Issue failed with error: ", err);
                  return done();
                }
              );
            } else {
              return done();
            }
          }
        );
      }
    );
  }
);
