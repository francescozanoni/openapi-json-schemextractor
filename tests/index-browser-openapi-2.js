"use strict";

const yaml = require('js-yaml');

const appRoot = require("app-root-path");
const SchemExtractor = require(appRoot + "/lib/index-browser");
const FilePathManager = require(appRoot + "/lib/file-path-manager");

const data = require(appRoot + "/tests/data");

describe("fromFile", () => {

    test("invalid URL: petstore.yaml v2.0", async () => {
        const schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: petstore.json v2.0", async () => {
        const schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: inexistent file path", async () => {
        const schemaFilePath = appRoot + "/petstore.yaml";
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

});

describe("fromFile without some keys", () => {

    test("invalid URL: petstore.yaml v2.0", async () => {
        const schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath, data.keysToRemove))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: petstore.json v2.0", async () => {
        const schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(SchemExtractor.fromFile(schemaFilePath, data.keysToRemove))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

    test("invalid URL: invalid keysToRemove", async () => {
        const schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(SchemExtractor.fromFile(schemaFilePath, 123))
            .rejects
            .toStrictEqual(Error("Invalid schema file URL"));
    });

});

describe("fromObject", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        const schemaObject = yaml.safeLoad(schemaString);
        await expect(SchemExtractor.fromObject(schemaObject))
            .resolves
            .toStrictEqual(data.result);
    });

    test("petstore.json v2.0", async () => {
        const schemaObject = require(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
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

describe("fromObject without some keys", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        const schemaObject = yaml.safeLoad(schemaString);
        await expect(SchemExtractor.fromObject(schemaObject, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithoutRemovedKeys);
    });

    test("petstore.json v2.0", async () => {
        const schemaObject = require(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(SchemExtractor.fromObject(schemaObject, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithoutRemovedKeys);
    });

});

describe("fromString", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(SchemExtractor.fromString(schemaString))
            .resolves
            .toStrictEqual(data.result);
    });

    test("petstore.json v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
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

describe("fromString without some keys", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(SchemExtractor.fromString(schemaString, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithoutRemovedKeys);
    });

    test("petstore.json v2.0", async () => {
        const schemaString = FilePathManager.readFilePathToString(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(SchemExtractor.fromString(schemaString, data.keysToRemove))
            .resolves
            .toStrictEqual(data.resultWithoutRemovedKeys);
    });

});