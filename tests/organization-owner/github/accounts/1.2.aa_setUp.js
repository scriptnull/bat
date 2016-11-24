'use strict';

var start = require('../../../../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');
var _ = require('underscore');

var assert = chai.assert;

describe('Setup for accounts',
  function () {
    var pathToJson = process.cwd() + '/config.json';

    nconf.argv().env().file({file: pathToJson});
    nconf.load();

    it('Should start setup',
      function (done) {
        start = new start(nconf.get("shiptest-github-owner:apiToken"),
                  nconf.get("GITHUB_ACCESS_TOKEN_OWNER"));
        logger.debug("setup is done");
      }
    );
  }
);
