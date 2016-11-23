'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var async = require('async');

var assert = chai.assert;
var request = require('request');
var bag = {};

describe('Get shippable token',
  function () {
    this.timeout(0);
    before(function(done) {
      nconf.argv().env().file({
          file: '../config.json', format: nconf.formats.json
        }
      );
      nconf.load();
      var tokens = {
        "owner": {
          "githubToken": nconf.get("GITHUB_ACCESS_TOKEN_OWNER"),
          "apiToken": ""
        },
        "member": {
          "githubToken": nconf.get("GITHUB_ACCESS_TOKEN_MEMBER"),
          "apiToken": ""
        }
      }
      async.each(tokens,
        function(token, nextToken) {
          request({
            url: 'https://alphaapi.shippable.com/accounts/auth/' + nconf.get("GITHUB_SYSINTS_ID"),
            method: 'POST',
            json: {
              "accessToken": token.githubToken
            }
          },
          function (err, res, body) {
            if (err) {
              console.log("Failed");
            } else {
              bag.body = body;
              console.log("apiToken is:",body.apiToken);
            }
            return nextToken();
          });
        },
        function (err) {
          if (err)
            console.log("Failed");
          return done();
        }
      );
    });
    it('Should create an empty testAccounts object',
      function (done) {
        nconf.set('testAccounts', {});
        assert.notProperty(nconf.get('testAccounts'), 'shipayeone');
        return done();
      }
    );
  }
);
