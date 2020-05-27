"use strict";

const appRoot = require("app-root-path");
const JSONSchemaManager = require(appRoot + "/lib/json-schema-manager");

describe("JSONSchemaManager.fix", () => {

    test("type is added to model", () => {
        const before = {
            required: [
                "id"
            ],
            properties: {
                id: {
                    type: "integer",
                    format: "int64"
                },
                tag: {
                    type: "string"
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        const after = {
            type: "object",
            required: [
                "id"
            ],
            properties: {
                id: {
                    type: "integer",
                    format: "int64"
                },
                tag: {
                    type: "string"
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        expect(JSONSchemaManager.fix(before))
            .toStrictEqual(after);
    });

    test("type is added to model's item property", () => {
        const before = {
            type: "array",
            items: {
                required: [
                    "id",
                ],
                properties: {
                    id: {
                        type: "integer",
                        format: "int64"
                    },
                    tag: {
                        type: "string"
                    }
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        const after = {
            type: "array",
            items: {
                type: "object",
                required: [
                    "id"
                ],
                properties: {
                    id: {
                        type: "integer",
                        format: "int64"
                    },
                    tag: {
                        type: "string"
                    }
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        expect(JSONSchemaManager.fix(before))
            .toStrictEqual(after);
    });

    test("useless minimum/maximum are removed from property details", () => {
        const before = {
            required: [
                "id"
            ],
            properties: {
                id: {
                    type: "integer",
                    format: "int64",
                    minimum: 0 - Math.pow(2, 63),
                    maximum: Math.pow(2, 63) - 1
                },
                tag: {
                    type: "string"
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        const after = {
            type: "object",
            required: [
                "id"
            ],
            properties: {
                id: {
                    type: "integer",
                    format: "int64"
                },
                tag: {
                    type: "string"
                }
            },
            $schema: "http://json-schema.org/draft-04/schema#"
        };
        expect(JSONSchemaManager.fix(before))
            .toStrictEqual(after);
    });

});