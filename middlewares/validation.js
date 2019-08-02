"use strict";

module.exports.validateFrontData = function(req) {

    const method = req.method;
    if (method === "POST") {
        console.log("post");
        console.log(req._parsedUrl);
    } else {
        console.log("get");
        console.log(req._parsedUrl);
    }
};