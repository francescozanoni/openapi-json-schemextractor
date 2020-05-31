"use strict";

const FilePathManager = require("../lib/file-path-manager");

describe("isFilePathReadable", () => {

    test("yes", () => {
        expect(FilePathManager.isFilePathReadable("./package.json"))
            .toStrictEqual(true);
    });

    test("no (does nor exist)", () => {
        expect(FilePathManager.isFilePathReadable("./a"))
            .toStrictEqual(false);
    });
    
    if (FilePathManager.isFilePathValid("/root") === true) {
        test("no (really not readable)", () => {
            expect(FilePathManager.isFilePathReadable("/root"))
                .toStrictEqual(false);
        });
    }

});