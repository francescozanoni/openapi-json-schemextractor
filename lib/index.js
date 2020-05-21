"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const helpers = require("./helpers");
const _ = require("underscore");
const YAML = require("yamljs");
const fs = require("fs");

/**
 * @param {Object} schema
 *
 * @returns {Object}
 *
 * @todo make this function fully recursive
 */
function fixSchema(schema) {

    const fixedSchema = _.clone(schema);

    // Temporary patch for OpenAPI schema in JSON format.
    if (!fixedSchema.type) {
        fixedSchema.type = "object";
    }

    if (fixedSchema.items) {
        fixedSchema.items = fixSchema(fixedSchema.items);
    }

    // Remove useless minimum/maximum constraints added by openapi-schema-to-json-schema.
    if (fixedSchema.properties) {
        // node_modules/@openapi-contrib/openapi-schema-to-json-schema/lib/converters/schema.js
        fixedSchema.properties = _.mapObject(
            fixedSchema.properties,
            (item) => helpers.removeKeyFromObject(
                item,
                "minimum",
                [
                    0 - Math.pow(2, 31),
                    0 - Math.pow(2, 63),
                    0 - Math.pow(2, 128),
                    0 - Number.MAX_VALUE
                ]
            )
        );
        fixedSchema.properties = _.mapObject(
            fixedSchema.properties,
            (item) => helpers.removeKeyFromObject(
                item,
                "maximum",
                [
                    Math.pow(2, 31) - 1,
                    Math.pow(2, 63) - 1,
                    Math.pow(2, 128) - 1,
                    Number.MAX_VALUE
                ]
            )
        );
    }

    return fixedSchema;

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

        return await this.from(schemaObject, keysToRemove);

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

        if (fs.existsSync(schemaFilePath) === false) {
            throw Error("Schema file path not found");
        }

        if (helpers.isFilePathReadable(schemaFilePath) === false) {
            throw Error("Schema file path not readable");
        }

        return await this.from(schemaFilePath, keysToRemove);

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

        return await this.from(schemaObject, keysToRemove);

    },

    /**
     * @param {String|Object} inputSchema OpenAPI schema as path to file or JSON object
     * @param {Array} [keysToRemove=[]]
     *
     * @returns {Promise<Object>}
     */
    from: async function (inputSchema, keysToRemove) {

        if (_.isUndefined(keysToRemove) === true) {
            keysToRemove = [];
        }
        if (_.isArray(keysToRemove) === false) {
            throw Error("Invalid input keysToRemove");
        }

        // Load input schema, parse to object and resolve all $ref's.
        let schemas = await $RefParser.dereference(inputSchema);

        // Keep only model schemas.
        if (schemas) {
            // OpenAPI 3
            if (schemas.components &&
                schemas.components.schemas) {
                schemas = schemas.components.schemas;
            }
            // OpenAPI 2 (a.k.a. Swagger)
            else if (schemas.definitions) {
                schemas = schemas.definitions;
            } else {
                throw Error("Invalid input schema: no model schemas found");
            }
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

            schemas[schema] = fixSchema(schemas[schema]);

        });

        return schemas;

    }
};

module.exports = Converter;
