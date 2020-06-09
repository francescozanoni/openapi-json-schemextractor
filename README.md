# openapi-json-schemextractor [![Build Status](https://travis-ci.org/francescozanoni/openapi-json-schemextractor.svg?branch=master)](https://travis-ci.org/francescozanoni/openapi-json-schemextractor) [![Coverage Status](https://coveralls.io/repos/github/francescozanoni/openapi-json-schemextractor/badge.svg?branch=master&service=github)](https://coveralls.io/github/francescozanoni/openapi-json-schemextractor?branch=master&service=github) [![npm version](https://badge.fury.io/js/openapi-json-schemextractor.svg)](https://badge.fury.io/js/openapi-json-schemextractor)

Extract any entities defined via a schema within [OpenAPI](https://swagger.io/docs/specification/about) (a.k.a. Swagger) schemas as standard [JSON schema](https://json-schema.org)s:

Entity schemas are extracted from:
  - `definitions` section ([OpenAPI 2](https://swagger.io/docs/specification/2-0)),
  - both `parameters` and `components.schemas` sections ([OpenAPI 3](https://swagger.io/docs/specification)).

### Input

Input [OpenAPI](https://swagger.io/docs/specification/about) schemas can be supplied as:

- file paths,
- URLs (**http** or **https**),
- strings,
- native JavaScript objects.

Furthermore:

- both [OpenAPI 2](https://swagger.io/docs/specification/2-0) and [OpenAPI 3](https://swagger.io/docs/specification) specifications are supported,
- both [JSON](https://www.json.org) and [YAML](https://yaml.org) formats are supported.

### Output

Extracted [JSON schema](https://json-schema.org)s are:

- plain schemas, i.e. no `$ref` or `allOf` elements,
- returned as native JavaScript objects,
- compliant with [JSON schema Draft 04](https://json-schema.org/specification-links.html#draft-4).

### Known limitations

- currently schemas split over several files are not supported

## Installation
```bash
yarn add openapi-json-schemextractor
```

## Code example
```javascript
const SchemExtractor = require("openapi-json-schemextractor")

(async function () {

  let schFromFile = await SchemExtractor.fromFile("path/to/openapi.yaml")
  let schFromUrl = await SchemExtractor.fromFile("http://example.com/openapi.yaml")
  let schFromString = await SchemExtractor.fromString("...")
  let schFromObject = await SchemExtractor.fromObject({/* ... */})

})()
```

## CLI example
```bash
node node_modules/openapi-json-schemextractor/bin/run.js \
     https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml
# or
node node_modules/openapi-json-schemextractor/bin/run.js path/to/openapi.yaml
```

```javascript
{

  Pet: {
    type: "object",
    required: [ "id", "name" ],
    properties: {
      id: { type: "integer", format: "int64" },
      name: { type: "string" },
      tag: { type: "string" }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },

  Pets: {
    type: "array",
    items: {
      type: "object",
      required: [ "id", "name" ],
      properties: {
        id: { type: "integer", format: "int64" },
        name: { type: "string" },
        tag: { type: "string" }
      }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },

  Error: {
    type: "object",
    required: [ "code", "message" ],
    properties: {
      code: { type: "integer", format: "int32" },
      message: { type: "string" }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },

  // Schemas related to parameters are given unique identifiers.
  "/pets/{petId}_get_petId": {
     $schema: "http://json-schema.org/draft-04/schema#",
     type: "string"
  },
  "/pets_get_limit": {
     $schema: "http://json-schema.org/draft-04/schema#",
     format: "int32",
     type: "integer"
  }

}
```

## Test
```bash
yarn test

# or (Linux/Mac)
docker run --rm -v $(pwd):/app -w /app node:10 yarn test
docker run --rm -v $(pwd):/app -w /app node:12 yarn test
docker run --rm -v $(pwd):/app -w /app node:14 yarn test

# or (Windows)
docker run --rm -v %cd%:/app -w /app node:10 yarn test
docker run --rm -v %cd%:/app -w /app node:12 yarn test
docker run --rm -v %cd%:/app -w /app node:14 yarn test
```

## Check code style
```bash
yarn run style:check
```
