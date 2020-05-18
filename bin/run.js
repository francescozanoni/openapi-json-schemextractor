"use strict";

const Converter = require("../lib/index");

const inputSchemaPath = process.argv[2];

(async function () {

    const jsonSchemas = await Converter.fromFile(inputSchemaPath);

    console.log(jsonSchemas);

})();
