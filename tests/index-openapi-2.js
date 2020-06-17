'use strict'

/**
 * @jest-environment jsdom
 */

const yaml = require('js-yaml')
const fs = require('fs')
const appRoot = require('app-root-path')

const SchemExtractor = require(appRoot.resolve('/lib/index'))

const data = require(appRoot.resolve('/tests/data'))

describe('fromObject', () => {
  test('petstore.yaml v2.0', async () => {
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-yaml-v2.0']))
    const schemaObject = yaml.safeLoad(schemaBuffer.toString())
    await expect(SchemExtractor.fromObject(schemaObject))
      .resolves
      .toStrictEqual(data.result)
  })

  test('petstore.json v2.0', async () => {
    const schemaObject = require(appRoot.resolve(data.openapiSchemas['local-json-v2.0']))
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
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-yaml-v2.0']))
    await expect(SchemExtractor.fromString(schemaBuffer.toString()))
      .resolves
      .toStrictEqual(data.result)
  })

  test('petstore.json v2.0', async () => {
    const schemaBuffer = fs.readFileSync(appRoot.resolve(data.openapiSchemas['local-json-v2.0']))
    await expect(SchemExtractor.fromString(schemaBuffer.toString()))
      .resolves
      .toStrictEqual(data.result)
  })

  test('invalid schema string (empty)', async () => {
    const schemaString = ''
    await expect(SchemExtractor.fromString(schemaString))
      .rejects
      .toStrictEqual(Error('Input schema string is neither a valid JSON object nor a valid YAML object'))
  })

  test('invalid schema string (number)', async () => {
    const schemaString = 123
    await expect(SchemExtractor.fromString(schemaString))
      .rejects
      .toStrictEqual(Error('Input schema is not a string'))
  })
})
