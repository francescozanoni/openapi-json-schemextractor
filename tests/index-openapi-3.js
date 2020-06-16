'use strict'

/**
 * @jest-environment jsdom
 */

const yaml = require('js-yaml')
const nock = require('nock')
const fs = require('fs')
const appRoot = require('app-root-path')

const SchemExtractor = require(appRoot.resolve('/lib/index'))

const data = require(appRoot.resolve('/tests/data'))

describe('fromUrl', () => {
  test('invalid URL: local petstore.yaml v3.0', async () => {
    const schemaFilePath = appRoot.resolve(data.openapiSchemas['local-yaml-v3.0'])
    await expect(SchemExtractor.fromUrl(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })

  test('invalid URL: inexistent file path', async () => {
    const schemaFilePath = appRoot.resolve(data.openapiSchemas['local-inexistent'])
    await expect(SchemExtractor.fromUrl(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })

  test('invalid URL: invalid file path (number)', async () => {
    const schemaFilePath = data.openapiSchemas['local-invalid-path']
    await expect(SchemExtractor.fromUrl(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Input schema file URL is not a string'))
  })

  test('remote petstore.yaml v3.0', async () => {
    // Mock HTTP server
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-yaml-v3.0']))
    const schemaHost = data.openapiSchemas['remote-yaml-v3.0'].substr(0, 33)
    const schemaPath = data.openapiSchemas['remote-yaml-v3.0'].substr(33)
    nock(schemaHost)
      .get(schemaPath)
      .reply(200, schemaBuffer.toString())
    // HEAD method must be mocked because it's used by url-exist package
    nock(schemaHost)
      .head(schemaPath)
      .reply(200, '')

    await expect(SchemExtractor.fromUrl(data.openapiSchemas['remote-yaml-v3.0']))
      .resolves
      .toStrictEqual(data.resultWithParameters)
  })

  test('inexistent URL', async () => {
    // Mock HTTP server
    const schemaHost = data.openapiSchemas['remote-inexistent'].substr(0, 33)
    const schemaPath = data.openapiSchemas['remote-inexistent'].substr(33)
    nock(schemaHost)
      .get(schemaPath)
      .reply(404, '')
    // HEAD method must be mocked because it's used by url-exist package
    nock(schemaHost)
      .head(schemaPath)
      .reply(404, '')

    await expect(SchemExtractor.fromUrl(data.openapiSchemas['remote-inexistent']))
      .rejects
      .toStrictEqual(Error('Schema file URL not found'))
  })

  test('invalid URL', async () => {
    const schemaFilePath = data.openapiSchemas['remote-invalid-url']
    await expect(SchemExtractor.fromUrl(schemaFilePath))
      .rejects
      .toStrictEqual(Error('Invalid schema file URL'))
  })
})

describe('fromObject', () => {
  test('petstore.yaml v3.0', async () => {
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-yaml-v3.0']))
    const schemaObject = yaml.safeLoad(schemaBuffer.toString())
    await expect(SchemExtractor.fromObject(schemaObject))
      .resolves
      .toStrictEqual(data.resultWithParameters)
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
  test('petstore.yaml v3.0', async () => {
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-yaml-v3.0']))
    await expect(SchemExtractor.fromString(schemaBuffer.toString()))
      .resolves
      .toStrictEqual(data.resultWithParameters)
  })

  test('invalid schema string (empty)', async () => {
    const schemaString = ''
    await expect(SchemExtractor.fromString(schemaString))
      .rejects
      .toStrictEqual(Error('Expected a file path, URL, or object. Got undefined'))
  })
})
