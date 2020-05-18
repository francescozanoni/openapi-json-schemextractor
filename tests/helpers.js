"use strict";

const helpers = require("../lib/helpers");

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
