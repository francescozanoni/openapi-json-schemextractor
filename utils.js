"use strict";

module.exports = {

    /**
     * Remove a key from an object, searching recursively.
     *
     * @param {Object} object
     * @param {String} keyToRemove
     *
     * @see https://stackoverflow.com/questions/31728988/using-javascript-whats-the-quickest-way-to-recursively-remove-properties-and-va
     */
    removeKey: function (object, keyToRemove) {
        if ((typeof object) !== "object" ||
            (typeof keyToRemove) !== "string") {
            throw Error("Invalid input");
        }

        for (let property in object) {
            if (property === keyToRemove) {
                delete object[property];
            } else if (typeof object[property] === "object") {
                this.removeKey(object[property], keyToRemove);
            }
        }
    }

};