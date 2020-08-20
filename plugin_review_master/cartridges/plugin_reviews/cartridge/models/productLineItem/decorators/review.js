'use strict';

/**
 * Decorate product with full product information
 * @param {Object} object - Product Model to be decorated
 * @param {Object} lineItems - Options provided on the query string
 * @param {Object} - Decorated product model
*/
function review(object, lineItems) {
    Object.defineProperty(object, 'reviewed', {
        enumerable: true,
        value: lineItems.custom.reviewed
    });
}

module.exports = review;
