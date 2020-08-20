'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var logger = require('dw/system/Logger').getLogger('Reviews', 'Reviews');

/**
 *
 * @param {Object} order - order object
 */
function sendReviewNotification(order) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Resource = require('dw/web/Resource');
    var Site = require('dw/system/Site');

    var emailObj = {
        to: order.customerEmail,
        subject: Resource.msg('subject.order.confirmation.email', 'review', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'review/reviewLink', { order: order });
}

module.exports.sendNotification = function () {
    try {
        var query = 'custom.reviewed={0} or custom.reviewed={1} and shippingStatus={2}';
        var ordersIterator = OrderMgr.searchOrders(query, 'orderNo ASC', false, null, Order.SHIPPING_STATUS_SHIPPED);
        if (ordersIterator.getCount() === 0) {
            logger.debug('No orders found.');
            return;
        }
        while (ordersIterator.hasNext()) {
            var order = ordersIterator.next();
            sendReviewNotification(order);
        }
    } catch (e) {
        logger.error(e);
    }
};
