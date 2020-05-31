"use strict";

const FilePathManager = require("../lib/file-path-manager");

describe("isFilePathReadable", () => {

    test("readable file path", () => {
        expect(FilePathManager.isFilePathReadable("./package.json"))
            .toStrictEqual(true);
    });

    test("inexistent file path", () => {
        expect(FilePathManager.isFilePathReadable("./a"))
            .toStrictEqual(false);
    });

    // @todo improve this logic, by adding tests on Windows and Mac OS environments
    if (FilePathManager.isFilePathValid("/root") === true) {
        test("unreadable file path (Linux)", () => {
            expect(FilePathManager.isFilePathReadable("/root"))
                .toStrictEqual(false);
        });
    }

});