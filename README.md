# openapi-models-to-json-schemas

Convert [OpenAPI](https://swagger.io/docs/specification/about) model schemas to [JSON schema](https://json-schema.org)s.

Both OpenAPI 2 (a.k.a. Swagger) and OpenAPI 3 specifications are supported.

### Run CLI example
```bash
node bin/run.js https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml
```

```json
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
yarn test
# or
npm run test
```

### Dependencies:
- https://github.com/APIDevTools/json-schema-ref-parser
- https://github.com/openapi-contrib/openapi-schema-to-json-schema
- https://github.com/mokkabonna/json-schema-merge-allof