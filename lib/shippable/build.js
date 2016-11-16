'use strict';

var _ = require('underscore'),
    util = require('util');

module.exports = Build;

function Build(data, helper) {
  var self = this;
  _.extend(this, data);

  this.loadDetails = function(callback) {
    var url = util.format('/builds/%s', this.id);
    helper.get(url, function(err, data) {
      if (!err) {
        _.extend(self, data);
      }
      callback(err, self);
    });
  };
}

