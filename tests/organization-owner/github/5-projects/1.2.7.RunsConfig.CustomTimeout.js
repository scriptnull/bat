'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Custom Timeout';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var projectId = '';

describe('Custom Timeout',
  function () {
    describe(testSuite,
      function () {
        it('Custom Timeout for valid value 10 mins (600000 ms)',
          function (done) {
            this.timeout(0);
            var pathToJson = process.cwd() + '/config.json';
            nconf.argv().env().file({file: pathToJson});
            nconf.load();
            projectId = nconf.get("shiptest-GITHUB_ORG_1:projectId");
            var shippable = new Shippable(config.apiToken);
            var update = {
              propertyBag: {
                timeoutMS: 600000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10 mins' +
                      '(600000 ms) projectId: %s failed with error: %s' +
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for valid value 10.5 mins (630000 ms)',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var update = {
              propertyBag: {
                timeoutMS: 630000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10.5 mins' +
                      '(630000 ms) projectId: %s failed with error: %s' +
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for invalid value 10000000 ms',
          function (done) {
            var shippable = new Shippable(config.apiToken);
            var update = {
              propertyBag: {
                timeoutMS: 10000000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  logger.debug('Failed to update Custom Timeout with' +
                    ' 10000000 ms value');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10000000 ms' +
                      'projectId: %s failed with error: %s' +
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
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
                function(err, res) {
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
