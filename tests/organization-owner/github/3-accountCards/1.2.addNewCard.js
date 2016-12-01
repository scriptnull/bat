/*'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var braintree = require('braintree');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add Account Cards';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');
var braintreeAdapter =
  require('../../../../_common/shippable/braintreeAdapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var braintreeClient = '';

describe('Add Account Cards',
  function () {

    describe('Adds Vaild Account Cards',
      function () {
        before(function (done) {
          this.timeout(0);
          var bag = {
            braintreeAdapter: ''
          };
          async.series([
            _createBraintreeConnection.bind(null, bag),
            _createBraintreeToken.bind(null, bag)
            ],
            function (err) {
              if (err)
                logger.warn("failed");
              else
                logger.debug("Created Braintree Token");
              return done();
            }
          );
        });

        it('Add a valid credit card details',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            braintreeClient.tokenizeCard(
              {
                number: "4111111111111111",
                expirationDate: "09/2020",
                cardholderName: "XYZ",
                cvv: "123",
                billingAddress: {
                  postalCode: "123456",
                  countryName: "India"
                }
              },
              function (err, nonce) {
                if (err)
                  logger.warn("Creating tokenizeCard failed");
                var body = {
                  nonce: nonce
                };
                shippable.postAccountCardWithCardNonce(body,
                  function (err, res) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: failed with error: %s',
                          testSuiteDesc, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                    } else {
                      console.log('Res',res);
                      logger.debug("Added Account Card");
                    }
                    return done();
                  }
                );
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

function _createBraintreeConnection(bag, next) {
  bag.braintreeAdapter = new braintreeAdapter(
    nconf.get("BRAINTREE_MERCHANT_ID"),
    nconf.get("BRAINTREE_PUBLIC_KEY"),
    nconf.get("BRAINTREE_PRIVATE_KEY"),
    nconf.get("BRAINTREE_ENVIRONMENT")
  );
  return next();
}

function _createBraintreeToken(bag, next) {
  bag.braintreeAdapter.generateClientToken(function (err, res) {
      braintreeClient = new braintree.api.Client({
        clientToken: res.clientToken
      });
      return next();
  });
}
*/
