"use strict";

module.exports = {

    getModelSchemas: function(openapiSchema) {
    
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
            for (let method in openapiSchema.paths[path]) {
                if (openapiSchema.paths[path][method].parameters) {
                    for (let i = 0; i < openapiSchema.paths[path][method].parameters.length; i++) {
                        if (openapiSchema.paths[path][method].parameters[i].schema) {
                            let t = {};
                            t[path + "_" + method + "_" + openapiSchema.paths[path][method].parameters[i].name] = openapiSchema.paths[path][method].parameters[i].schema;
                            Object.assign(modelSchemas, t);
                        }
                    }
                }
            }
        }
        
        return modelSchemas;
    
    }

};