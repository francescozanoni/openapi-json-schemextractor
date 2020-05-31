"use strict";

/**
 * @jest-environment jsdom
 */

const yaml = require('js-yaml');
const nock = require('nock');

const SchemExtractor = require("../lib/index-browser");
const FilePathManager = require("../lib/file-path-manager");

const data = require("./data");

describe("fromFile", () => {

    test("invalid URL: petstore.yaml v2.0", async () => {
        const schemaFilePath = "../node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: petstore.json v2.0", async () => {
        const schemaFilePath = "../node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: inexistent file path", async () => {
        const schemaFilePath = "../petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid file path (number)", async () => {
        const schemaFilePath = 123;
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Input schema file URL is not a string"));
    });
    
    test("empty-openapi.json", async () => {

        // Mock HTTP server
        const schemaString = FilePathManager.readFilePathToString("./tests/empty-openapi.json");
        nock("https://raw.githubusercontent.com")
            .get("/empty-openapi.json")
            .reply(200, schemaString);
        // HEAD method must be mocked because it's used by url-exist package
        nock("https://raw.githubusercontent.com")
            .head("/empty-openapi.json")
            .reply(200, "");

        const schemaFilePath = "https://raw.githubusercontent.com/empty-openapi.json";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid input schema: no model schemas found"));
            
    });

});

describe("fromObject", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString("./node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        const schemaObject = yaml.safeLoad(schemaString);
        await expect(SchemExtractor.fromObject(schemaObject))
            .resolves
            .toStrictEqual(data.result);
    });

    test("petstore.json v2.0", async () => {
        const schemaObject = require("../node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(SchemExtractor.fromObject(schemaObject))
            .resolves
            .toStrictEqual(data.result);
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

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString("./node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(SchemExtractor.fromString(schemaString))
            .resolves
            .toStrictEqual(data.result);
    });

    test("petstore.json v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString("./node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(SchemExtractor.fromString(schemaString))
            .resolves
            .toStrictEqual(data.result);
    });

    test("invalid schema string (empty)", async () => {
        const schemaString = "";
        await expect(SchemExtractor.fromString(schemaString))
            .rejects
            .toStrictEqual(Error("Expected a file path, URL, or object. Got undefined"));
    });

});