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

        for (let key in newObject) {

            if (newObject.hasOwnProperty(key) === false) {
                continue;
            }

            if (key === keyToRemove) {
                if (_.isArray(valuesToCheck) === true &&
                    _.isEmpty(valuesToCheck) === false) {
                    if (_.contains(valuesToCheck, newObject[key]) === true) {
                        delete newObject[key];
                    }
                    continue;
                }
                delete newObject[key];
            } else if (this.isObject(newObject[key]) === true) {
                newObject[key] = this.removeKeyFromObject(newObject[key], keyToRemove, valuesToCheck);
            } else if (_.isArray(newObject[key]) === true) {
                const isObject = this.isObject;
                const removeKeyFromObject = this.removeKeyFromObject;
                newObject[key] = newObject[key].map((item) => {
                    return isObject(item) ? removeKeyFromObject(item, keyToRemove, valuesToCheck) : item;
                });
            }

        }

        return newObject;

    }

};