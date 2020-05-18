"use strict";

const helpers = require("../src/helpers");

describe("Helpers", () => {

    test("removeKeyFromObject", () => {
        const before = {
            a: 1,
            b: 2,
            c: {
                a: 3,
                b: 4
            }
        };
        const after = {
            a: 1,
            c: {
                a: 3
            }
        };
        expect(helpers.removeKeyFromObject(before, "b")).toBe(after);
    });

});


