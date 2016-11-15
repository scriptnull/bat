'use strict';

var start = require('../../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var chaiHttp = require('chai-http');
var testSuiteNum = '0.';
var testSuiteDesc = 'Setup empty testAccounts objects';
var adapter = require('../../_common/shippable/github/Adapter.js');

chai.use(chaiHttp);
var assert = chai.assert;

describe(util.format('%s1 - %s', testSuiteNum, testSuiteDesc),
  function () {

    before(function(done) {
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
        var apiToken = util.format('apiToken %s', config.apiToken);
        chai.request(config.apiUrl)
          .get('/accounts')
          .set('Authorization', apiToken)
          .end(function(err, res){
             logger.debug("res is::", util.inspect(res.body,{depth:null}));
             if (res.status<200 || res.status>=299)
               logger.warn("status is::",res.status);
             return done();
          }
        );
      }
    );
  }
);
