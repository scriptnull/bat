'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Edit email in accounts page';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2.accounts_editEmail - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
describe('Edit email with valid and invalid email address',
  function () {

    describe(testSuite,
      function () {

        it('Edit email with valid email address',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test@gmail.com' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test@gmail.com failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Edit email contains dot in the address field',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test.testt@gmail.com' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test.testt@gmail.com failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Edit Email contains dot with subdomain',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test@google.co.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test@google.co.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Plus sign is considered valid character',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test+testing@google.co.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test+testing@google.co.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Domain is valid IP address',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test+testing@123.123.123.123' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test+testing@123.123.123.123 failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Square bracket around IP address is considered valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test+testing@[123.123.123.123]' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test+testing@[123.123.123.123] failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Quotes around email is considered valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : '\"test"\@gmail.com' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: \"test"\@gmail.com failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Digits in address are valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test12345@gmail.com' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test12345@gmail.com failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Dash in domain name is valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test12345@google-co.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test12345@google-co.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Underscore in the address field is valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test_12345@yahoo.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test_12345@yahoo.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('.name is valid Top Level Domain name',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test_12345@rediff.mail' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test_12345@rediff.mail failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Dot in Top Level Domain name also considered valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test_12345@google.co.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test_12345@google.co.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Dash in address field is valid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'test-12345@google.co.in' },
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: test-12345@google.co.in failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  return done();
                } else {
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

        it('Missing @ sign and domain',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'plainaddress' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Missing @ sign and domain: plainaddress');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: plainaddress test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Garbage',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : '#@%^%#$@#$@#.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Garbage: #@%^%#$@#$@#.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: #@%^%#$@#$@#.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Missing username',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : '@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Missing username: @domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: @domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Encoded html within email is invalid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'Joe Smith <email@domain.com>' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Encoded html within email is invalid: Joe Smith <email@domain.com>');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: Joe Smith <email@domain.com> test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Missing @',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email.domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Missing @: email.domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email.domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Two @ sign',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@domain@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Two @ sign: email@domain@domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@domain@domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Leading dot in address is not allowed',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : '.email@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Leading dot in address is not allowed: .email@domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: .email@domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Trailing dot in address is not allowed',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email.@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Trailing dot in address is not allowed: email.@domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email.@domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Multiple dots',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email..email@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Multiple dots: email..email@domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email..email@domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Unicode char as address',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'あいうえお@domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Unicode char as address: あいうえお@domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: あいうえお@domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Text followed email is not allowed',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@domain.com (Joe Smith)' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Text followed email is not allowed: email@domain.com (Joe Smith)');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@domain.com (Joe Smith) test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Missing top level domain (.com/.net/.org/etc)',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@domain' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Missing top level domain (.com/.net/.org/etc): email@domain');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@domain test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Leading dash in front of domain is invalid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@-domain.com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Leading dash in front of domain is invalid: email@-domain.com');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@-domain.com test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('.web is not a valid top level domain',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@domain.web' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId .web is not a valid top level domain: email@domain.web');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@domain.web test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Invalid IP format',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@111.222.333.44444' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Invalid IP format: email@111.222.333.44444');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@111.222.333.44444 test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );

        it('Multiple dot in the domain portion is invalid',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
              '', { defaultEmail : 'email@domain..com' },
              function(err) {
                if (err) {
                  logger.debug('Failed to update emailId Invalid IP format: email@111.222.333.44444');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('%s: email@111.222.333.44444 test case failed',
                      testSuite);
                  testCaseErrors.push(testCase);
                  return done();
                }
              }
            );
          }
        );
      }
    );

    it('Edit email with actual email address',
      function (done) {
        this.timeout(0);
        var shippable = new Shippable(config.apiToken);

        shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
          '', { defaultEmail : 'shippabletowner+sub-o-org-o@gmail.com' },
          function(err) {
            if (err) {
              isTestFailed = true;
              var testCase =
                util.format('%s: with actual email address failed with error: %s',
                  testSuite, err);
              testCaseErrors.push(testCase);
              return done();
            } else {
              return done();
            }
          }
        );
      }
    );

    it('Creating Github Issue if test cases failed',
      function (done) {
        this.timeout(0);
        if (isTestFailed) {
          var githubAdapter = new adapter(config.githubToken, config.githubUrl);
          var title = util.format('Failed test suite %s', bag.testSuite);
          var body = util.format('Failed test cases are:%s',testCaseErrors);
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
