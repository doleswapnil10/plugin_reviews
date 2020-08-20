'use strict';
var formValidation = require('base/components/formValidation');

var highlightStar = function (rating, currentSection) {
    currentSection.find('span.s').each(function () {
        var low = $(this).data('low');
        var high = $(this).data('high');
        $(this).removeClass('active-high').removeClass('active-low');
        if (rating >= high) $(this).addClass('active-high');
        else if (rating === low) $(this).addClass('active-low');
    });
};

/**
 *
 * @param {Object} data - Data object containing review data
 * @returns {string} htmlString - HTML string for thank you
 */
function getModalHtmlElement(data) {
    var htmlString = '<!-- Modal -->'
        + '<div class="review-thankyoupage">'
        + '<h4 class="title">Thank you!</h4>'
        + '<p class="subtitle">We will process your review and publish it within 3-7 business days.</p>'
        + '<p class="review-text">Your Review : ' + data.review + '</p>'
        + '</div>';

    return htmlString;
}

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

/**
 *
 * @returns {void}
 */
function sort() {
    var url = $('.product-reviews-sorting').val();
    var selected = $('.product-reviews-sorting').find('option:selected');
    var sortBy = selected.data('sort');
    var productId = $('.sort-productid').val();
    var urlParams = {
        sortBy: sortBy,
        productId: productId
    };
    url = appendToUrl(url, urlParams);
    $.ajax({
        url: url,
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                $('.show-reviews').empty().html(data.sortingResultHtml);
            }
        }
    });
}

module.exports = function () {
    $('.submit-review').on('click', function (e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        var formData = $form.serialize();
        var orderNo = $('.orderNo').val();
        var cardBody = $form.find('.card-body');
        cardBody.spinner().start();
        $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            data: formData + '&orderNo' + orderNo,
            success: function (data) {
                if (!data.success) {
                    formValidation($form, data);
                } else {
                    cardBody.html(getModalHtmlElement(data));
                }
                cardBody.spinner().stop();
            },
            error: function () {
                cardBody.spinner().stop();
            }
        });
    });

    $('.rating_stars span.r').hover(function () {
        // get hovered value
        var rating = $(this).data('rating');
        $(this).parent().attr('class', '').addClass('rating_stars').addClass('rating_' + rating);
    }, function () {
        // get hidden field value
        var rating = $(this).data('rating');
        $(this).parent().attr('class', '').addClass('rating_stars').addClass('rating_' + rating);
    }).click(function () {
        // Set hidden field value
        var value = $(this).data('value');
        $(this).parents('.card-body').find('#rating_val').val(value);
        highlightStar(value, $(this).parent());
    });
    $('body').on('change', '.product-reviews-sorting', function (e) {
        e.preventDefault();
        sort();
    });
};
