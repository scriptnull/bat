'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: '1.1.4: Create an account via token exchange for shipaye4'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('1.1.4: Creating Accounts via Token Exchange', function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  var apiEndpoint = nconf.get('apiEndpoint');

  this.timeout(0);

  it('Should exchange tokens for github/shipaye4 (test account 4)', function(done) {
    var githubToken = 'fa0407127c3f6d396346778ba27a5bfd113853d4';
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
      logger.info('Creating account for shipaye4');
      nconf.set('testAccounts:shipaye4', res.body);
      nconf.set('testAccounts:shipaye4:providerToken', githubToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipaye4');
      done();
    });
  });
});
