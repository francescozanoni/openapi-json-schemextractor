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
     * @param {*} value
     *
     * @returns {boolean}
     */
    isString: function (value) {
        return _.isString(value) === true;
    },

    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    isEmpty: function (value) {
        return _.isEmpty(value) === true;
    },

    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    isWebUrl: function (value) {
        return this.isString(value) === true &&
            (value.indexOf("http://") === 0 ||
                value.indexOf("https://") === 0);
    },

    /**
     * Remove all occurrences of a key within an object, searching recursively.
     *
     * @param {Object} object
     * @param {String} keyToRemove
     * @param {Array=} valuesToCheck if not empty, the values the key must have, in order to remove it
     *
     * @returns {Object}
     *
     * @see https://stackoverflow.com/questions/31728988/using-javascript-whats-the-quickest-way-to-recursively-remove-properties-and-va
     */
    removeKeyFromObject: function (object, keyToRemove, valuesToCheck) {

        if (this.isObject(object) === false) {
            throw Error("Invalid input object: " + JSON.stringify(object));
        }

        if (_.isString(keyToRemove) === false) {
            throw Error("Invalid input keyToRemove: " + JSON.stringify(keyToRemove));
        }

        if (_.isUndefined(valuesToCheck) === false &&
            _.isArray(valuesToCheck) === false) {
            throw Error("Invalid input valuesToCheck: " + JSON.stringify(valuesToCheck));
        }

        const newObject = _.clone(object);

        _.keys(newObject).map(key => {

            if (key === keyToRemove) {
                if (_.isArray(valuesToCheck) === true &&
                    _.isEmpty(valuesToCheck) === false) {
                    if (_.contains(valuesToCheck, newObject[key]) === true) {
                        delete newObject[key];
                    }
                    return;
                }
                delete newObject[key];
            } else if (this.isObject(newObject[key]) === true) {
                newObject[key] = this.removeKeyFromObject(newObject[key], keyToRemove, valuesToCheck);
            } else if (_.isArray(newObject[key]) === true) {
                newObject[key] = newObject[key].map((item) => {
                    return this.isObject(item) ? this.removeKeyFromObject(item, keyToRemove, valuesToCheck) : item;
                }, this);
            }

        });

        return newObject;

    }

};