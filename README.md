# openapi-models-to-json-schemas [![Build Status](https://travis-ci.org/francescozanoni/openapi-models-to-json-schemas.svg?branch=master)](https://travis-ci.org/francescozanoni/openapi-models-to-json-schemas) [![Coverage Status](https://coveralls.io/repos/github/francescozanoni/openapi-models-to-json-schemas/badge.svg?branch=master&service=github)](https://coveralls.io/github/francescozanoni/openapi-models-to-json-schemas?branch=master&service=github)

Convert [OpenAPI](https://swagger.io/docs/specification/about) model schemas to [JSON schema](https://json-schema.org)s.

Both [OpenAPI 2](https://swagger.io/docs/specification/2-0) (a.k.a. Swagger) and [OpenAPI 3](https://swagger.io/docs/specification) specifications are supported.

Both [JSON](https://www.json.org) and [YAML](https://yaml.org) formats are supported.

### Run CLI example
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

### Dependencies:
- https://github.com/APIDevTools/json-schema-ref-parser
- https://github.com/openapi-contrib/openapi-schema-to-json-schema
- https://github.com/mokkabonna/json-schema-merge-allof