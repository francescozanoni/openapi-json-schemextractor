const path = require('path')

const externals = {
  '@apidevtools/json-schema-ref-parser': '$RefParser',
  '@openapi-contrib/openapi-schema-to-json-schema': 'toJsonSchema',
  'js-yaml': 'yaml',
  'json-schema-merge-allof': 'mergeAllOf'
}

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
  externals: (function () {
    const transformedExternals = {}
    Object.entries(externals)
      .forEach(entry => Object.defineProperty(
        transformedExternals,
        entry[0],
        {
          value: {
            commonjs: entry[0],
            commonjs2: entry[0],
            amd: entry[0],
            root: entry[1]
          }
        }
      )
      )
    return transformedExternals
  }(externals))
}
