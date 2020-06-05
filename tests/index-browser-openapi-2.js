'use strict'

/**
 * @jest-environment jsdom
 */

const yaml = require('js-yaml')
const nock = require('nock')

const SchemExtractor = require('../lib/index-browser')
const FilePathManager = require('../lib/file-path-manager')

const data = require('./data')

describe('fromFile', () => {
  test('invalid URL: petstore.yaml v2.0', async () => {
    const schemaFilePath = data.openapiSchemas['local-yaml-v2.0']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })

  test('invalid URL: petstore.json v2.0', async () => {
    const schemaFilePath = data.openapiSchemas['local-json-v2.0']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })

  test('invalid URL: inexistent file path', async () => {
    const schemaFilePath = data.openapiSchemas['local-inexistent']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })

  test('invalid file path (number)', async () => {
    const schemaFilePath = data.openapiSchemas['local-invalid-path']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Input schema file URL is not a string'))
  })

  test('empty-openapi.json', async () => {
    // Mock HTTP server
    const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas['local-json-empty'])
    const schemaHost = data.openapiSchemas['remote-json-empty'].substr(0, 33)
    const schemaPath = data.openapiSchemas['remote-json-empty'].substr(33)
    nock(schemaHost)
      .get(schemaPath)
      .reply(200, schemaString)
    // HEAD method must be mocked because it's used by url-exist package
    nock(schemaHost)
      .head(schemaPath)
      .reply(200, '')

    const schemaFilePath = data.openapiSchemas['remote-json-empty']
    await expect(SchemExtractor.fromFile(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid input schema: no model schemas found'))
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
