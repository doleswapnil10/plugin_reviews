'use strict';
var base = require('base/product/detail');

/**
 * appends params to a url
 * @param {string} url - Original url
 * @param {Object} params - Parameters to append
 * @returns {string} result url with appended parameters
 */
function appendToUrl(url, params) {
    var newUrl = url;
    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return newUrl;
}

base.updateAvailability = function () {
    $('body').on('product:updateAvailability', function (e, response) {
        $('div.availability', response.$productContainer)
            .data('ready-to-order', response.product.readyToOrder)
            .data('available', response.product.available);

        $('.availability-msg', response.$productContainer)
            .empty().html(response.message);

        if ($('.global-availability').length) {
            var allAvailable = $('.product-availability').toArray()
                .every(function (item) { return $(item).data('available'); });

            var allReady = $('.product-availability').toArray()
                .every(function (item) { return $(item).data('ready-to-order'); });

            $('.global-availability')
                .data('ready-to-order', allReady)
                .data('available', allAvailable);

            $('.global-availability .availability-msg').empty()
                .html(allReady ? response.message : response.resources.info_selectforstock);
        }

        if (response.product.reviews) {
            var url = $('.product-detail').data('reviewurl');
            var params = {
                pid: response.product.id
            };
            url = appendToUrl(url, params);
            $.ajax({
                url: url,
                type: 'get',
                data: '',
                dataType: 'json',
                success: function (data) {
                    if (response.$productContainer.find('.reviews').hasClass('hidden-xl-down')) {
                        response.$productContainer.find('.reviews').removeClass('hidden-xl-down');
                        if (response.$productContainer.find('.hidden-sm-up.reviews-devider').hasClass('hidden-xl-down')) {
                            response.$productContainer.find('.hidden-sm-up.reviews-devider').removeClass('hidden-xl-down');
                        }
                    }
                    response.$productContainer.find('.reviews').empty().html(data.reviewsModalHtml);
                }
            });
        }
        if (response.product.ratings !== null) {
            var totalRatings = [1, 2, 3, 4, 5];
            var ratingHtml = '';
            totalRatings.forEach(function (rating) {
                ratingHtml += '<i class="fa ';
                if (response.product.ratings === 0) {
                    ratingHtml += 'fa-star-o';
                } else if (response.product.ratings >= rating) {
                    ratingHtml += 'fa-star';
                } else if ((response.product.ratings % 1 > 0) && (Math.ceil(response.product.ratings) >= rating)) {
                    ratingHtml += 'fa-star-half-o';
                } else {
                    ratingHtml += 'fa-star-o';
                }
                ratingHtml += ' aria-hidden="true"></i>';
            });
            if (response.product.reviews !== null) {
                ratingHtml = '<a href="#reviews">' + ratingHtml + '<span class="totalRating"> (' + response.product.reviews.length + ')</span></a>';
            }
            response.$productContainer.find('.ratings').empty().html(ratingHtml);
        }
    });
};

module.exports = base;
