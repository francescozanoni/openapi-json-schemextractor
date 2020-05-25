"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const _ = require("underscore");
const YAML = require("yamljs");
const fs = require("fs");
const urlExist = require("url-exist");
const appRoot = require("app-root-path");
const helpers = require(appRoot + "/lib/helpers");
const fixJsonSchema = require(appRoot + "/lib/json-schema-fixer");
const OpenAPISchemaManager = require(appRoot + "/lib/openapi-schema-manager");

/**
 * @param {String|Object} inputSchema OpenAPI schema as path to file or JSON object
 * @param {Array} [keysToRemove=[]]
 *
 * @returns {Promise<Object>}
 */
async function convert(inputSchema, keysToRemove) {

    if (_.isUndefined(keysToRemove) === true) {
        keysToRemove = [];
    }
    if (_.isArray(keysToRemove) === false) {
        throw Error("Invalid input keysToRemove");
    }

    // Load input schema, parse to object and resolve all $ref's.
    const dereferencedSchema = await $RefParser.dereference(inputSchema);

    let schemas = OpenAPISchemaManager.getModelSchemas(dereferencedSchema);

    if (_.isEmpty(schemas) === true) {
        throw Error("Invalid input schema: no model schemas found");
    }

    // Remove unwanted keys.
    // @todo ensure removed keys are not required
    _.each(keysToRemove, key => {
        schemas = helpers.removeKeyFromObject(schemas, key);
    });

    _.keys(schemas).map(schema => {

        // Merge top-level allOf's of each schema.
        schemas[schema] = mergeAllOf(schemas[schema], {ignoreAdditionalProperties: true});

        // Convert each schema to JSON schema.
        schemas[schema] = toJsonSchema(schemas[schema]);

        schemas[schema] = fixJsonSchema(schemas[schema]);

    });

    return schemas;

}

const Converter = {

    /**
     * @param {Object} schemaObject OpenAPI schema as JSON object
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromObject: async function (schemaObject, keysToRemove) {

        if (helpers.isObject(schemaObject) === false) {
            throw Error("Input schema is not an object");
        }

        return await convert(schemaObject, keysToRemove);

    },

    /**
     * @param {String} schemaFilePath OpenAPI schema as path to file
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromFile: async function (schemaFilePath, keysToRemove) {

        if (_.isString(schemaFilePath) === false) {
            throw Error("Input schema file path is not a string");
        }

        if (schemaFilePath.indexOf("http://") === 0 ||
            schemaFilePath.indexOf("https://") === 0) {

            // https://stackoverflow.com/questions/26007187/node-js-check-if-a-remote-url-exists
            if ((await urlExist(schemaFilePath)) === false) {
                throw Error("Schema file path not found");
            }

        } else {

            if (fs.existsSync(schemaFilePath) === false) {
                throw Error("Schema file path not found");
            }

            if (helpers.isFilePathReadable(schemaFilePath) === false) {
                throw Error("Schema file path not readable");
            }

        }

        return await convert(schemaFilePath, keysToRemove);

    },

    /**
     * @param {String} schemaString OpenAPI schema as string, either as JSON or YAML
     * @param {Array=} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromString: async function (schemaString, keysToRemove) {

        // @todo refactor file type detection
        const schemaObject = (schemaString.substr(0, 1) === "{" ? JSON : YAML).parse(schemaString);

        return await convert(schemaObject, keysToRemove);

    }

};

module.exports = Converter;
