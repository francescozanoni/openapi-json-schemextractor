'use strict'

const appRoot = require('app-root-path')

const helpers = require(appRoot.resolve('/lib/helpers'))

describe('isObject', () => {
  const trueValues = [
    {}, { a: 1 }, Object.create({})
  ]

  const falseValues = [
    null, [], 123, function () {}, undefined
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isObject(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isObject(value))
        .toStrictEqual(false)
    })
  }
})

describe('isArray', () => {
  const trueValues = [
    [], [1, 2, 3]
  ]

  const falseValues = [
    null, {}, 123, function () {}, undefined, Object.create({})
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isArray(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isArray(value))
        .toStrictEqual(false)
    })
  }
})

describe('isString', () => {
  const trueValues = [
    'a', '', ' '
  ]

  const falseValues = [
    null, {}, [], 123, function () {}, Object.create({}), undefined
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isString(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isString(value))
        .toStrictEqual(false)
    })
  }
})

describe('isUndefined', () => {
  const trueValues = [
    undefined
  ]

  const falseValues = [
    null, '', 0, 123, function () {}, {}, [], Object.create({})
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isUndefined(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isUndefined(value))
        .toStrictEqual(false)
    })
  }
})

describe('isEmpty', () => {
  const trueValues = [
    {}, [], Object.create({})
  ]

  const falseValues = [
    null, '', 0, 123, function () {}, undefined
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isEmpty(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isEmpty(value))
        .toStrictEqual(false)
    })
  }
})

describe('isJsonObject', () => {
  const trueValues = [
    '{}', '  { }  ', '{"a":1}', '{"a":[]}', '{"a":{}}'
  ]

  const falseValues = [
    null, {}, 123, function () {}, undefined, Object.create({}),
    '[]', 'a', '1', '{a:1}', '{a:[]', '{a:{a}}'
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isJsonObject(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isJsonObject(value))
        .toStrictEqual(false)
    })
  }
})

describe('isYamlObject', () => {
  const trueValues = [
    'a:\n  b: 1', 'a: 2'
  ]

  const falseValues = [
    null, {}, 123, function () {}, undefined, Object.create({}),
    '', ' - 1\n - 2', 'a:['
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isYamlObject(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isYamlObject(value))
        .toStrictEqual(false)
    })
  }
})

describe('isWebUrl', () => {
  const trueValues = [
    'http://example.com', 'https://example.com'
  ]

  const falseValues = [
    null, '', 0, 123, function () {}, undefined, {}, [], Object.create({}),
    'ftp://example.com', 'http://', 'https://'
  ]

  for (const value of trueValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isWebUrl(value))
        .toStrictEqual(true)
    })
  }

  for (const value of falseValues) {
    test('' + JSON.stringify(value), () => {
      expect(helpers.isWebUrl(value))
        .toStrictEqual(false)
    })
  }
})

describe('removeKeyFromObject', () => {
  const before = {
    a: 1,
    b: 2,
    c: {
      a: 3,
      b: 4
    },
    z: [
      5,
      {
        b: 5
      }
    ]
  }

  test('found key', () => {
    const after = {
      a: 1,
      c: {
        a: 3
      },
      z: [
        5,
        {}
      ]
    }
    expect(helpers.removeKeyFromObject(before, 'b'))
      .toStrictEqual(after)
  })

  test('found key with value', () => {
    const after = {
      a: 1,
      b: 2,
      c: {
        a: 3
      },
      z: [
        5,
        {
          b: 5
        }
      ]
    }
    expect(helpers.removeKeyFromObject(before, 'b', [4]))
      .toStrictEqual(after)
  })

  test('found key with values', () => {
    const after = {
      a: 1,
      c: {
        a: 3
      },
      z: [
        5,
        {
          b: 5
        }
      ]
    }
    expect(helpers.removeKeyFromObject(before, 'b', [2, 4, 1]))
      .toStrictEqual(after)
  })

  test('found key but not matching values', () => {
    expect(helpers.removeKeyFromObject(before, 'b', ['d', 3]))
      .toStrictEqual(before)
  })

  test('not found key', () => {
    expect(helpers.removeKeyFromObject(before, 'd'))
      .toStrictEqual(before)
  })

  test('empty object', () => {
    const before = {}
    expect(helpers.removeKeyFromObject(before, 'a'))
      .toStrictEqual(before)
  })

  test('invalid object (string)', () => {
    const before = 'a'
    // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
    expect(() => {
      helpers.removeKeyFromObject(before, 'b')
    })
      .toThrow(Error('Invalid input object: "a"'))
  })

  test('invalid object (null)', () => {
    const before = null
    expect(() => {
      helpers.removeKeyFromObject(before, 'b')
    })
      .toThrow(Error('Invalid input object: null'))
  })

  test('invalid object (array)', () => {
    const before = ['a', 'b', 'c']
    expect(() => {
      helpers.removeKeyFromObject(before, 'b')
    })
      .toThrow(Error('Invalid input object: ["a","b","c"]'))
  })

  test('invalid keyToRemove (numeric)', () => {
    expect(() => {
      helpers.removeKeyFromObject(before, 1)
    })
      .toThrow(Error('Invalid input keyToRemove: 1'))
  })

  test('invalid keyToRemove (null)', () => {
    // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
    expect(() => {
      helpers.removeKeyFromObject(before, null)
    })
      .toThrow(Error('Invalid input keyToRemove: null'))
  })

  test('invalid valuesToCheck (null)', () => {
    expect(() => {
      helpers.removeKeyFromObject(before, 'b', null)
    })
      .toThrow(Error('Invalid input valuesToCheck: null'))
  })
})
