'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '1.1.1: Create an account via token exchange for shipayeone'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('1.1.1: Creating Accounts via Token Exchange', function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  var apiEndpoint = nconf.get('apiEndpoint');

  this.timeout(0);

  it('Should exchange tokens for github/shipayeone (test account 1)', function(done) {
    var githubToken = '143a61ab39d2c3275a2142395743f61f1019ba97';
    var requestObj = JSON.stringify({
      accessToken: githubToken,
      scopes: ["read:org", "repo", "user:email", "write:repo_hook"],
      profile: undefined
    });

    chai.request(apiEndpoint)
    .post('/account/getAccountByGithubToken')
    .set({'Content-Type': 'application/json'})
    .send(requestObj)
    .end(function(err, res) {
      logger.info('Creating account for shipayeone');
      nconf.set('testAccounts:shipayeone', res.body);
      nconf.set('testAccounts:shipayeone:providerToken', githubToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipayeone');
      done();
    });
  });
});
