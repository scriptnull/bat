'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '1.1.3: Create an account via token exchange for shipaye3'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('1.1.3: Creating Accounts via Token Exchange', function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  var apiEndpoint = nconf.get('apiEndpoint');

  this.timeout(0);

  it('Should exchange tokens for github/shipaye3 (test account 3)', function(done) {
    var githubToken = 'f048922848f32e55daf389ed37afd46b187d2d6a';
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
      logger.info('Creating account for shipaye3');
      nconf.set('testAccounts:shipaye3', res.body);
      nconf.set('testAccounts:shipaye3:providerToken', githubToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipaye3');
      done();
    });
  });
});
