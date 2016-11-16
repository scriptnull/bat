'use strict';

var start = require('../../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var chaiHttp = require('chai-http');
var testSuiteNum = '0.';
var testSuiteDesc = 'Setup empty testAccounts objects';
var adapter = require('../../_common/shippable/github/Adapter.js');

var assert = chai.assert;

describe(util.format('%s1 - %s', testSuiteNum, testSuiteDesc),
  function () {

    before(function(done) {
      // runs before all tests in this block
      chai.use(chaiHttp);
      start = new start();
      nconf.argv().env().file({
          file: '../config.json', format: nconf.formats.json
        }
      );
      nconf.load();
      return done();
    });

    it('Should create an empty testAccounts object',
      function (done) {
        logger.info('Creating an empty testAccounts object');
        nconf.set('testAccounts', {});
        assert.notProperty(nconf.get('testAccounts'), 'shipayeone');

        return done();
      }
    );

    it('Get Accounts',
      function (done) {
        this.timeout(15000);
        setTimeout(done, 15000);
        var apiToken = util.format('apiToken %s', config.apiToken);
        chai.request(config.apiUrl)
          .get('/accounts')
          .set('Authorization', apiToken)
          .end(function(err, res){
            if (err) {
              var bag = {
                testSuite: 'Get Accounts',
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
              logger.debug("res is::", util.inspect(res.body,{depth:null}));
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
