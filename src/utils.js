"use strict";

module.exports = {

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
    removeKey: function (object, keyToRemove) {

        if ((typeof object) !== "object" ||
            (typeof keyToRemove) !== "string") {
            throw Error("Invalid input");
        }

        for (let key in object) {
            if (key === keyToRemove) {
                delete object[key];
            } else if (typeof object[key] === "object") {
                object[key] = this.removeKey(object[key], keyToRemove);
            }
        }

        return object;

    }

};