"use strict";

const YAML = require("yamljs");
const appRoot = require("app-root-path");
const Converter = require(appRoot + "/lib/index");
const helpers = require(appRoot + "/lib/helpers");

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
const keysToRemove = [
    "tag", // model attribute
    "Pets", // model name
    "error" // this does not match model name "Error" because search is case-sensitive
];
const resultWithoutRemovedKeys = {
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

    test("petstore.yaml v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

    test("petstore.json v2.0", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

    test("invalid keysToRemove", async () => {
        let schemaFilePath = appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, 123))
            .rejects
            .toStrictEqual(Error("Invalid input keysToRemove"));
    });

});

describe("fromObject", () => {

    test("petstore.yaml v2.0", async () => {
        let schemaObject = YAML.load(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(Converter.fromObject(schemaObject))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        let schemaObject = require(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromObject(schemaObject))
            .resolves
            .toStrictEqual(result);
    });

    test("invalid schema object (number)", async () => {
        let schemaObject = 123;
        await expect(Converter.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Input schema is not an object"));
    });

    test("invalid schema object (empty object)", async () => {
        let schemaObject = {};
        await expect(Converter.fromObject(schemaObject))
            .rejects
            .toStrictEqual(Error("Invalid input schema: no model schemas found"));
    });

});

describe("fromObject without some keys", () => {

    test("petstore.yaml v2.0", async () => {
        let schemaObject = YAML.load(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(Converter.fromObject(schemaObject, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

    test("petstore.json v2.0", async () => {
        let schemaObject = require(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromObject(schemaObject, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

});

describe("fromString", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = helpers.readFile(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(Converter.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        const schemaString = helpers.readFile(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromString(schemaString))
            .resolves
            .toStrictEqual(result);
    });

    test("invalid schema string (empty)", async () => {
        const schemaString = "";
        await expect(Converter.fromString(schemaString))
            .rejects
            .toStrictEqual(Error("Expected a file path, URL, or object. Got null"));
    });

});

describe("fromString without some keys", () => {

    test("petstore.yaml v2.0", async () => {
        const schemaString = helpers.readFile(appRoot + "/node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml");
        await expect(Converter.fromString(schemaString, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

    test("petstore.json v2.0", async () => {
        const schemaString = helpers.readFile(appRoot + "/node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromString(schemaString, keysToRemove))
            .resolves
            .toStrictEqual(resultWithoutRemovedKeys);
    });

});