'use strict';

var request = require('request'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name:
      'requesthelper' }),
    _ = require('underscore');

module.exports = RequestHelper;

function RequestHelper(apiEndpoint, apiToken, log) {
  function _merge(opts) {
    opts.url = apiEndpoint + opts.url;
    return _.extend(opts, {
      headers: {
        'Authorization': 'apiToken: ' + apiToken
      },
      json: true
    });
  }

  function makeRequest(opts, callback) {
    opts = _merge(opts);
    request[opts.method](opts, function(err, res, body) {
      if (!err) {
        //log.debug('API', opts.method, opts.url, 'returned', res.statusCode);
        if (res.statusCode > 299) {
          err = res.statusCode;
        }
      } else {
        //log.error('Error calling API', err);
      }
      callback(err, body);
    });
  }

  this.get = function(url, callback) {
    var opts = {
      method: 'get',
      url: url
    };

    return makeRequest(opts, callback);
  };

  this.post = function(url, body, callback) {
    var opts = {
      method: 'post',
      url: url,
      body: body
    };

    return makeRequest(opts, callback);
  };

  this.put = function(url, body, callback) {
    var opts = {
      method: 'put',
      url: url
    };

    return makeRequest(opts, callback);
  };

  this.delete = function(url, callback) {
    var opts = {
      method: 'del',
      url: url
    };

    return makeRequest(opts, callback);
  };
};
