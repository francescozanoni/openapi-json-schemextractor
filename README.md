# openapi-models-to-json-schemas [![Build Status](https://travis-ci.org/francescozanoni/openapi-models-to-json-schemas.svg?branch=master)](https://travis-ci.org/francescozanoni/openapi-models-to-json-schemas) [![Coverage Status](https://coveralls.io/repos/github/francescozanoni/openapi-models-to-json-schemas/badge.svg?branch=master&service=github)](https://coveralls.io/github/francescozanoni/openapi-models-to-json-schemas?branch=master&service=github)

Convert [OpenAPI](https://swagger.io/docs/specification/about) model schemas to [JSON schema](https://json-schema.org)s:

- both [OpenAPI 2](https://swagger.io/docs/specification/2-0) (a.k.a. Swagger) and [OpenAPI 3](https://swagger.io/docs/specification) specifications are supported;
- both [JSON](https://www.json.org) and [YAML](https://yaml.org) formats are supported;
- model schemas are extracted from `definitions` section (OpenAPI 2) and both `parameters` and `components.schemas` sections (OpenAPI 3);
- extracted JSON schemas are plain objects: no `$ref`, `allOf` elements.

### Code example
```javascript
const Converter = require("openapi-models-to-json-schemas");

const schemaPath = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml";

(async function () {

    const jsonSchemas = await Converter.fromFile(schemaPath);

    console.log(JSON.stringify(jsonSchemas, null, 2));

})();
```

### CLI example
```bash
node bin/run.js https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml
```

```javascript
{
  "Pet": {
    "type": "object",
    "required": [
      "id",
      "name"
    ],
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "name": {
        "type": "string"
      },
      "tag": {
        "type": "string"
      }
    },
    "$schema": "http://json-schema.org/draft-04/schema#"
  },
  "Pets": {
    "type": "array",
    "items": {
      "type": "object",
      "required": [
        "id",
        "name"
      ],
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },
        "name": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      }
    },
    "$schema": "http://json-schema.org/draft-04/schema#"
  },
  "Error": {
    "type": "object",
    "required": [
      "code",
      "message"
    ],
    "properties": {
      "code": {
        "type": "integer",
        "format": "int32"
      },
      "message": {
        "type": "string"
      }
    },
    "$schema": "http://json-schema.org/draft-04/schema#"
  },
  "/pets/{petId}_get_petId": {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "type": "string"
  },
  "/pets_get_limit": {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "format": "int32",
     "type": "integer"
  }
}
```

### Test
```bash
node_modules/.bin/jest
# or
docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app node:10 node_modules/.bin/jest
docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app node:12 node_modules/.bin/jest
docker run --rm -v "$PWD":/usr/src/app -w /usr/src/app node:14 node_modules/.bin/jest
```