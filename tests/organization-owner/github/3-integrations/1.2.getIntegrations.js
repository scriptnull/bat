'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Get Integrations';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var accountIntegrationIds = [];
var subIntegrationIds = [];
var accountIntegrations = [];

describe(testSuite,
  function () {

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
                  accountIntegrations = accInts;
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('Edit account Integrations',
      function () {
        it('Edit Gitlab Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations, {name:"OrgOwner-gitlab"});
            __setFormJSONValue(body.formJSONValues, 'token', 'token');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Get Edit Gitlab Account Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  console.log('Edited Integration', res);
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('Getting the list of subscriptionIntegrations',
      function () {
        it('Get the list of subscriptionIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getSubscriptionIntegrations('',
              function (err, subInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Get list of SubscriptionIntegrations failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(subInts,
                    function (subInt) {
                      subIntegrationIds.push(subInt.id);
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

    describe('delete AccountIntegrations With Dependencies',
      function () {
        it('delete AccountIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(accountIntegrationIds,
              function(accIntId, nextAccIntId) {
                shippable.deleteAccountIntegrationById(accIntId,
                  function(err) {
                    if (err) {
                      return nextAccIntId();
                    } else {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete AccountIntegrations With Dependencies failed',
                          testSuite, accIntId);
                      testCaseErrors.push(testCase);
                      assert.notEqual(err, null);
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

    describe('Delete subscriptionIntegrations',
      function () {
        it('Delete SubscriptionIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(subIntegrationIds,
              function (subIntId, nextSubIntId) {
                shippable.deleteSubscriptionIntegrationById(subIntId,
                  function (err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete SubscriptionIntegration for id: %s failed with error: %s',
                          testSuite, accIntId, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextSubIntId();
                    } else {
                      return nextSubIntId();
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

function __setFormJSONValue(formJSONArray, label, value) {
  var formJSONObj = _.findWhere(formJSONArray,
    { label : label });
  if (!formJSONObj)
    formJSONArray.push({
      label : label,
      value : value
    });
  else
    formJSONObj.value = value;
}
