'use strict'

const FilePathManager = require('../lib/file-path-manager')

describe('isFilePathReadable', () => {
  test('readable file path', () => {
    expect(FilePathManager.isFilePathReadable('./package.json'))
      .toStrictEqual(true)
  })

  test('inexistent file path', () => {
    expect(FilePathManager.isFilePathReadable('./a'))
      .toStrictEqual(false)
  })

  // @todo improve this logic, by adding tests on Windows and Mac OS environments
  // Check "process.env.USER !== 'root'" cannot be used because
  // some environments do not have USER populated, e.g. Node Docker images.
  if (process.env.HOME !== '/root' &&
        FilePathManager.isFilePathValid('/root') === true) {
    test('unreadable file path (Linux)', () => {
      expect(FilePathManager.isFilePathReadable('/root'))
        .toStrictEqual(false)
    })
  }
})

describe('readFilePathToString', () => {
  test('to existing file', () => {
    expect(FilePathManager.readFilePathToString('./.travis.yml'))
      .toStrictEqual('language: node_js\n' +
                'node_js:\n' +
                "  - '10'\n" +
                "  - '12'\n" +
                "  - '14'\n" +
                'install:\n' +
                '  - yarn\n' +
                'script: yarn run check && yarn test\n' +
                'after_success:\n' +
                '- travis_retry yarn test --coverage && node_modules/.bin/coveralls < coverage/lcov.info\n')
  })

  test('to existing directory', () => {
    // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
    expect(() => {
      FilePathManager.readFilePathToString('./lib')
    })
      .toThrow(Error('EISDIR: illegal operation on a directory, read'))
  })

  test('to inexistent file', () => {
    // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
    expect(() => {
      FilePathManager.readFilePathToString('./a')
    })
      .toThrow(Error("ENOENT: no such file or directory, open './a'"))
  })
})

describe('isFilePathValid', () => {
  test('to existing file', () => {
    expect(FilePathManager.isFilePathValid('./package.json'))
      .toStrictEqual(true)
  })

  test('to existing directory', () => {
    expect(FilePathManager.isFilePathValid('./lib'))
      .toStrictEqual(true)
  })

  test('to inexistent file', () => {
    expect(FilePathManager.isFilePathValid('./a'))
      .toStrictEqual(false)
  })

  test('URL', () => {
    expect(FilePathManager.isFilePathValid('http://example.com'))
      .toStrictEqual(false)
  })
})
