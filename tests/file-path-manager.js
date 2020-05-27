"use strict";

const appRoot = require("app-root-path");
const FilePathManager = require(appRoot + "/lib/file-path-manager");

describe("isFilePathReadable", () => {

    test("yes", () => {
        expect(FilePathManager.isFilePathReadable(appRoot + "/package.json"))
            .toStrictEqual(true);
    });

    test("no", () => {
        expect(FilePathManager.isFilePathReadable(appRoot + "/a"))
            .toStrictEqual(false);
    });

});