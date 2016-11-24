'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Edit email with valid email address';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2.accounts_editEmail_valid - %s', testSuiteNum,
                  testSuiteDesc);
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Edit email with valid email address: test@gmail.com'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Edit email contains dot in the address field: test.testt@gmail.com'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Edit Email contains dot with subdomain: test@google.co.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Plus sign is considered valid character: test+testing@google.co.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Domain is valid IP address: test+testing@123.123.123.123'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Square bracket around IP address is considered valid: test+testing@[123.123.123.123]'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Quotes around email is considered valid: \"test"\@gmail.com'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Digits in address are valid: test12345@gmail.com'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Dash in domain name is valid: test12345@google-co.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Underscore in the address field is valid: test_12345@yahoo.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: '.name is valid Top Level Domain name: test_12345@rediff.mail'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Dot in Top Level Domain name also considered valid: test_12345@google.co.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'Dash in address field is valid: test-12345@google.co.in'
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done(err);
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
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

function _createIssue(bag,next) {
  var githubAdapter = new adapter(config.githubToken, config.githubUrl);
  var title = util.format('Failed test case %s', bag.testSuite);
  var body = util.format('Failed test suite %s, test case %s, with error: %s',
               bag.testSuite, bag.testCase, bag.error);
  var data = {
    title: title,
    body: body
  }
  githubAdapter.pushRespositoryIssue('deepikasl', 'VT1', data,
    function(err, res) {
      if (err)
        logger.warn("Creating Issue failed with error: ", err);
      return next();
    }
  );
}
