"use strict";

const yaml = require('js-yaml');
const nock = require('nock');

const SchemExtractor = require("../lib/index-browser");
const FilePathManager = require("../lib/file-path-manager");

const schemaLocalFilePath = "./node_modules/oas-schemas/examples/v3.0/petstore.yaml";
const schemaInexistentFilePath = "../petstore.yaml";

const data = require("./data");

describe("fromFile", () => {

    test("invalid URL: local petstore.yaml v3.0", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: inexistent file path", async () => {
        await expect(SchemExtractor.fromFile(schemaInexistentFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: invalid file path (number)", async () => {
        const schemaFilePath = 123;
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Input schema file URL is not a string"));
    });

    test("remote petstore.yaml v3.0", async () => {

        // Mock HTTP server
        const schemaString = FilePathManager.readFilePathToString(schemaLocalFilePath);
        nock("https://raw.githubusercontent.com")
            .get("/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml")
            .reply(200, schemaString);
        // HEAD method must be mocked because it's used by url-exist package
        nock("https://raw.githubusercontent.com")
            .head("/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml")
            .reply(200, "");

        const schemaFilePath = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(data.resultWithParameters);
    });

    test("invalid URL", async () => {

        // Mock HTTP server
        nock("https://raw.githubusercontent.com")
            .get("/OAI/OpenAPI-Specification/master/examples/v3.0/nooooo.yaml")
            .reply(404, "");
        // HEAD method must be mocked because it's used by url-exist package
        nock("https://raw.githubusercontent.com")
            .head("/OAI/OpenAPI-Specification/master/examples/v3.0/nooooo.yaml")
            .reply(404, "");

        const schemaFilePath = "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/nooooo.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Schema file path not found"));
    });

});

describe("fromFile without some keys", () => {

    test("invalid URL: petstore.yaml v3.0", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath, data.keysToRemove))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: invalid data.keysToRemove", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath, 123))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

});

describe("fromObject", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(schemaLocalFilePath);
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

describe("fromObject without some keys", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(schemaLocalFilePath);
        const schemaObject = yaml.safeLoad(schemaString);
        await expect(SchemExtractor.fromObject(schemaObject, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithParametersWithoutRemovedKeys);
    });

});

describe("fromString", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(schemaLocalFilePath);
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

describe("fromString without some keys", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(schemaLocalFilePath);
        await expect(SchemExtractor.fromString(schemaString, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithParametersWithoutRemovedKeys);
    });

});