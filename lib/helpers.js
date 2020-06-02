"use strict";

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
        return (typeof value) === "object" &&
            JSON.stringify(value).substr(0, 1) === "{" &&
            JSON.stringify(value).substr(-1) === "}";
    },

    /**
     * Strict object type check.
     *
     * @param {*} value
     *
     * @returns {boolean}
     *
     * @see https://underscorejs.org/#isObject
     */
    isArray: function (value) {
        const t = JSON.stringify(value);
        return (typeof t) === "string" &&
            t.substr(0, 1) === "[" &&
            t.substr(-1) === "]";
    },

    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    isString: function (value) {
        return (typeof value) === "string";
    },

    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    isUndefined: function (value) {
        return (typeof value) === "undefined";
    },

    /**
     * Detect whether input value is an empty object or empty array.
     *
     * @param {*} value
     *
     * @returns {boolean}
     */
    isEmpty: function (value) {
        const t = JSON.stringify(value);
        return (typeof t) === "string" &&
            ((this.isObject(value) === true && t === "{}") ||
            (this.isArray(value) === true && t === "[]"));
    },

    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    isWebUrl: function (value) {
        return this.isString(value) === true &&
            /^https?:\/\/[a-z0-9]/.test(value) === true;
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

        if (this.isString(keyToRemove) === false) {
            throw Error("Invalid input keyToRemove: " + JSON.stringify(keyToRemove));
        }

        if (this.isUndefined(valuesToCheck) === false &&
            this.isArray(valuesToCheck) === false) {
            throw Error("Invalid input valuesToCheck: " + JSON.stringify(valuesToCheck));
        }

        const newObject = Object.assign({}, object);

        Object.keys(newObject).map(key => {

            if (key === keyToRemove) {
                if (this.isArray(valuesToCheck) === true &&
                    this.isEmpty(valuesToCheck) === false) {
                    if (valuesToCheck.indexOf(newObject[key]) !== -1) {
                        delete newObject[key];
                    }
                    return;
                }
                delete newObject[key];
            } else if (this.isObject(newObject[key]) === true) {
                newObject[key] = this.removeKeyFromObject(newObject[key], keyToRemove, valuesToCheck);
            } else if (this.isArray(newObject[key]) === true) {
                newObject[key] = newObject[key].map((item) => {
                    return this.isObject(item) ? this.removeKeyFromObject(item, keyToRemove, valuesToCheck) : item;
                }, this);
            }

        });

        return newObject;

    }

};