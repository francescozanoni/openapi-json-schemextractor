"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const utils = require("./utils");

const inputSchemaPath = process.argv[2];

(async function () {

    // Load input schema, parse to object and resolve all $ref's.
    let schemas = await $RefParser.dereference(inputSchemaPath);

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
    schemas = utils.removeKey(schemas, "example");

    // Remove unwanted keys.
    // @todo refactor by reading from input arguments
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

})();
