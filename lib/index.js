/* istanbul ignore file */

'use strict'

// Style check and tests are skipped on purpose on this file.

// @see https://medium.com/@nirsky/make-your-npm-package-work-on-both-node-js-and-browser-58bff1a18f55
// @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
if ((new Function('try { return this === window; } catch(e) { return false; }'))() === true) {
  module.exports = require('./browser-handler')
} else if ((new Function('try { return this === global; } catch(e) { return false; }'))() === true) {
  module.exports = require('./node-handler')
} else {
  throw Error('Unexpected environment')
}
