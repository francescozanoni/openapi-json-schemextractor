# openapi-json-schemextractor

[![Build Status](https://travis-ci.org/francescozanoni/openapi-json-schemextractor.svg?branch=master)](https://travis-ci.org/francescozanoni/openapi-json-schemextractor) [![Coverage Status](https://coveralls.io/repos/github/francescozanoni/openapi-json-schemextractor/badge.svg?branch=master&service=github)](https://coveralls.io/github/francescozanoni/openapi-json-schemextractor?branch=master&service=github) [![NPM](https://nodei.co/npm/openapi-json-schemextractor.png?compact=true)](https://nodei.co/npm/openapi-json-schemextractor/)

Extract anything defined via a schema from [OpenAPI](https://swagger.io/docs/specification/about) schemas as standard [JSON schema](https://json-schema.org)s:

- both [OpenAPI 2](https://swagger.io/docs/specification/2-0) (a.k.a. Swagger) and [OpenAPI 3](https://swagger.io/docs/specification) specifications are supported;
- both [JSON](https://www.json.org) and [YAML](https://yaml.org) formats are supported;
- model schemas are extracted from:
  - `definitions` section (OpenAPI 2),
  - both `parameters` and `components.schemas` sections (OpenAPI 3);
- extracted [JSON schema](https://json-schema.org)s are plain schemas: no `$ref` or `allOf` elements.

Input [OpenAPI](https://swagger.io/docs/specification/about) schema can be supplied as:

- file path
- URL
- string
- JavaScript object

### Installation
```bash
yarn add openapi-json-schemextractor
```

### Code example
```javascript
const SchemExtractor = require("openapi-json-schemextractor");

(async function () {

  let schFromFile = await SchemExtractor.fromFile("path/to/openapi.yaml");
  let schFromUrl = await SchemExtractor.fromFile("http://example.com/openapi.yaml");
  let schFromString = await SchemExtractor.fromString("...");
  let schFromObject = await SchemExtractor.fromObject({/* ... */});

})();
```

### CLI example
```bash
node node_modules/openapi-json-schemextractor/bin/run.js \
     https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml
```

```javascript
{
  Pet: {
    type: "object",
    required: [
      "id",
      "name"
    ],
    properties: {
      id: {
        type: "integer",
        format: "int64"
      },
      name: {
        type: "string"
      },
      tag: {
        type: "string"
      }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },
  Pets: {
    type: "array",
    items: {
      type: "object",
      required: [
        "id",
        "name"
      ],
      properties: {
        id: {
          type: "integer",
          format: "int64"
        },
        name: {
          type: "string"
        },
        tag: {
          type: "string"
        }
      }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },
  Error: {
    type: "object",
    required: [
      "code",
      "message"
    ],
    properties: {
      code: {
        type: "integer",
        format: "int32"
      },
      message: {
        type: "string"
      }
    },
    $schema: "http://json-schema.org/draft-04/schema#"
  },
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

### Test
```bash
yarn test
# or
docker run --rm -v $(pwd):/usr/src/app -w /usr/src/app node:10 yarn test
docker run --rm -v $(pwd):/usr/src/app -w /usr/src/app node:12 yarn test
docker run --rm -v $(pwd):/usr/src/app -w /usr/src/app node:14 yarn test
```