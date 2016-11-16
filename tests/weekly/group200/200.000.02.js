'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '200.000.02: Create an account via token exchange for shipaye2'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('200.000.02: Creating Accounts via Token Exchange', function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  var apiEndpoint = nconf.get('apiEndpoint');

  this.timeout(0);

  it('Should exchange tokens for github/shipaye2 (test account 2)', function(done) {
    var githubToken = '51d84e38717b2a18d4755f98b6f1b62eab433952';
    var requestObj = JSON.stringify({
      accessToken: githubToken,
      scopes: ["read:org", "repo:status", "repo_deployment", "user:email", "write:repo_hook"],
      profile: undefined
    });

    chai.request(apiEndpoint)
    .post('/account/getAccountByGithubToken')
    .set({'Content-Type': 'application/json'})
    .send(requestObj)
    .end(function(err, res) {
      logger.info('Creating account for shipaye2');
      nconf.set('testAccounts:shipaye2', res.body);
      nconf.set('testAccounts:shipaye2:providerToken', githubToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipaye2');
      done();
    });
  });
});
