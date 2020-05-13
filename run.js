const $RefParser = require("@apidevtools/json-schema-ref-parser");
const toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');

const testSchemaFilePath = "test.json";

(async function () {

    try {

        let schema = await $RefParser.dereference(testSchemaFilePath);
        console.log(schema.definitions.color);
        let convertedSchema = toJsonSchema(schema.definitions.color);
        console.log(convertedSchema);

    } catch (err) {

        console.error(err);

    }

})();
