'use strict'

const yaml = require('js-yaml')

const SchemExtractor = require('../lib/node-handler')
const FilePathManager = require('../lib/file-path-manager')

const data = require('./data')

describe('fromFile', () => {
  test('petstore.yaml v2.0', async () => {
    const schemaFilePath = data.openapiSchemas['local-yaml-v2.0']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .resolves
      .toStrictEqual(data.result)
  })

  test('petstore.json v2.0', async () => {
    const schemaFilePath = data.openapiSchemas['local-json-v2.0']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .resolves
      .toStrictEqual(data.result)
  })

  test('inexistent file path', async () => {
    const schemaFilePath = data.openapiSchemas['local-inexistent']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Schema file path not found'))
  })

  test('invalid file path (number)', async () => {
    const schemaFilePath = data.openapiSchemas['local-invalid-path']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Input schema file path is not a string'))
  })
})

describe('fromObject', () => {
  test('petstore.yaml v2.0', async () => {
    const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas['local-yaml-v2.0'])
    const schemaObject = yaml.safeLoad(schemaString)
    await expect(SchemExtractor.fromObject(schemaObject))
      .resolves
      .toStrictEqual(data.result)
  })

  test('petstore.json v2.0', async () => {
    const schemaObject = require('.' + data.openapiSchemas['local-json-v2.0'])
    await expect(SchemExtractor.fromObject(schemaObject))
      .resolves
      .toStrictEqual(data.result)
  })

  test('invalid schema object (number)', async () => {
    const schemaObject = 123
    await expect(SchemExtractor.fromObject(schemaObject))
      .rejects
      .toStrictEqual(Error('Input schema is not an object'))
  })

  test('invalid schema object (empty object)', async () => {
    const schemaObject = {}
    await expect(SchemExtractor.fromObject(schemaObject))
      .rejects
      .toStrictEqual(Error('Invalid input schema: no model schemas found'))
  })
})

describe('fromString', () => {
  test('petstore.yaml v2.0', async () => {
    const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas['local-yaml-v2.0'])
    await expect(SchemExtractor.fromString(schemaString))
      .resolves
      .toStrictEqual(data.result)
  })

  test('petstore.json v2.0', async () => {
    const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas['local-json-v2.0'])
    await expect(SchemExtractor.fromString(schemaString))
      .resolves
      .toStrictEqual(data.result)
  })

  test('invalid schema string (empty)', async () => {
    const schemaString = ''
    await expect(SchemExtractor.fromString(schemaString))
      .rejects
      .toStrictEqual(Error('Expected a file path, URL, or object. Got undefined'))
  })
})
