"use strict";
function callback(res, data) {
  res.send(data);
}

// get all of the workorders
exports.getAllWorkorders = function(req, res) {
  const Workorder = require("../db/models/workorder");
  Workorder.getAllWorkordersUser(res, callback);
};
// get all of the items
exports.getAllItems = function(req, res) {
  const Item = require("../db/models/item");
  Item.getAllItems(res, callback);
};

// get single room/building
exports.singleRoom = function(req, res) {
  const name = req.params.name;
  const Room = require("../db/models/room");
  // callback
  Room.getSingleRoom(name, getItems);

  function getItems(data) {
    if (data.error === undefined) {
      const Item = require("../db/models/item");
      // second callback
      Item.getRoomItems(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
exports.singleBuilding = function(req, res) {
  const number = req.params.number;
  const Building = require("../db/models/building");
  Building.getSingleBuilding(number, res, callback);
};

// user create new workorder
exports.createWorkorder = function(req, res) {
  let createdWorkorder;
  for (let prop in req.body) {
    createdWorkorder = JSON.parse(prop);
  }
  const Workorder = require("../db/models/workorder");
  // callback
  Workorder.createWorkorder(createdWorkorder, createJobs);

  function createJobs(data) {
    if (data.error === undefined) {
      const Job = require("../db/models/job");
      // second callback
      Job.createJobs(data, removeTempWorkorder);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function removeTempWorkorder(data) {
    if (data.error === undefined) {
      const TempWorkorder = require("../db/models/tempWorkorder");
      // third callback
      TempWorkorder.deleteTempWorkorder(data, mailAdmin);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function mailAdmin(data) {
    if (data.error === undefined) {
      const MailTask = require("../tasks/mail");
      // fourth callback
      MailTask.userSendMail(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};

// user autosaves the workorder
module.exports.newTempWorkorder = function(req, res) {
  let autosavedWorkorder;
  for (let prop in req.body) {
    autosavedWorkorder = JSON.parse(prop);
  }
  const TempWorkorder = require("../db/models/tempWorkorder");
  console.log('before save/update', autosavedWorkorder);
  if (autosavedWorkorder._id === undefined) {
    // second callback
    TempWorkorder.saveTempWorkorder(autosavedWorkorder, res, callback);
  } else {
    // second callback
    TempWorkorder.updateTempWorkorder(autosavedWorkorder, res, callback);
  }
};

// user gets his/hers latest temporary workorder
module.exports.getTempWorkorder = function(req, res) {
  let tempWorkorderData;
  for (let prop in req.body) {
    tempWorkorderData = JSON.parse(prop);
  }
  const TempWorkorder = require("../db/models/tempWorkorder");
  // callback
  TempWorkorder.getTempWorkorder(tempWorkorderData, res, callback);
};

// user gets all of his/hers temporary workorders
module.exports.getAllTempWorkorders = function(req, res) {
  
  const userId = req.params.userId;
  const TempWorkorder = require("../db/models/tempWorkorder");
  TempWorkorder.getUserTempWorkorders(userId, res, callback);
};

// user gets all of his/hers workorders
module.exports.getAllUserWorkorders = function(req, res) {

  const userId = req.params.userId;
  const Workorder = require("../db/models/workorder");
  Workorder.getAllRegionalWorkorders(userId, res, callback);
};
