'use strict';

var base = module.superModule;
var productLineItemDecorators = require('*/cartridge/models/productLineItem/decorators/index');

/**
 * Decorate product with product line item information from within an order
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {Object} options - Options passed in from the factory
 * @property {Object} options.lineItemOptions - Options provided on the query string
 * @returns {Object} - Decorated product model
 */
function orderLineItem(product, apiProduct, options) {
    base.call(this, product, apiProduct, options);
    // productLineItemDecorators.custom(product, options.lineItem);
    productLineItemDecorators.review(product, options.lineItem);
    return product;
}

module.exports = orderLineItem;
