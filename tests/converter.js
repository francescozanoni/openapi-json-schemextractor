"use strict";

const Converter = require("../lib/index");
const fs = require("fs");

describe("fromFile", () => {

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

    test("petstore.yaml v2.0", async () => {
        let schemaFilePath = "node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        let schemaFilePath = "node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.yaml v3.0", async () => {
        let schemaFilePath = "node_modules/oas-schemas/examples/v3.0/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath))
            .resolves
            .toStrictEqual(result);
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
        let schemaFilePath = "node_modules/oas-schemas/examples/v2.0/yaml/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.json v2.0", async () => {
        let schemaFilePath = "node_modules/oas-schemas/examples/v2.0/json/petstore.json";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

    test("petstore.yaml v3.0", async () => {
        let schemaFilePath = "node_modules/oas-schemas/examples/v3.0/petstore.yaml";
        await expect(Converter.fromFile(schemaFilePath, keysToRemove))
            .resolves
            .toStrictEqual(result);
    });

});

describe("fromObject", () => {

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

    test("petstore.json v2.0", async () => {
        let schemaObject = require("../node_modules/oas-schemas/examples/v2.0/json/petstore.json");
        await expect(Converter.fromObject(schemaObject))
            .resolves
            .toStrictEqual(result);
    });

});

describe("fromString", () => {

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

    test("petstore.json v2.0", async () => {
        fs.readFile("file://../node_modules/oas-schemas/examples/v2.0/json/petstore.json", null, async function(error, schemaStringBuffer) {
            await expect(Converter.fromString(schemaStringBuffer.toString()))
                .resolves
                .toStrictEqual(result);
        });

    });

});