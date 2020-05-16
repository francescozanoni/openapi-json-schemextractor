"use strict";

const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require("@openapi-contrib/openapi-schema-to-json-schema");
const mergeAllOf = require("json-schema-merge-allof");
const utils = require("./utils");

const testSchemaFilePath = "test.json";

(async function () {

    try {

        let schema = await $RefParser.dereference(testSchemaFilePath);
        utils.removeKey(schema, "example");
        utils.removeKey(schema, "audits");
        let convertedSchema = toJsonSchema(schema.components.schemas);
        let student = mergeAllOf(convertedSchema.Student, {ignoreAdditionalProperties: true});

    } catch (err) {

        console.error(err);

    }

})();
