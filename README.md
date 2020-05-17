# openapi-models-to-json-schemas

Convert [OpenAPI](https://swagger.io/docs/specification/about) model schemas to [JSON schema](https://json-schema.org)s.

Both OpenAPI 2 (a.k.a. Swagger) and OpenAPI 3 specifications are supported.

### Run
```bash
node src/run.js <path_to_schema>
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