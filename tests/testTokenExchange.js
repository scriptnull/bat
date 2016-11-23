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

    nconf.argv().env().file({
        file: './config.json', format: nconf.formats.json
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
    };

    before(function(done) {
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
              return nextToken(err);
            } else {
              bag.body = body;
              token.apiToken = body.apiToken;
              return nextToken();
            }
          });
        },
        function (err) {
          if (err)
            console.log("Failed");
          return done(err);
        }
      );
    });

    it('Should save tokens in config file',
      function (done) {
        nconf.set('shiptest-github-owner:apiToken',tokens.owner.apiToken);
        nconf.set('shiptest-github-member:apiToken',tokens.member.apiToken);
        nconf.save(function (err) {
          if (err)
            console.log("Failed");
          return done();
        });
      }
    );
  }
);
