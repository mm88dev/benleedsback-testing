"use strict";
const fs = require("fs");

module.exports.logRequestData = function(data) {

    console.log("ok");
    const date = new Date().toDateString();
    // keys on 0 & even numbers, values on uneven 
    let data = [];
    for (let prop in autosavedWorkorder) {
        data.push(prop);
        data.push(autosavedWorkorder[prop]);
    }
    let inside = "";
    for (let i = 0; i < data.length; i+= 2) {
        if (typeof data[i + 1] === Object) {
            // no LENGTH property in request object 
            if (data[i + 1][0] !== undefined && data[i + 1].length !== undefined) {
                // array
            } else {
                // object
            }
        } else {
            if (i === 0) {
                inside += data[i] + " : " + data[i + 1] + " ||| date : " + date;
            } else {
                inside += data[i] + " : " + data[i + 1];
            }
            inside += "\n"; 
        }
    }
    console.log(inside);
    return inside;
    // fs.appendFileSync("log/autosaveReqRes.txt", inside);
};