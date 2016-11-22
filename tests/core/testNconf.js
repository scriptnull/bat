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
      console.log("api url",nconf.get("API_URL"));
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
