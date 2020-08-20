'use strict';

var reviewObject;

/**
 * Decorate product with full product information
 * @param {string} productID - object passed
 * @return {Object} - Decorated reviews model
 */
function getReviews(productID) {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    reviewObject = CustomObjectMgr.getCustomObject('reviews', productID);
    if (reviewObject != null && (reviewObject.custom.review_details !== '')) {
        return reviewObject.custom.review_details ? JSON.parse(reviewObject.custom.review_details) : null;
    }
    return null;
}

/**
 * @return {number} productRating - product rating
 */
function getRating() {
    var productRating = 0;
    if (reviewObject) {
        var ratings = JSON.parse(reviewObject.custom.review_details);
        if (ratings) {
            for (var i = 0; i < ratings.length; i++) {
                productRating += Number(ratings[i].rating);
            }
            return productRating / ratings.length;
        }
    }
    return productRating;
}

/**
 * Decorate product with full product information
 * @param {Object} object - Product Model to be decorated
 * @param {Object} product - object passed
 * @param {Object} - Decorated product model
 */
function custom(object, product) {
    Object.defineProperty(object, 'reviews', {
        enumerable: true,
        value: getReviews(product.getID().toString())
    });

    Object.defineProperty(object, 'ratings', {
        enumerable: true,
        value: getRating(product.getID().toString())
    });
}

module.exports = custom;
