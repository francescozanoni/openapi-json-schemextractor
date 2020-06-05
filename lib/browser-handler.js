'use strict'

const $RefParser = require('@apidevtools/json-schema-ref-parser')
const toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema')
const mergeAllOf = require('json-schema-merge-allof')
const yaml = require('js-yaml')

const helpers = require('./helpers')
const JSONSchemaManager = require('./json-schema-manager')
const OpenAPISchemaManager = require('./openapi-schema-manager')

/**
 * @param {String|Object} inputSchema OpenAPI schema as path to file or JSON object
 *
 * @returns {Promise<Object>}
 */
async function extract (inputSchema) {
  // Load input schema, parse to object and resolve all $ref's.
  const dereferencedSchema = await $RefParser.dereference(inputSchema)

  const schemas = OpenAPISchemaManager.getModelSchemas(dereferencedSchema)

  if (helpers.isEmpty(schemas) === true) {
    throw Error('Invalid input schema: no model schemas found')
  }

  Object.keys(schemas).forEach((schema) => {
    // Merge top-level allOf's of each schema.
    schemas[schema] = mergeAllOf(schemas[schema], { ignoreAdditionalProperties: true })

    // Convert each schema to JSON schema.
    schemas[schema] = toJsonSchema(schemas[schema])

    schemas[schema] = JSONSchemaManager.fix(schemas[schema])
  })

  return schemas
}

const SchemExtractor = {

  /**
     * @param {Object} schemaObject OpenAPI schema as JSON object
     *
     * @returns {Promise<Object>}
     */
  fromObject: async function (schemaObject) {
    if (helpers.isObject(schemaObject) === false) {
      throw Error('Input schema is not an object')
    }

    return await extract(schemaObject)
  },

  /**
     * @param {String} schemaUrl OpenAPI schema as URL to file
     *
     * @returns {Promise<Object>}
     */
  fromFile: async function (schemaUrl) {
    if (helpers.isString(schemaUrl) === false) {
      throw Error('Input schema file URL is not a string')
    }

    if (helpers.isWebUrl(schemaUrl) === false) {
      throw Error('Invalid schema file URL')
    }

    try {
      return await extract(schemaUrl)
    } catch (error) {
      if (error instanceof $RefParser.ResolverError &&
                error.message === 'Error downloading ' + schemaUrl + ' \nHTTP ERROR 404') {
        throw Error('Schema file URL not found')
      }
      throw error
    }
  },

  /**
     * @param {String} schemaString OpenAPI schema as string, either as JSON or YAML
     *
     * @returns {Promise<Object>}
     */
  fromString: async function (schemaString) {
    let schemaObject

    // @todo refactor file type detection
    if (schemaString.substr(0, 1) === '{') {
      schemaObject = JSON.parse(schemaString)
    } else {
      schemaObject = yaml.safeLoad(schemaString)
    }

    return await extract(schemaObject)
  }

}

module.exports = SchemExtractor
