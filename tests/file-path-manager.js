"use strict";

const FilePathManager = require("../lib/file-path-manager");

describe("isFilePathReadable", () => {

    test("yes", () => {
        expect(FilePathManager.isFilePathReadable("../package.json"))
            .toStrictEqual(true);
    });

    test("no", () => {
        expect(FilePathManager.isFilePathReadable("../a"))
            .toStrictEqual(false);
    });

});