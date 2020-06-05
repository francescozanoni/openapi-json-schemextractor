'use strict'

const SchemExtractor = require('../lib/node-handler')

const openapiSchemaPathOrUrl = process.argv[2]

if ((typeof openapiSchemaPathOrUrl) === 'undefined') {
  console.error('OpenAPI schema path/URL not provided')
  process.exit(1)
}

(async function () {
  const jsonSchemas = await SchemExtractor.fromFile(openapiSchemaPathOrUrl)
  console.log(JSON.stringify(jsonSchemas, null, 2))
})()
