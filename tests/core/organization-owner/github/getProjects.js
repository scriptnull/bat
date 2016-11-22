'use strict';

var start = require('../../../../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var testSuiteNum = '1.';
var testSuiteDesc = 'Get Projects of Organization owner';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');
var _ = require('underscore');

var assert = chai.assert;

describe(util.format('%s1 - %s', testSuiteNum, testSuiteDesc),
  function () {

    before(function(done) {
      // runs before all tests in this block
      nconf.argv().env().file({
          file: '../../../config.json', format: nconf.formats.json
        }
      );
      nconf.load();
      start = new start(nconf.get("shiptest-github-owner:apiToken"));
      return done();
    });

    it('Get /projects',
      function (done) {
        this.timeout(0);
        var shippable = new Shippable(config.apiToken);
        var query = util.format("subscriptionIds=%s",nconf.get("shiptest-github-owner:org-o-subId-gh"));
        shippable.getProjects(query,
          function(err, res) {
            if (err) {
              var bag = {
                testSuite: 'Get /projects of Organization owner',
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
              logger.debug("res is::", util.inspect(res.length,{depth:null}));
              if (res.status<200 || res.status>=299)
                logger.warn("status is::",res.status);
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
  var body = util.format('Failed with error: %s', bag.error);
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
