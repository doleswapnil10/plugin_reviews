'use strict';

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

server.extend(module.superModule);

server.append('Show', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var context = res.getViewData();
    var productId = context.product.id;
    var productRating = 0;
    var getCustomObject = CustomObjectMgr.getCustomObject('reviews', productId);
    if (getCustomObject != null) {
        var productReviewslist = getCustomObject.custom.review_details;
        var productReview = JSON.parse(productReviewslist);
        if (productReview) {
            for (var i = 0; i < productReview.length; i++) {
                productRating += productReview[i].rating;
            }
            var averageRating = productRating / productReview.length;
            context.product.productRating = averageRating;
        }
    }
    res.setViewData(context);
    next();
});

module.exports = server.exports();
