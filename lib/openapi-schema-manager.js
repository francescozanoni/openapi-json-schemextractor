"use strict";

const _ = require("underscore");
const appRoot = require("app-root-path");
const helpers = require(appRoot + "/lib/helpers");

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

        _.keys(openapiSchema.paths).map(path => {
            _.keys(openapiSchema.paths[path]).map(method => {
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
        });

        return modelSchemas;

    }

};