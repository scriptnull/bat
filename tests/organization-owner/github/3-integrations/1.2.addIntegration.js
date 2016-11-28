var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add Integrations';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];

var accountIntegrations = [];
var subscriptionId = '';
describe('Add Integrations',
  function () {

    describe(testSuite,
      function () {
        it('Add Gitlab AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-gitlab";
            var token = nconf.get("GITLAB_ACCESS_TOKEN");
            var url = "https://gitlab.com/api/v3";
            var body = {
              "masterDisplayName": "GitLab",
              "masterIntegrationId": "5728e13b3d93990c000fd8e4",
              "masterName": "gitlab",
              "masterType": "scm",
              "name": name,
              "formJSONValues": [
                {
                  "label": "token",
                  "value": token
                },
                {
                  "label": "url",
                  "value": url
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Add gitlab integration: %s, failed with error: %s',
                      name, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe(testSuite,
      function () {

        it('Organization-Owner-github-getSubscription',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = util.format('orgNames=%s',nconf.get("GITHUB_ORG_1"));
            shippable.getSubscriptions(query,
              function(err, subscriptions) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Get subscriptions, failed with error: %s',
                      name, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (subscriptions.status<200 || subscriptions.status>=299)
                    logger.warn("status is::",subscriptions.status);
                  subscriptionId = _.first(subscriptions).id;
                  return done();
                }
              }
            );
          }
        );

        it('Add Gitlab subscriptionIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            async.each(accountIntegrations,
              function (accInt, nextAccInt) {
                var body = {
                  "accountIntegrationId": accInt.id,
                  "subscriptionId": subscriptionId,
                  "name": accInt.name,
                  "propertyBag": {
                    "enabledByUserName": nconf.get("GITHUB_ORG_1"),
                    "accountIntegrationName": accInt.name
                  }
                };
                shippable.postSubscriptionIntegration(body,
                  function(err,res) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: Add gitlab subscription integration: %s, failed with error: %s',
                          name, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextAccInt();
                    } else {
                      logger.debug('Added subscription integration');
                      return nextAccInt();
                    }
                  }
                );
            });
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
