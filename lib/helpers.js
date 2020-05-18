"use strict";

const _ = require("underscore");

module.exports = {

    /**
     * Strict object type check.
     *
     * @param {*} value
     *
     * @returns {boolean}
     *
     * @see https://underscorejs.org/#isObject
     */
    isObject: function (value) {
        return _.isObject(value) === true &&
            _.isArray(value) === false &&
            _.isFunction(value) === false;
    },

    /**
     * Remove all occurrences of a key within an object, searching recursively.
     *
     * @param {Object} object
     * @param {String} keyToRemove
     *
     * @returns {Object}
     *
     * @see https://stackoverflow.com/questions/31728988/using-javascript-whats-the-quickest-way-to-recursively-remove-properties-and-va
     *
     * @todo switch keyToRemove to an array
     */
    removeKeyFromObject: function (object, keyToRemove) {

        const isObject = this.isObject;

        if (isObject(object) === false) {
            throw Error("Invalid input object: " + JSON.stringify(object));
        }

        if (_.isString(keyToRemove) === false) {
            throw Error("Invalid input keyToRemove: " + JSON.stringify(keyToRemove));
        }

        const newObject = Object.assign({}, object);

        for (let key in newObject) {
            if (key === keyToRemove) {
                delete newObject[key];
            } else if (isObject(newObject[key]) === true) {
                newObject[key] = this.removeKeyFromObject(newObject[key], keyToRemove);
            } else if (_.isArray(newObject[key]) === true) {
                newObject[key] = newObject[key].map((item) => {
                    return isObject(item) ? this.removeKeyFromObject(item, keyToRemove) : item;
                });
            }
        }

        return newObject;

    }

};