'use strict';

var self = BraintreeAdapter;
module.exports = self;
var _ = require('underscore');

var braintree = require('braintree');

function BraintreeAdapter(braintreeMerchantId, braintreePublicKey,
                          braintreePrivateKey, braintreeEnvironment) {

  var env = {};
  if (braintreeEnvironment === 'Sandbox')
    env = braintree.Environment.Sandbox;
  else
    env = braintree.Environment[braintreeEnvironment];

  this.client = braintree.connect({
    environment: env,
    merchantId: braintreeMerchantId,
    publicKey: braintreePublicKey,
    privateKey: braintreePrivateKey
  });
}

BraintreeAdapter.prototype.findCustomer = function (accountId, callback) {
  this.client.customer.find(accountId, callback);
};

BraintreeAdapter.prototype.getDiscounts = function (callback) {
  this.client.discount.all(callback);
};

BraintreeAdapter.prototype.createCustomer = function (accountId, providerName,
  userName, callback) {

  if (!accountId) {
    return callback(
      new ActErr(ActErr.BraintreeError, 'No accountId supplied',
        this.createCustomer.name)
    );
  }

  if (!providerName) {
    return callback(
      new ActErr(ActErr.BraintreeError, 'No providerName supplied',
        this.createCustomer.name)
    );
  }

  if (!userName) {
    return callback(
      new ActErr(ActErr.BraintreeError, 'No userName supplied',
        this.createCustomer.name)
    );
  }

  this.client.customer.create({
    id: accountId,
    firstName: providerName,
    lastName: userName,
  }, callback);

};

BraintreeAdapter.prototype.createCreditCard = function (cardNonce, accountId, callback) {
  this.client.paymentMethod.create({
    customerId: accountId,
    paymentMethodNonce: cardNonce,
    options: {
      verifyCard: true,
      failOnDuplicatePaymentMethod: false
    }
  }, callback);
};

BraintreeAdapter.prototype.findCreditCard = function (cardToken, callback) {
  this.client.paymentMethod.find(cardToken, callback);
};

BraintreeAdapter.prototype.getPlans = function (callback) {
  this.client.plan.all(callback);
};

BraintreeAdapter.prototype.updateCreditCard = function (cardToken, cardNonce, callback) {
  this.client.paymentMethod.update(cardToken, {
    paymentMethodNonce: cardNonce
  }, callback);
};

BraintreeAdapter.prototype.deleteCreditCard = function (cardToken, callback) {
  this.client.paymentMethod.delete(cardToken, callback);
};

BraintreeAdapter.prototype.createSubscription =
  function (cardToken, planName, unitcount, pricePerUnit, discountCodes, callback) {
    var price = unitcount * pricePerUnit;
    if (!_.isEmpty(discountCodes)) {
      var discounts = {
        add: []
      };
      _.each(discountCodes,
        function(discountCode) {
          if (discountCode.action === 'add')
            discounts.add.push(
              {
                inherited_from_id : discountCode.id,
                // We apply the coupon on each minion bought by the customer
                quantity: discountCode.quantity
              }
            );
        }
      );
    }
    var body = {
      paymentMethodToken: cardToken,
      planId: planName,
      price: price
    };

    if (discounts)
      body.discounts = discounts;

    this.client.subscription.create(body, callback);
};

BraintreeAdapter.prototype.createSubscriptionWithTrial =
  function(cardToken, planName, price, trialDuration, trialDurationUnit,
  callback) {
    var trialPeriod = false;

    if (trialDuration > 0)
      trialPeriod = true;

    this.client.subscription.create({
      paymentMethodToken: cardToken,
      planId: planName,
      price: price,
      trialDuration: trialDuration || 0,
      trialDurationUnit: trialDurationUnit || 'day',
      trialPeriod: trialPeriod
    }, callback);
  };

BraintreeAdapter.prototype.getSubscription = function (subscriptionId, callback) {
  this.client.subscription.find(subscriptionId, callback);
};

BraintreeAdapter.prototype.cancelSubscription = function (subscriptionId, callback) {
  this.client.subscription.cancel(subscriptionId, callback);
};

BraintreeAdapter.prototype.generateClientToken = function (callback) {
  this.client.clientToken.generate({}, callback);
};

BraintreeAdapter.prototype.updateSubscriptionCardToken = function(id, cardToken,
  callback) {
    this.client.subscription.update(id, {
      paymentMethodToken: cardToken
    }, callback);
};

BraintreeAdapter.prototype.updateSubscription = function(id, cardToken, planName, unitCount, pricePerUnit,
  shouldProrate, discountCodes, callback) {
  var price = unitCount * pricePerUnit;
    if (!_.isEmpty(discountCodes)) {
      var discounts = {
        add: [],
        remove: [],
        update: []
      };
      _.each(discountCodes,
        function(discountCode) {
          if (discountCode.action === 'add')
            discounts.add.push(
              {
                inherited_from_id : discountCode.id,
                // We apply the coupon on each minion bought by the customer
                quantity: discountCode.quantity
              }
            );
          if (discountCode.action === 'remove')
            discounts.remove.push(discountCode.id);
          if (discountCode.action === 'update')
            discounts.update.push(
              {
                existingId : discountCode.id,
                quantity: discountCode.quantity
              }
            );
        }
      );
      if (_.isEmpty(discounts.add))
        delete discounts.add;
      if (_.isEmpty(discounts.remove))
        delete discounts.remove;
      if (_.isEmpty(discounts.udpate))
        delete discounts.udpate;
    }

    var body = {
      paymentMethodToken: cardToken,
      planId: planName,
      price: price,
      options: {
        prorateCharges: shouldProrate,
        revertSubscriptionOnProrationFailure: shouldProrate
      }
    };

    if (!_.isEmpty(discountCodes))
      body.discounts = discounts;
  this.client.subscription.update(id, body, callback);
};

BraintreeAdapter.prototype.verifyWebhookDestination = function (challenge) {
  return this.client.webhookNotification.verify(challenge);
};

BraintreeAdapter.prototype.parseWebhookPayload =
  function (signature, payload, callback) {
    this.client.webhookNotification.parse(signature, payload, callback);
};
