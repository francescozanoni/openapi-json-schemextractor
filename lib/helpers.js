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
    removeKeyFromObject: function (object, keyToRemove) {

        if ((typeof object) !== "object" ||
            Array.isArray(object) === true) {
            throw Error("Invalid input object: " + JSON.stringify(object));
        }

        if ((typeof keyToRemove) !== "string") {
            throw Error("Invalid input keyToRemove: " + JSON.stringify(keyToRemove));
        }

        const newObject = Object.assign({}, object);

        for (let key in newObject) {
            if (key === keyToRemove) {
                delete newObject[key];
            } else if (typeof newObject[key] === "object" && Array.isArray(newObject[key]) === false) {
                newObject[key] = this.removeKeyFromObject(newObject[key], keyToRemove);
            } else if (Array.isArray(newObject[key]) === true) {
                for (let i = 0; i < newObject[key].length; i++) {
                    newObject[key][i] = this.removeKeyFromObject(newObject[key][i], keyToRemove);
                }
            }
        }

        return newObject;

    }

};