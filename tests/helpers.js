"use strict";

const appRoot = require("app-root-path");
const helpers = require(appRoot + "/lib/helpers");

describe("removeKeyFromObject", () => {

    const before = {
        a: 1,
        b: 2,
        c: {
            a: 3,
            b: 4
        }
    };

    test("found key", () => {
        const after = {
            a: 1,
            c: {
                a: 3
            }
        };
        expect(helpers.removeKeyFromObject(before, "b"))
            .toStrictEqual(after);
    });

    test("found key with value", () => {
        const after = {
            a: 1,
            b: 2,
            c: {
                a: 3
            }
        };
        expect(helpers.removeKeyFromObject(before, "b", [4]))
            .toStrictEqual(after);
    });

    test("found key with values", () => {
        const after = {
            a: 1,
            c: {
                a: 3
            }
        };
        expect(helpers.removeKeyFromObject(before, "b", [2, 4, 1]))
            .toStrictEqual(after);
    });

    test("found key but not matching values", () => {
        expect(helpers.removeKeyFromObject(before, "b", ["d", 3]))
            .toStrictEqual(before);
    });

    test("not found key", () => {
        expect(helpers.removeKeyFromObject(before, "d"))
            .toStrictEqual(before);
    });

    test("empty object", () => {
        const before = {};
        expect(helpers.removeKeyFromObject(before, "a"))
            .toStrictEqual(before);
    });

    test("invalid object (string)", () => {
        const before = "a";
        // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
        expect(() => {
            helpers.removeKeyFromObject(before, "b");
        })
            .toThrow(/^Invalid input object: "a"$/);
    });

    test("invalid object (null)", () => {
        const before = null;
        expect(() => {
            helpers.removeKeyFromObject(before, "b");
        })
            .toThrow(/^Invalid input object: null$/);
    });

    test("invalid object (array)", () => {
        const before = ["a", "b", "c"];
        expect(() => {
            helpers.removeKeyFromObject(before, "b");
        })
            .toThrow(/^Invalid input object: \["a","b","c"\]$/);
    });

    test("invalid key (numeric)", () => {
        expect(() => {
            helpers.removeKeyFromObject(before, 1);
        })
            .toThrow(/^Invalid input keyToRemove: 1$/);
    });

    test("invalid key (null)", () => {
        // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
        expect(() => {
            helpers.removeKeyFromObject(before, null);
        })
            .toThrow(/^Invalid input keyToRemove: null$/);
    });

});

describe("isFilePathReadable", () => {

    test("yes", () => {
        expect(helpers.isFilePathReadable(appRoot + "/package.json"))
            .toStrictEqual(true);
    });

    test("no", () => {
        expect(helpers.isFilePathReadable(appRoot + "/a"))
            .toStrictEqual(false);
    });

});