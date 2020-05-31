"use strict";

const helpers = require("./helpers");
const keysToRemove = ["example"];

module.exports = {

    /**
     * Extract all model schemas from an OpenAPI schema
     *
     * @param {Object} openapiSchema
     *
     * @returns {Object}
     */
    getModelSchemas: function (openapiSchema) {

        if (helpers.isObject(openapiSchema) === false) {
            throw Error("Input is not an object");
        }

        var modelSchemas = {};

        // OpenAPI 3
        if (openapiSchema.components &&
            openapiSchema.components.schemas) {
            Object.assign(modelSchemas, openapiSchema.components.schemas);
        }

        // OpenAPI 2 (a.k.a. Swagger)
        if (openapiSchema.definitions) {
            Object.assign(modelSchemas, openapiSchema.definitions);
        }

        for (let path in openapiSchema.paths) {

            Object.keys(openapiSchema.paths[path]).forEach((method) => {

                if (openapiSchema.paths[path][method].parameters) {

                    for (let i = 0; i < openapiSchema.paths[path][method].parameters.length; i++) {

                        if (openapiSchema.paths[path][method].parameters[i].schema) {

                            const temp = {};
                            // In order to keep parameter schema names unique,
                            // names are extracted from parameter object ancestor names.
                            const key = path + "_" + method + "_" + openapiSchema.paths[path][method].parameters[i].name;
                            temp[key] = openapiSchema.paths[path][method].parameters[i].schema;
                            Object.assign(modelSchemas, temp);

                        }

                    }

                }

            });

        }

        Object.keys(modelSchemas).forEach((modelSchema) => {

            modelSchemas[modelSchema] = this.fixModelSchema(modelSchemas[modelSchema]);

        });

        return modelSchemas;

    },

    /**
     * Make OpenAPI model schema more compliant with JSON schema.
     *
     * @param {Object} openapiModelSchema
     *
     * @returns {Object}
     */
    fixModelSchema: function (openapiModelSchema) {

        if (helpers.isObject(openapiModelSchema) === false) {
            throw Error("Input is not an object");
        }

        let fixedSchema = Object.assign({}, openapiModelSchema);

        // Remove OpenAPI-only keys.
        keysToRemove.forEach(key => {
            fixedSchema = helpers.removeKeyFromObject(fixedSchema, key);
        });

        return fixedSchema;

    }

};