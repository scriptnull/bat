'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: 'TestCase 1.1.6: Create an account via token exchange for shipaye6'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('1.1.6: Create an account via token exchange for shipayefive', function() {
  nconf.argv().env().file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  this.timeout(0);

  it('Should exchange tokens for bitbucket/shipaye6 (test account 6)', function(done) {
    var apiEndpoint = nconf.get('apiEndpoint');
    var bitbucketToken;

    if (apiEndpoint.toLowerCase().indexOf('localhost') !== -1) {
      bitbucketToken = 'dTH8esbwvjdy94mxBz|ntXuF2fykgWrGqqTkzqKDMzHjtXD563J';
    } else {
      bitbucketToken = 'z8W5NhUZJNpSecHG9J|dRkxVPjPUWj9wZfk9aCq4cssmPhLPSQP';
    }

    var requestObj = JSON.stringify({
      accessToken: bitbucketToken,
      scopes: [],
      profile: undefined
    });

    chai.request(apiEndpoint)
    .post('/account/getAccountByBitbucketToken')
    .set({'Content-Type': 'application/json'})
    .send(requestObj)
    .end(function(err, res) {
      logger.info('Creating account for shipaye6');
      nconf.set('testAccounts:shipaye6', res.body);
      nconf.set('testAccounts:shipaye6:providerToken', bitbucketToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipaye6');
      done();
    });
  });
});
