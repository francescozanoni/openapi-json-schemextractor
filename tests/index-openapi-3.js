"use strict";

const yaml = require('js-yaml');
const nock = require('nock');

const SchemExtractor = require("../lib/index");
const FilePathManager = require("../lib/file-path-manager");

const data = require("./data");

describe("fromFile", () => {

    test("local petstore.yaml v3.0", async () => {
        const schemaFilePath = data.openapiSchemas["local-yaml-v3.0"];
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(data.resultWithParameters);
    });

    test("inexistent file path", async () => {
        const schemaFilePath = data.openapiSchemas["local-inexistent"];
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Schema file path not found"));
    });

    // @todo improve this logic, by adding tests on Windows and Mac OS environments
    if (process.env.USER !== "root" &&
        FilePathManager.isFilePathValid("/root") === true) {
        test("unreadable file path", async () => {
            await expect(SchemExtractor.fromFile("/root"))
                .rejects
                .toStrictEqual(Error("Schema file path not readable"));
        });
    }

    test("invalid file path (number)", async () => {
        const schemaFilePath = data.openapiSchemas["local-invalid-path"];
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Input schema file path is not a string"));
    });

    test("remote petstore.yaml v3.0", async () => {

        // Mock HTTP server
        const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas["local-yaml-v3.0"]);
        const schemaHost = data.openapiSchemas["remote-yaml-v3.0"].substr(0, 33);
        const schemaPath = data.openapiSchemas["remote-yaml-v3.0"].substr(33);
        nock(schemaHost)
            .get(schemaPath)
            .reply(200, schemaString);
        // HEAD method must be mocked because it's used by url-exist package
        nock(schemaHost)
            .head(schemaPath)
            .reply(200, "");

        await expect(SchemExtractor.fromFile(data.openapiSchemas["remote-yaml-v3.0"]))
            .resolves
            .toStrictEqual(data.resultWithParameters);
    });

    test("inexistent URL", async () => {

        // Mock HTTP server
        const schemaHost = data.openapiSchemas["remote-inexistent"].substr(0, 33);
        const schemaPath = data.openapiSchemas["remote-inexistent"].substr(33);
        nock(schemaHost)
            .get(schemaPath)
            .reply(404, "");
        // HEAD method must be mocked because it's used by url-exist package
        nock(schemaHost)
            .head(schemaPath)
            .reply(404, "");

        await expect(SchemExtractor.fromFile(data.openapiSchemas["remote-inexistent"]))
            .rejects
            .toStrictEqual(Error("Schema file URL not found"));
    });

});

describe("fromObject", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas["local-yaml-v3.0"]);
        const schemaObject = yaml.safeLoad(schemaString);
        await expect(SchemExtractor.fromObject(schemaObject))
            .resolves
            .toStrictEqual(data.resultWithParameters);
    });

    test("invalid schema object (number)", async () => {
        const schemaObject = 123;
        await expect(SchemExtractor.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Input schema is not an object"));
    });

    test("invalid schema object (empty object)", async () => {
        const schemaObject = {};
        await expect(SchemExtractor.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Invalid input schema: no model schemas found"));
    });

});

describe("fromString", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(data.openapiSchemas["local-yaml-v3.0"]);
        await expect(SchemExtractor.fromString(schemaString))
            .resolves
            .toStrictEqual(data.resultWithParameters);
    });

    test("invalid schema string (empty)", async () => {
        const schemaString = "";
        await expect(SchemExtractor.fromString(schemaString))
            .rejects
            .toStrictEqual(Error("Expected a file path, URL, or object. Got undefined"));
    });

});