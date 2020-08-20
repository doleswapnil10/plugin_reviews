/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (include) {
    if (typeof include === 'function') {
        include();
    } else if (typeof include === 'object') {
        Object.keys(include).forEach(function (key) {
            if (typeof include[key] === 'function') {
                include[key]();
            }
        });
    }
};


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var formValidation = __webpack_require__(7);

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
 * @param {Object} reviews - eview object containing rating, review text, orderNo
 * @returns {string} htmlString - HTML string
 */
function reviewResults(reviews) {
    var reviewResultHtml = '';
    var reviewerName = '';
    var ratingHtml = '';
    reviews.forEach(function (review) {
        if (review.rating !== null) {
            var totalRatings = [1, 2, 3, 4, 5];
            reviewerName = '<div class="review-result row"><div class="col-6 reviewer-name">'
                + '<h3 class="reviewer-name hidden-sm-down">' + review.nickname + '</h3>'
                + '</div>';

            totalRatings.forEach(function (rating) {
                ratingHtml += '<i class="fa ';
                if (review.rating === 0) {
                    ratingHtml += 'fa-star-o';
                } else if (review.rating >= rating) {
                    ratingHtml += 'fa-star';
                } else if ((review.rating % 1 > 0) && (Math.ceil(review.rating) >= rating)) {
                    ratingHtml += 'fa-star-half-o';
                } else {
                    ratingHtml += 'fa-star-o';
                }
                ratingHtml += ' aria-hidden="true"></i>';
            });
        }
        reviewResultHtml += reviewerName + '<div class="col-6">' + ratingHtml + '</div><div class="col-6 reviewText">' + review.review + '</div>'
            + '<div class="col-6 reviewedDate">Submitted ' + review.date + '</div>'
            + '<div class="col"><hr class="line-item-divider"></div></div>';
    });
    return reviewResultHtml;
}

function sort() {
    var url = $('.product-reviews-sorting').val();
    var selected = $('.product-reviews-sorting').find('option:selected');
    var sortBy = selected.data('sort');
    var productId = $('.sort-productid').val();
    var urlParams = {
        sortBy: sortBy,
        productId: productId
    };
    var resultsDiv = $('.review-result');
    url = appendToUrl(url, urlParams);

    $.ajax({
        url: url,
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                resultsDiv.empty().html(reviewResults(data.reviews));
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Remove all validation. Should be called every time before revalidating form
 * @param {element} form - Form to be cleared
 * @returns {void}
 */
function clearFormErrors(form) {
    $(form).find('.form-control.is-invalid').removeClass('is-invalid');
}

module.exports = function (formElement, payload) {
    // clear form validation first
    clearFormErrors(formElement);
    $('.alert', formElement).remove();

    if (typeof payload === 'object' && payload.fields) {
        Object.keys(payload.fields).forEach(function (key) {
            if (payload.fields[key]) {
                var feedbackElement = $(formElement).find('[name="' + key + '"]')
                    .parent()
                    .children('.invalid-feedback');

                if (feedbackElement.length > 0) {
                    if (Array.isArray(payload[key])) {
                        feedbackElement.html(payload.fields[key].join('<br/>'));
                    } else {
                        feedbackElement.html(payload.fields[key]);
                    }
                    feedbackElement.siblings('.form-control').addClass('is-invalid');
                }
            }
        });
    }
    if (payload && payload.error) {
        var form = $(formElement).prop('tagName') === 'FORM'
            ? $(formElement)
            : $(formElement).parents('form');

        form.prepend('<div class="alert alert-danger" role="alert">'
            + payload.error.join('<br/>') + '</div>');
    }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var processInclude = __webpack_require__(1);

$(document).ready(function () {
    processInclude(__webpack_require__(6));
});


/***/ })
/******/ ]);