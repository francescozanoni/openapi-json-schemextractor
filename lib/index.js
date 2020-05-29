"use strict";

const helpers = require("./helpers");
const SchemExtractorForBrowser = require("./index-browser");
const FilePathManager = require("./file-path-manager");

const SchemExtractor = {

    /**
     * @param {Object} schemaObject OpenAPI schema as JSON object
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromObject: async function (schemaObject, keysToRemove) {

        return await SchemExtractorForBrowser.fromObject(schemaObject, keysToRemove);

    },

    /**
     * @param {String} schemaFilePath OpenAPI schema as path to file
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromFile: async function (schemaFilePath, keysToRemove) {

        if (helpers.isString(schemaFilePath) === false) {
            throw Error("Input schema file path is not a string");
        }

        if (helpers.isWebUrl(schemaFilePath) === true) {
            return await SchemExtractorForBrowser.fromFile(schemaFilePath, keysToRemove);
        }

        if (FilePathManager.isFilePathValid(schemaFilePath) === false) {
            throw Error("Schema file path not found");
        }

        if (FilePathManager.isFilePathReadable(schemaFilePath) === false) {
            throw Error("Schema file path not readable");
        }

        const schemaString = FilePathManager.readFilePathToString(schemaFilePath);

        return await SchemExtractorForBrowser.fromString(schemaString, keysToRemove);

    },

    /**
     * @param {String} schemaString OpenAPI schema as string, either as JSON or YAML
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromString: async function (schemaString, keysToRemove) {

        return await SchemExtractorForBrowser.fromString(schemaString, keysToRemove);

    }

};

module.exports = SchemExtractor;
