const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/browser-handler.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'openapi-json-schemextractor.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'SchemExtractor'
  },
  externals: {
    '@apidevtools/json-schema-ref-parser': {
      commonjs: '@apidevtools/json-schema-ref-parser',
      commonjs2: '@apidevtools/json-schema-ref-parser',
      amd: '@apidevtools/json-schema-ref-parser',
      root: '$RefParser'
    },
    '@openapi-contrib/openapi-schema-to-json-schema': {
      commonjs: '@openapi-contrib/openapi-schema-to-json-schema',
      commonjs2: '@openapi-contrib/openapi-schema-to-json-schema',
      amd: '@openapi-contrib/openapi-schema-to-json-schema',
      root: 'toJsonSchema'
    },
    'js-yaml': {
      commonjs: 'js-yaml',
      commonjs2: 'js-yaml',
      amd: 'js-yaml',
      root: 'yaml'
    },
    'json-schema-merge-allof': {
      commonjs: 'json-schema-merge-allof',
      commonjs2: 'json-schema-merge-allof',
      amd: 'json-schema-merge-allof',
      root: 'mergeAllOf'
    }
  }
}
