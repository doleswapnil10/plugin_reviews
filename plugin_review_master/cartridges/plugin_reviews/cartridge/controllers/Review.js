/**
* Description of the Controller and the logic it provides
*
* @module  controllers/Review
*/

'use strict';

var server = require('server');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var URLUtils = require('dw/web/URLUtils');
var Logger = require('dw/system/Logger').getLogger('Review');

server.get(
    'Show',
    server.middleware.https,
    consentTracking.consent,
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var OrderModel = require('*/cartridge/models/order');
        var Locale = require('dw/util/Locale');
        var order = OrderMgr.getOrder(req.querystring.orderNo);

        var addreviewratingForm = server.forms.getForm('addreviewrating');
        var orderModel;

        if (order) {
            var config = {
                numberOfLineItems: '*'
            };
            var currentLocale = Locale.getLocale(req.locale.id);
            orderModel = new OrderModel(
                order,
                { config: config, countryCode: currentLocale.country, containerView: 'order' }
            );
        }

        res.render('review/ratingreview', {
            order: orderModel,
            addreviewratingForm: addreviewratingForm,
            continueUrl: URLUtils.https('Review-Submit')
        });
        next();
    }
);

server.post(
    'Submit',
    server.middleware.https,
    consentTracking.consent,
    function (req, res, next) {
        var Calendar = require('dw/util/Calendar');
        var Site = require('dw/system/Site');
        var formErrors = require('*/cartridge/scripts/formErrors');
        var reviewForm = server.forms.getForm('addreviewrating');
        var reviewHelper = require('*/cartridge/scripts/helpers/reviewHelper');

        if (reviewForm.valid) {
            try {
                var lineItemID = reviewForm.lineItem.value;
                var orderNo = reviewForm.orderNo.value;
                var rating = reviewForm.rating.value;
                var review = reviewForm.review.value;
                var nickname = reviewForm.nickname.value;
                var reviews = reviewHelper.getReviews(lineItemID);
                var reviewDate = new Calendar();
                var date = new Date();
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var newReview;

                reviewDate.setTimeZone(Site.getCurrent().getTimezone());
                if (reviews) {
                    newReview = {
                        orderNo: orderNo,
                        rating: rating,
                        review: review,
                        nickname: nickname,
                        time: reviewDate.getTime(),
                        date: date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear()
                    };
                    reviews.push(newReview);
                    reviewHelper.updateReview(reviews, lineItemID);
                } else {
                    reviews = [];
                    newReview = {
                        orderNo: orderNo,
                        rating: rating,
                        review: review,
                        nickname: nickname,
                        time: reviewDate.getTime(),
                        date: date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear()
                    };
                    reviews.push(newReview);
                    reviewHelper.addReview(reviews, lineItemID);
                }

                reviewHelper.updateLineItem(orderNo, lineItemID);

                res.json({
                    success: true,
                    review: review
                });
            } catch (e) {
                Logger.error(e);
            }
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(reviewForm)
            });
        }
        next();
    }
);

server.get('DisplayProductReviews', function (req, res, next) {
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var reviewHelper = require('*/cartridge/scripts/helpers/reviewHelper');
    var pid = req.querystring.pid;
    var reviews = reviewHelper.getReviews(pid).reverse();
    var context = {
        reviews: reviews,
        productID: pid
    };
    var reviewsModalHtml = renderTemplateHelper.getRenderedHtml(context, 'product/components/reviews');
    res.json({
        reviewsModalHtml: reviewsModalHtml
    });
    next();
});

server.get('Sort', function (req, res, next) {
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var reviewHelper = require('*/cartridge/scripts/helpers/reviewHelper');
    var sortBy = req.querystring.sortBy;
    var lineItemID = req.querystring.productId;
    var reviews = reviewHelper.getReviews(lineItemID).reverse();
    var result = {
        reviews: reviewHelper.sortReviews(reviews, sortBy)
    };
    var sortingResultHtml = renderTemplateHelper.getRenderedHtml(result, 'product/components/reviewsDetail');
    if (sortingResultHtml) {
        res.json({
            success: true,
            sortingResultHtml: sortingResultHtml
        });
    }
    next();
});


module.exports = server.exports();
