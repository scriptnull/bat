'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'subscription settings encrypt';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';

describe(testSuite,
  function () {

    describe('Encrypt',
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
                      testSuiteDesc, name, err);
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

        it('Enter encrypt value with alphabets and encrypt',
          function (done) {
            this.timeout(0);

            var bag = {
              body: {
                clearText : 'ThisIsToTestEncryptionOfJustAlphabets'
              },
              json : {
                value : ''
              },
              testCase : 'encrypt value with alphabets',
              decryptedText: ''
            };

            async.series([
                _encryptText.bind(null, bag),
                _decryptText.bind(null, bag)
              ],
              function (err) {
                if (err) {
                  logger.error('Failed', err);
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: %s failed with error: %s',
                      testSuite, bag.testCase, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                } else if (bag.decryptedText !== bag.body.clearText) {
                  logger.error('Failed');
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: clearText and decrypted value not equal: %s',
                      testSuite, bag.body.clearText, err);
                  testCaseErrors.push(testCase);
                  assert.equal(bag.decryptedText, bag.body.clearText);
                }
                else
                  logger.verbose('Successful');

                return callback(err);
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

function _encryptText(bag, next) {
  var shippable = new Shippable(config.apiToken);

  shippable.encryptBySubscriptionId(subscriptionId, bag.body,
    function(err, encryptedText) {
      if (err) {
        logger.warn('Encrypt failed for:', bag.body.clearText);
        return next();
      } else {
        console.log('Encrypted',encryptedText);
        bag.json.value = encryptedText.encryptText;
        console.log("bag.json is::",util.inspect(bag.json,{depth:null}));
        return next();
      }
    }
  );

}

function _decryptText(bag, next) {
  var shippable = new Shippable(config.apiToken);

  shippable.decryptBySubscriptionId(subscriptionId, bag.json,
    function(err, decryptedText) {
      if (err) {
        logger.warn('Decrypt failed for:', bag.body.clearText);
        return next();
      } else {
        console.log('Decrypted',decryptedText);
        bag.decryptedText = decryptedText.encryptText;
        return next();
      }
    }
  );

}
