'use strict'

const helpers = require('./helpers')

module.exports = {

  /**
   * @param {Object} schema
   *
   * @returns {Object}
   *
   * @todo make this function fully recursive
   */
  fix: function (schema) {
    let fixedSchema = Object.assign({}, schema)

    // Temporary patch for OpenAPI schema in JSON format.
    if (!fixedSchema.type) {
      fixedSchema.type = 'object'
    }

    // Remove useless minimum/maximum constraints added by openapi-schema-to-json-schema.
    fixedSchema = helpers.removeKeyFromObject(
      fixedSchema,
      'minimum',
      [
        // Values extracted from
        // node_modules/@openapi-contrib/openapi-schema-to-json-schema/lib/converters/schema.js
        0 - Math.pow(2, 31),
        0 - Math.pow(2, 63),
        0 - Math.pow(2, 128),
        0 - Number.MAX_VALUE
      ]
    )
    fixedSchema = helpers.removeKeyFromObject(
      fixedSchema,
      'maximum',
      [
        // Values extracted from
        // node_modules/@openapi-contrib/openapi-schema-to-json-schema/lib/converters/schema.js
        Math.pow(2, 31) - 1,
        Math.pow(2, 63) - 1,
        Math.pow(2, 128) - 1,
        Number.MAX_VALUE
      ]
    )

    if (fixedSchema.items) {
      fixedSchema.items = this.fix(fixedSchema.items)
    }

    return fixedSchema
  }

}
