"use strict";

const YAML = require("yamljs");
const nock = require('nock');

const appRoot = require("app-root-path");
const SchemExtractor = require(appRoot + "/lib/index");
const helpers = require(appRoot + "/lib/helpers");

const schemaLocalFilePath = appRoot + "/node_modules/oas-schemas/examples/v3.0/petstore.yaml";
const schemaInexistentFilePath = appRoot + "/petstore.yaml";

const result = {
    "/pets/{petId}_get_petId": {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "string"
    },
    "/pets_get_limit": {
        $schema: "http://json-schema.org/draft-04/schema#",
        format: "int32",
        type: "integer"
    },
    Error: {
        $schema: "http://json-schema.org/draft-04/schema#",
        properties: {
            code: {
                format: "int32",
                type: "integer"
            },
            message: {
                type: "string"
            }
        },
        required: [
            "code",
            "message"
        ],
        type: "object"
    },
    Pet: {
        $schema: "http://json-schema.org/draft-04/schema#",
        properties: {
            id: {
                format: "int64",
                type: "integer"
            },
            name: {
                type: "string"
            },
            tag: {
                type: "string"
            }
        },
        required: [
            "id",
            "name"
        ],
        type: "object"
    },
    Pets: {
        $schema: "http://json-schema.org/draft-04/schema#",
        items: {
            properties: {
                id: {
                    format: "int64",
                    type: "integer"
                },
                name: {
                    type: "string"
                },
                tag: {
                    type: "string"
                }
            },
            required: [
                "id",
                "name"
            ],
            type: "object"
        },
        type: "array"
    }
};
const keysToRemove = [
    "tag", // model attribute
    "Pets", // model name
    "error" // this does not match model name "Error" because search is case-sensitive
];
const resultWithoutRemovedKeys = {
    "/pets/{petId}_get_petId": {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "string"
    },
    "/pets_get_limit": {
        $schema: "http://json-schema.org/draft-04/schema#",
        format: "int32",
        type: "integer"
    },
    Error: {
        $schema: "http://json-schema.org/draft-04/schema#",
        properties: {
            code: {
                format: "int32",
                type: "integer"
            },
            message: {
                type: "string"
            }
        },
        required: [
            "code",
            "message"
        ],
        type: "object"
    },
    Pet: {
        $schema: "http://json-schema.org/draft-04/schema#",
        properties: {
            id: {
                format: "int64",
                type: "integer"
            },
            name: {
                type: "string"
            }
        },
        required: [
            "id",
            "name"
        ],
        type: "object"
    }
};

describe("fromFile", () => {

    test("local petstore.yaml v3.0", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("inexistent file path", async () => {
        await expect(SchemExtractor.fromFile(schemaInexistentFilePath))
            .rejects
            .toStrictEqual(Error("Schema file path not found"));
    });

    test("invalid file path (number)", async () => {
        let schemaFilePath = 123;
        await expect(SchemExtractor.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Input schema file path is not a string"));
    });

    test("remote petstore.yaml v3.0", async () => {

        // Mock HTTP server
        const schemaString = helpers.readFile(schemaLocalFilePath);
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
            .toStrictEqual(result);
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

    test("petstore.yaml v3.0", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

    test("invalid keysToRemove", async () => {
        await expect(SchemExtractor.fromFile(schemaLocalFilePath, 123))
            .rejects
            .toStrictEqual(Error("Invalid input keysToRemove"));
    });

});

describe("fromObject", () => {

    test("petstore.yaml v3.0", async () => {
        let schemaObject = YAML.load(schemaLocalFilePath);
        await expect(SchemExtractor.fromObject(schemaObject))
            .resolves
            .toStrictEqual(result);
    });

    test("invalid schema object (number)", async () => {
        let schemaObject = 123;
        await expect(SchemExtractor.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Input schema is not an object"));
    });

    test("invalid schema object (empty object)", async () => {
        let schemaObject = {};
        await expect(SchemExtractor.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Invalid input schema: no model schemas found"));
    });

});

describe("fromObject without some keys", () => {

    test("petstore.yaml v3.0", async () => {
        let schemaObject = YAML.load(schemaLocalFilePath);
        await expect(SchemExtractor.fromObject(schemaObject, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

});

describe("fromString", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = helpers.readFile(schemaLocalFilePath);
        await expect(SchemExtractor.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

    test("invalid schema string (empty)", async () => {
        const schemaString = "";
        await expect(SchemExtractor.fromString(schemaString))
            .rejects
            .toStrictEqual(Error("Expected a file path, URL, or object. Got null"));
    });

});

describe("fromString without some keys", () => {

    test("petstore.yaml v3.0", async () => {
        const schemaString = helpers.readFile(schemaLocalFilePath);
        await expect(SchemExtractor.fromString(schemaString, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

});