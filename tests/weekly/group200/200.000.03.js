'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var bunyan = require('bunyan');
var logger = bunyan.createLogger(
  {name: 'TestCase 200.000.03: Create an account via ' +
  'token exchange for shipayefive'});
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var assert = chai.assert;

describe('200.000.03: Create an account via token exchange for shipayefive',
 function() {
  nconf.argv().env()
  .file({ file: '../../../config', format: nconf.formats.json});
  nconf.load();

  this.timeout(0);

  it('Should exchange tokens for bitbucket/shipayefive (test account 5)',
   function(done) {
    var apiEndpoint = nconf.get('apiEndpoint');
    var bitbucketToken;

    if (apiEndpoint.toLowerCase().indexOf('localhost') !== -1) {
      bitbucketToken = 'YjL8VALTfqxqNb9J9J|H894ETXfeG3MzUf8jMJL588mm9CLmvNp';
    } else {
      bitbucketToken = 'XycNxgAEwcPHLNw9Fs|YEU4zamVpSJvQa25f5N7sg7U3H8uJ2X2';
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
      logger.info('Creating account for shipayefive');
      nconf.set('testAccounts:shipayefive', res.body);
      nconf.set('testAccounts:shipayefive:providerToken', bitbucketToken);

      assert.equal(err, null);
      assert.equal(res.status, 200);
      assert.equal(res.body.account.identities[0].userName, 'shipayefive');
      done();
    });
  });
});
