"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const utils = require("./utils");

const testSchemaFilePath = process.argv[2];

(async function () {

    try {

        // Load OpenAPI schema, parse to object and resolve all $ref's.
        let schemas = await $RefParser.dereference(testSchemaFilePath);

        // Keep only model schemas.
        schemas = schemas.components.schemas;

        // Remove keys not supported by JSON schema.
        schemas = utils.removeKey(schemas, "example");

        // Remove unwanted keys.
        schemas = utils.removeKey(schemas, "audits");
        schemas = utils.removeKey(schemas, "Audit");
        schemas = utils.removeKey(schemas, "Auditable");

        for (let schema in schemas) {

            if (schemas.hasOwnProperty(schema) === false) {
                continue;
            }

            // Merge top-level allOf's of each schema.
            schemas[schema] = mergeAllOf(schemas[schema], {ignoreAdditionalProperties: true});

            // Convert each schema to JSON schema.
            schemas[schema] = toJsonSchema(schemas[schema]);

        }

        console.log(schemas);

    } catch (err) {

        console.error(err);

    }

})();
