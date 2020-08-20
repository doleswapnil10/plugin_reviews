'use strict';

module.exports = function (object) {
    Object.defineProperty(object, 'rating', {
        enumerable: true,
        value: 5
    });
};
