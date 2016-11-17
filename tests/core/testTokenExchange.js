'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');

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
      request({
        url: 'https://alphaapi.shippable.com/accounts/auth/' + nconf.get("githubSysIntId"),
        method: 'POST',
        json: {
          "accessToken": nconf.get("accessToken")
        }
      },
      function (err, res, body) {
        if (err) {
          console.log("Failed");
        } else {
          bag.body = body;
          nconf.set('apiToken',body.apiToken);
          nconf.save(function(err){
            if (err)
              console.log("Failed");
          });
        }
        return done();
      });
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
