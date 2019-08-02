"use strict";
require("dotenv").config();
const fs = require("fs");

// send textual reponse
function callback(res, data) {
  res.send(data);
}
// send file in response
function fileCallback(res, dataPath) {
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    png: "image/png"
  };
  const fileExt = dataPath.split(".")[1];
  const contentType = mimeTypes[fileExt];
  const file = __dirname.replace("/routes", "") + dataPath;
  const readStream = fs.createReadStream(file);
  readStream.on("open", () => {
    console.log("ok");
    res.set("Content-Type", contentType);
    readStream.pipe(res);
  });
  readStream.on("error", () => {
    console.log("error");

    let data = {
      error: "An error has occurred"
    };
    data = JSON.stringify(data);
    res.send(data);
  });
}

// send all the buildings
exports.getOperationalData = function(req, res) {
  const Building = require("../db/models/building");
  Building.getAllBuildings(res, callback);
};
// login admin/user function
exports.login = function(req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  if (email === process.env.ADMIN_EMAIL) {
    // admin login attempt
    if (password === process.env.ADMIN_PASSWORD) {
      // admin login attempt success
      res.send("admin");
    } else {
      // admin login attempt failed password
      res.send({
        error: "bad password"
      });
    }
  } else {
    // user login attempt
    const User = require("../db/models/user");
    // callback
    User.userLogin(email, password, getUserWorkorders);
  }

  function getUserWorkorders(data) {
    if (data.error === undefined) {
      const Workoder = require("../db/models/workorder");
      // second callback
      Workoder.getUserWorkordersLogin(data, getWorkorderJobs);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function getWorkorderJobs(data) {
    if (data.error === undefined) {
      const Jobs = require("../db/models/job");
      // third callback
      Jobs.getWorkorderJobs(data, res, getUserTempWorkorders, true);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function getUserTempWorkorders(data) {
    if (data.error === undefined) {
      // fourth callback
      const tempWorkorder = require("../db/models/tempWorkorder");
      tempWorkorder.getUserTempWorkordersLogin(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};

// get user photo
exports.userPhoto = function(req, res) {
  const userId = req.params.userId;
  const User = require("../db/models/user");
  User.getPhoto(userId, res, callback, fileCallback);
};
