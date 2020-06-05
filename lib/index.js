'use strict'

const helpers = require('./helpers')
const SchemExtractorForBrowser = require('./index-browser')
const FilePathManager = require('./file-path-manager')

const SchemExtractor = Object.create(SchemExtractorForBrowser)

/**
 * @param {String} schemaFilePath OpenAPI schema as path to file
 *
 * @returns {Promise<Object>}
 */
SchemExtractor.fromFile = async function (schemaFilePath) {
  if (helpers.isString(schemaFilePath) === false) {
    throw Error('Input schema file path is not a string')
  }

  if (helpers.isWebUrl(schemaFilePath) === true) {
    return await SchemExtractorForBrowser.fromFile(schemaFilePath)
  }

  if (FilePathManager.isFilePathValid(schemaFilePath) === false) {
    throw Error('Schema file path not found')
  }

  if (FilePathManager.isFilePathReadable(schemaFilePath) === false) {
    throw Error('Schema file path not readable')
  }

  const schemaString = FilePathManager.readFilePathToString(schemaFilePath)

  return await this.fromString(schemaString)
}

module.exports = SchemExtractor
