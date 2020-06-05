'use strict'

const fs = require('fs')

module.exports = {

  /**
     * @param {String} filePath
     *
     * @returns {Boolean}
     *
     * @see https://attacomsian.com/blog/nodejs-check-if-file-readable-writable-executable
     */
  isFilePathReadable: function (filePath) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK)
      return true
    } catch (err) {
      return false
    }
  },

  /**
     * @param {String} filePath
     *
     * @returns {String}
     */
  readFilePathToString: function (filePath) {
    const buffer = fs.readFileSync(filePath)
    return buffer.toString()
  },

  /**
     * @param {String} filePath
     *
     * @returns {Boolean}
     */
  isFilePathValid: function (filePath) {
    return fs.existsSync(filePath)
  }

}
