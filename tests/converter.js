"use strict";

const Converter = require("../lib/index");
const fs = require("fs");
const appRoot = require("app-root-path");

const result = {
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

describe("fromFile", () => {

    test("petstore.yaml v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.yaml v3.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v3.0/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("inexistent file path", async () => {
        let schemaFilePath = appRoot + "/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Schema file path not found"));
    });

    test("invalid file path (number)", async () => {
        let schemaFilePath = 123;
        await expect(Converter.fromFile(schemaFilePath))
            .rejects
            .toStrictEqual(Error("Input schema file path is not a string"));
    });

});

describe("fromFile without some keys", () => {

    const result = {
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

    const keysToRemove = [
        "tag", // model attribute
        "Pets", // model name
        "error" // this does not match model name "Error" because search is case-sensitive
    ];

    test("petstore.yaml v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.yaml v3.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v3.0/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

    test("invalid keysToRemove", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v3.0/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, 123))
            .rejects
            .toStrictEqual(Error("Invalid input keysToRemove"));
    });

});

describe("fromObject", () => {

    test("petstore.json v2.0", async () => {
        let schemaObject = require(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromObject(schemaObject))
            .resolves
            .toStrictEqual(result);
    });

});

describe("fromString", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaStringBuffer = fs.readFileSync(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        const schemaString = schemaStringBuffer.toString();
        await expect(Converter.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        const schemaStringBuffer = fs.readFileSync(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        const schemaString = schemaStringBuffer.toString();
        await expect(Converter.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.yaml v3.0", async () => {
        const schemaStringBuffer = fs.readFileSync(appRoot + "/node_modules/oas-schemas/examples/v3.0/petstore.yaml");
        const schemaString = schemaStringBuffer.toString();
        await expect(Converter.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

});