'use strict';
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

/**
 * @param {string} productID - Product ID for which review has been submitted
 * @returns {Object} - review object for productID
 */
function getReviews(productID) {
    var reviewObject = CustomObjectMgr.getCustomObject('reviews', productID);
    if (reviewObject != null) {
        return reviewObject.custom.review_details ? JSON.parse(reviewObject.custom.review_details) : null;
    }
    return null;
}

/**
 * @param {Object} review - Review object containing rating, review text, orderNo
 * @param {string} productID - Product ID for which review has been submitted
 */
function updateReview(review, productID) {
    var reviewObject = CustomObjectMgr.getCustomObject('reviews', productID);
    if (reviewObject != null) {
        Transaction.wrap(function () {
            reviewObject.custom.review_details = JSON.stringify(review);
        });
    }
}

/**
 * @param {Object} review - Review object containing rating, review text, orderNo
 * @param {string} productID - Product ID for which review has been submitted
 */
function addReview(review, productID) {
    Transaction.wrap(function () {
        var reviewObject = CustomObjectMgr.createCustomObject('reviews', productID);
        if (reviewObject != null) {
            reviewObject.custom.review_details = JSON.stringify(review);
        }
    });
}

/**
 * @param {Object} order - Order object
 */
function updateOrder(order) {
    var isAllItemsReviewed = true;
    var i;

    for (i = 0; i < order.getAllProductLineItems().length; i++) {
        if (!order.allProductLineItems[i].custom.reviewed) {
            isAllItemsReviewed = false;
            break;
        }
    }

    if (isAllItemsReviewed) {
        Transaction.wrap(function () {
            order.custom.reviewed = true;
        });
    }
}

/**
 * @param {string} orderNo - Order No for which review has been submitted
 * @param {string} lineItemID - Product Line Item ID for which review has been submitted
 */
function updateLineItem(orderNo, lineItemID) {
    var orderMgr = require('dw/order/OrderMgr');
    var order = orderMgr.getOrder(orderNo);

    Transaction.wrap(function () {
        var orderLineItem = order.getAllProductLineItems(lineItemID);
        orderLineItem[0].custom.reviewed = true;
    });

    updateOrder(order);
}

/**
 * @param {Object} reviews - Review object containing rating, review text, orderNo
 * @param {string} sortBy - sort by review
 * @returns {Object} reviews - Review object containing rating, review text, orderNo
 */
function sortReviews(reviews, sortBy) {
    var i = '';
    var j = '';
    var temp = '';
    if (sortBy === 'highestrated') {
        for (i = 0; i < reviews.length; i++) {
            for (j = 0; j < i; j++) {
                if (reviews[i].rating > reviews[j].rating) {
                    temp = reviews[i];
                    reviews[i] = reviews[j];
                    reviews[j] = temp;
                }
            }
        }
    } else if (sortBy === 'lowestrated') {
        for (i = 0; i < reviews.length; i++) {
            for (j = 0; j < i; j++) {
                if (reviews[i].rating < reviews[j].rating) {
                    temp = reviews[i];
                    reviews[i] = reviews[j];
                    reviews[j] = temp;
                }
            }
        }
    }
    return reviews;
}

module.exports = {
    getReviews: getReviews,
    updateReview: updateReview,
    addReview: addReview,
    updateLineItem: updateLineItem,
    sortReviews: sortReviews
};
