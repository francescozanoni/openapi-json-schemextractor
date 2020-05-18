"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const helpers = require("./helpers");
const _ = require("underscore");

/**
 * Temporary patch for OpenAPI schema in JSON format.
 *
 * @param {Object} schema
 *
 * @returns {Object}
 */
function fixSchema (schema) {

    const fixedSchema = Object.assign({}, schema);

    if (!schema.type &&
        schema.$schema &&
        schema.$schema === "http://json-schema.org/draft-04/schema#") {
        fixedSchema.type = "object";
    }

    if (schema.items &&
        !schema.items.type) {
        fixedSchema.items.type = "object";
    }

    return fixedSchema;

}

const Converter = {

    /**
     * @param {String} schemaFilePath path to OpenAPI schema
     * @param {Array} keysToRemove
     *
     * @returns {Promise<Object>}
     */
    fromFile: async function (schemaFilePath, keysToRemove) {

        // Load input schema, parse to object and resolve all $ref's.
        let schemas = await $RefParser.dereference(schemaFilePath);

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

        // Remove keys not supported by JSON schema.
        schemas = helpers.removeKeyFromObject(schemas, "example");

        // Remove unwanted keys.
        // @todo ensure removed keys are not required
        if (_.isArray(keysToRemove) === true) {
            for (let i = 0; i < keysToRemove.length; i++) {
                schemas = helpers.removeKeyFromObject(schemas, keysToRemove[i]);
            }
        }

        for (let schema in schemas) {

            if (schemas.hasOwnProperty(schema) === false) {
                continue;
            }

            // Merge top-level allOf's of each schema.
            schemas[schema] = mergeAllOf(schemas[schema], {ignoreAdditionalProperties: true});

            // Convert each schema to JSON schema.
            schemas[schema] = toJsonSchema(schemas[schema]);

            schemas[schema] = fixSchema(schemas[schema]);

        }

        return schemas;

    }
};

module.exports = Converter;
