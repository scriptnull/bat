'use strict';

var Start = require('../../../../test.js');
var nconf = require('nconf');

describe('Setup for accounts',
  function () {
    var pathToJson = process.cwd() + '/config.json';

    nconf.argv().env().file({file: pathToJson});
    nconf.load();

    it('Should start setup',
      function (done) {
        this.timeout(0);
        // TODO: analyse Start and remove this block if not needed.
        new Start(nconf.get('shiptest-github-owner:apiToken'),
                  nconf.get('GITHUB_ACCESS_TOKEN_OWNER'));
        logger.debug('setup is done');
        return done();
      }
    );
  }
);
