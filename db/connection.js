"use strict";
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    dbName: "benLeeds"
});
const db = mongoose.connection;
// conenction error
db.on("error", function(err) {

    console.log("Error occured while connecting to mongoAtlas : " + err);
});
// connection open
db.on("open", function() {

    console.log("Connection to mongoAtlas is now open on port : " + process.env.PORT);
});

module.exports = db;
