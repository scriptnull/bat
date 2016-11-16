'use strict';

module.exports = Account;

var _ = require('underscore'),
    util = require('util'),
    Subscription = require('./subscription.js');

function Account(data, helper) {
  _.extend(this, data);

  this.getSubscriptions = function(callback) {
    var url = util.format('/accounts/%s/subscriptions', this.id);
    helper.get(url, function(err, subscriptionsData) {
      var subs = [];
      if (!err) {
        subscriptionsData.forEach(function(subscriptionData) {
          subs.push(new Subscription(subscriptionData, helper));
        });
      }

      callback(err, subs);
    });
  };

  this.getAccountSettings = function (callback) {
    var url = util.format('/accounts/%s/settings', this.id);
    helper.get(url, function(err, settings) {
      callback(err, settings);
    });
  };

  this.deleteAccount = function(callback) {
    var url = util.format('/accounts/%s', this.id);
    helper.delete(url, function(err, message) {
      callback(err, message);
    });
  };
}
