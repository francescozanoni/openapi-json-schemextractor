"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const helpers = require("./helpers");

const Converter = {

    /**
     * @param {String} schemaFilePath
     *
     * @returns {Promise<Object>}
     */
    fromFile: async function (schemaFilePath) {

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
        // @todo refactor by reading from input arguments
        schemas = helpers.removeKeyFromObject(schemas, "audits");
        schemas = helpers.removeKeyFromObject(schemas, "Audit");
        schemas = helpers.removeKeyFromObject(schemas, "Auditable");

        for (let schema in schemas) {

            if (schemas.hasOwnProperty(schema) === false) {
                continue;
            }

            // Merge top-level allOf's of each schema.
            schemas[schema] = mergeAllOf(schemas[schema], {ignoreAdditionalProperties: true});

            // Convert each schema to JSON schema.
            schemas[schema] = toJsonSchema(schemas[schema]);

            // Temporary patch for OpenAPI schema in JSON format.
            if (!schemas[schema].type &&
                schemas[schema].$schema &&
                schemas[schema].$schema === "http://json-schema.org/draft-04/schema#") {
                schemas[schema].type = "object";
            }
            if (schemas[schema].items &&
                !schemas[schema].items.type) {
                schemas[schema].items.type = "object";
            }

        }

        return schemas;

    }
};

module.exports = Converter;
