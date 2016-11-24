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

    it('Edit email with invalid email address',
      function (done) {
        this.timeout(0);
        var shippable = new Shippable(config.apiToken);

        shippable.putAccountById(nconf.get("shiptest-github-owner:accountId"),
          '', { defaultEmail : 'testatgmail.com' },
          function(err) {
            if (err) {
              logger.debug('Failed to update emailId with a invalid mailId');
            } else {
              var bag = {
                testSuite: testSuite,
                error: "Updates account with invalid mailId: testatgmail.com"
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
          }
        );
      }
    );
  }
);

function _createIssue(bag,next) {
  var githubAdapter = new adapter(config.githubToken, config.githubUrl);
  var title = util.format('Failed test case %s', bag.testSuite);
  var body = util.format('Failed test case %s, with error: %s',  bag.testSuite,
    bag.error);
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
