'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Account Integrations';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];

describe(testSuite,
  function () {

    var accountIntegrationIds = [];
    describe('Getting list of AccountIntegartions',
      function () {
        it('Get List of AccountIntegartions',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getAccountIntegrations('',
              function(err, accInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Get List of AccountIntegartions failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(accInts,
                    function (accInt) {
                      accountIntegrationIds.push(accInt.id);
                    }
                  );
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('delete AccountIntegrations',
      function () {
        it('delete AccountIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(accountIntegrationIds,
              function(accIntId, nextAccIntId) {
                shippable.deleteAccountIntegrationById(accIntId,
                  function(err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete AccountIntegration for id: %s failed with error: %s',
                          testSuite, accIntId, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextAccIntId();
                    } else {
                      return nextAccIntId();
                    }
                  }
                );
              },
              function (err) {
                if (err)
                  console.log("Failed");
                return done();
              }
            );
          }
        );
      }
    );

    describe('Create GitHub issue if failed',
      function () {
        it('Creating Github Issue if test cases failed',
          function (done) {
            this.timeout(0);
            if (isTestFailed) {
              var githubAdapter = new adapter(config.githubToken, config.githubUrl);
              var title = util.format('Failed test suite %s', testSuite);
              var body = util.format('Failed test cases are:\n%s',testCaseErrors);
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
