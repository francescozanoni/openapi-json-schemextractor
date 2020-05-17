"use strict";

const convert = require("./convert");

const inputSchemaPath = process.argv[2];

(async function () {

    const jsonSchemas = await convert(inputSchemaPath);

    console.log(jsonSchemas);

})();
