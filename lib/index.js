/* istanbul ignore file */

'use strict'

// Style check and tests on this file are skipped on purpose.

/**
 * @type {Function}
 *
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 */
const isBrowser = new Function('try { return this === window; } catch(e) { return false; }');

/**
 * @type {Function}
 *
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 */
const isNode = new Function('try { return this === global; } catch(e) { return false; }');

// @see https://medium.com/@nirsky/make-your-npm-package-work-on-both-node-js-and-browser-58bff1a18f55
if (isBrowser() === true) {
  module.exports = require('./browser-handler')
} else if (isNode() === true) {
  module.exports = require('./node-handler')
} else {
  throw Error('Unexpected environment')
}
