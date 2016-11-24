'use strict';

var start = require('../../../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var testSuiteNum = '1.';
var testSuiteDesc = 'Organization-Owner-github-getSubscriptions';
var adapter = require('../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../_common/shippable/Adapter.js');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var assert = chai.assert;

var testSuite = util.format('%s1 - %s', testSuiteNum, testSuiteDesc);
describe(testSuite,
  function () {
    before(function(done) {
      // runs before all tests in this block

      var pathToJson = path.resolve(__dirname, '../config.json');
      console.log("path is::",pathToJson);

      nconf.argv().env().file(
         path.resolve(__dirname, '../config.json'));
      nconf.load();
      console.log("nconf",nconf);
      start = new start(nconf.get("shiptest-github-owner:apiToken"),
                nconf.get("GITHUB_ACCESS_TOKEN_OWNER"));
      return done();
    });

    it('Organization-Owner-github-getSubscriptions',
      function (done) {
        this.timeout(0);
        var shippable = new Shippable(config.apiToken);
        shippable.getSubscriptions('',
          function(err, subscriptions) {
            if (err) {
              var bag = {
                testSuite: testSuite,
                error: err
              }
              async.series([
                  _createIssue.bind(null, bag)
                ],
                function (err) {
                  if (err) {
                    logger.warn('Failed');
                    return done();
                  }
                  else {
                    logger.debug('Issue Created');
                    return done();
                  }
                }
              );
            } else {
              logger.debug("subscriptions length is::",subscriptions.length);
              if (subscriptions.status<200 || subscriptions.status>=299)
                logger.warn("status is::",subscriptions.status);
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
      logger.debug("response is::",res.status);
      if (err)
        logger.warn("Creating Issue failed with error: ", err);
      return next();
    }
  );
}
