"use strict";

const _ = require("underscore");

const SchemExtractorForNode = require("./index");

// @todo refactor by extending SchemExtractorForNode
const SchemExtractor = {

    /**
     * @param {Object} schemaObject OpenAPI schema as JSON object
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromObject: async function (schemaObject, keysToRemove) {

        return await SchemExtractorForNode.fromObject(schemaObject, keysToRemove);

    },

    /**
     * @param {String} schemaUrl OpenAPI schema as URL to file
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromFile: async function (schemaUrl, keysToRemove) {

        if (_.isString(schemaUrl) === false) {
            throw Error("Input schema file URL is not a string");
        }

        if (schemaUrl.indexOf("http://") === -1 &&
            schemaUrl.indexOf("https://") === -1) {

            throw Error("Invalid schema file URL");

        }

        return await SchemExtractorForNode.fromFile(schemaUrl, keysToRemove);

    },

    /**
     * @param {String} schemaString OpenAPI schema as string, either as JSON or YAML
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromString: async function (schemaString, keysToRemove) {

        return await SchemExtractorForNode.fromString(schemaString, keysToRemove);

    }

};

module.exports = SchemExtractor;
