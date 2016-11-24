'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Edit email with invalid email address';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2.accounts_editEmail_invalid - %s', testSuiteNum,
  testSuiteDesc);

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
              return done();
            }
            return done();
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

function _createIssue(bag,next) {
  var githubAdapter = new adapter(config.githubToken, config.githubUrl);
  var title = util.format('Failed test case %s', bag.testSuite);
  var body = util.format('Failed test case %s, test case %s, with error: %s',
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
