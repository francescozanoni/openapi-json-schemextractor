"use strict";

const Converter = require("../lib/index");

const schemaPath = process.argv[2];

if ((typeof schemaPath) === "undefined") {
    console.error("Schema path not provided");
    process.exit(1);
}

(async function () {

    const jsonSchemas = await Converter.fromFile(schemaPath);

    console.log(JSON.stringify(jsonSchemas, null, 2));

})();
