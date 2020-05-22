"use strict";

const helpers = require("./helpers");
const _ = require("underscore");

/**
 * @param {Object} schema
 *
 * @returns {Object}
 *
 * @todo make this function fully recursive
 */
function fixJsonSchema (schema) {

    const fixedSchema = _.clone(schema);

    // Temporary patch for OpenAPI schema in JSON format.
    if (!fixedSchema.type) {
        fixedSchema.type = "object";
    }

    if (fixedSchema.items) {
        fixedSchema.items = fixJsonSchema(fixedSchema.items);
    }

    // Remove useless minimum/maximum constraints added by openapi-schema-to-json-schema.
    if (fixedSchema.properties) {
        fixedSchema.properties = _.mapObject(
            fixedSchema.properties,
            (item) => helpers.removeKeyFromObject(
                item,
                "minimum",
                [
                    // Values extracted from
                    // node_modules/@openapi-contrib/openapi-schema-to-json-schema/lib/converters/schema.js
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
                    // Values extracted from
                    // node_modules/@openapi-contrib/openapi-schema-to-json-schema/lib/converters/schema.js
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

module.exports = fixJsonSchema;