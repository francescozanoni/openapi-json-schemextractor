"use strict";

const appRoot = require("app-root-path");
const OpenAPISchemaManager = require(appRoot + "/lib/openapi-schema-manager");

describe("getModelSchemas", () => {

    test("empty object", () => {
        expect(OpenAPISchemaManager.getModelSchemas({}))
            .toStrictEqual({});
    });

    test("invalid input", () => {
        // https://stackoverflow.com/questions/46042613/how-to-test-type-of-thrown-exception-in-jest
        expect(() => {
            OpenAPISchemaManager.getModelSchemas(null);
        })
            .toThrow(/^Input is not an object$/);

        expect(() => {
            OpenAPISchemaManager.getModelSchemas([]);
        })
            .toThrow(/^Input is not an object$/);

        expect(() => {
            OpenAPISchemaManager.getModelSchemas("a");
        })
            .toThrow(/^Input is not an object$/);

        expect(() => {
            OpenAPISchemaManager.getModelSchemas(null);
        })
            .toThrow(/^Input is not an object$/);
    });

});