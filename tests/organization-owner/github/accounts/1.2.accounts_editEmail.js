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

var testSuite = util.format('%s2.accounts_editEmail - %s', testSuiteNum,
                  testSuiteDesc);

describe('Edit email with valid email address',
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
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Missing @ sign and domain: plainaddress"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  assert.notEqual(err, null);
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Garbage: #@%^%#$@#$@#.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Missing username: @domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Encoded html within email is invalid: Joe Smith <email@domain.com>"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Missing @: email.domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Two @ sign: email@domain@domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Leading dot in address is not allowed: .email@domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Trailing dot in address is not allowed: email.@domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Multiple dots: email..email@domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Unicode char as address: あいうえお@domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Text followed email is not allowed: email@domain.com (Joe Smith)"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Missing top level domain (.com/.net/.org/etc): email@domain"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Leading dash in front of domain is invalid: email@-domain.com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: ".web is not a valid top level domain: email@domain.web"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Invalid IP format: email@111.222.333.44444"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
                  logger.debug('Failed to update emailId Multiple dot in the domain portion is invalid: email@domain..com');
                } else {
                  var bag = {
                    testSuite: testSuite,
                    error: err,
                    testCase: "Multiple dot in the domain portion is invalid: email@domain..com"
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                        return done(err);
                      } else {
                        logger.debug('Issue Created');
                      }
                    }
                  );
                  return done();
                }
                return done();
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
              var bag = {
                testSuite: testSuite,
                error: err,
                testCase: 'give actual email address'
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
