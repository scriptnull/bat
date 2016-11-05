'use strict';

global.util = require('util');
global._ = require('underscore');
global.async = require('async');

var who = util.format('BAT');
logger.info(util.format('Starting %s', who));

global.msName = who;
process.title = who;
global.config = {};

global.config.apiUrl = process.env.API_URL;
global.config.apiToken = process.env.API_TOKEN;

var consoleErrors = [];

if (!global.config.apiUrl)
  consoleErrors.push(util.format('%s is missing env var: API_URL', who));

if (!global.config.apiToken)
  consoleErrors.push(util.format('%s is missing env var: API_TOKEN', who));

if (consoleErrors.length > 0) {
  _.each(consoleErrors,
    function (err) {
      logger.error(who, err);
    }
  );
  return process.exit(1);
}

logger.info(util.format('system config checks for %s succeeded', who));

var shippableAdapter = new Adapter(config.apiToken);
shippableAdapter.getAccounts(
  function (err, accounts) {
  logger.info(accounts);
  }
);
