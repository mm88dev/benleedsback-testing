"use strict";

const mongoose = require("mongoose");

const tempWorkorderSchema = mongoose.Schema({
  buildingNumber: {
    type: Number,
    required: true
  },
  apartmentNumber: {
    type: Number,
    required: true
  },
  loginTime: {
    type: Date,
    required: true
  },
  autosaveTime: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  jobs: {
    type: Array,
    required: true
  },
  adress: {
    type: String,
    required: true
  },
  squareFeet: {
    type: String
  },
  questions: {
    type: Object
  },
  checkedQuestions: {
    type: Object
  }
});

const tempWorkorder = (module.exports = mongoose.model(
  "tempworkorder",
  tempWorkorderSchema
));

// user creates temporary workorder
module.exports.saveTempWorkorder = function (autosavedWorkorder, res, callback) {
 
  const newTempWorkorder = new tempWorkorder(autosavedWorkorder);
  newTempWorkorder
    .save()
    .then(tempWorkorder => {
      let data;
      if (tempWorkorder !== null) {
        data = {
          success: "ok"
        };
      } else {
        data = {
          error: "An error has occurred while trying to autosave a workorder"
        };
      }
      console.log('after save', tempWorkorder);
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log(
        "An error has occurred while trying to autosave a workorder " + err
      );
    });
};

// user updates existing temporary workorder
module.exports.updateTempWorkorder = function (
  autosavedWorkorder,
  res,
  callback
) {
  tempWorkorder
    .findByIdAndUpdate(
      autosavedWorkorder._id, {
        $set: {
          autosaveTime: autosavedWorkorder.autosaveTime,
          jobs: autosavedWorkorder.jobs,
          questions: autosavedWorkorder.questions,
          checkedQuestions: autosavedWorkorder.checkedQuestions
        }
      }, {
        new: true
      }
    )
    .then(tempWorkorder => {
      let data;
      if (tempWorkorder !== null) {
        data = {
          success: "ok"
        };
      } else {
        data = {
          error: "An error has occurred while trying to update an autosaved workorder"
        };
      }
      console.log('after update', tempWorkorder);
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log(
        "An error has occurred while trying tupdate an autosaved workorder " +
        err
      );
    });
};

// user gets his/hers autosaved workorder for that building
module.exports.getTempWorkorder = function (autosavedWorkorder, res, callback) {
  
  tempWorkorder
    .findOne({
      buildingNumber: autosavedWorkorder.buildingNumber,
      apartmentNumber: autosavedWorkorder.apartmentNumber,
      userId: autosavedWorkorder.userId
    })
    .then(tempWorkorder => {
      let data;
      if (tempWorkorder !== null) {
        data = tempWorkorder;
      } else {
        data = {
          error: "An error occured while recovering a temporary workorder"
        };
      }
      console.log('get sent', data);
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log(
        "An error occured while recovering a temporary workorder " + err
      );
    });
};

// a temporary workorder is deleted once the real one is created
module.exports.deleteTempWorkorder = function (workorderData, callback) {
  tempWorkorder
    .findByIdAndRemove(workorderData.tempWorkorderId)
    .then(tempWorkorder => {
      let data;
      if (tempWorkorder !== null) {
        data = workorderData;
      } else {
        data = {
          error: "An error occurred while removing a temporary workorder"
        };
      }
      callback(data);
    })
    .catch(err => {
      console.log(
        "An error occurred while removing a temporary workorder " + err
      );
    });
};

// user get all of his/hers temporary workorders during login
module.exports.getUserTempWorkordersLogin = function (userData, res, callback) {
  tempWorkorder
    .find({
      userId: mongoose.Types.ObjectId(userData.user._id)
    })
    .then(tempWorkorders => {
      let data;
      if (tempWorkorders !== null) {
        data = {
          user: userData.user,
          workorders: userData.workorders,
          tempWorkorders: tempWorkorders
        };
      } else {
        data = {
          user: userData.user,
          workorders: userData.workorder,
          tempWorkorders: []
        };
      }
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log(
        "An error has occurred while recovering user's temporary workorders " +
        err
      );
    });
};

// user get all of his/hers temporary workorders
module.exports.getUserTempWorkorders = function (userId, res, callback) {
  tempWorkorder
    .find({
      userId: mongoose.Types.ObjectId(userId)
    })
    .then(tempWorkorders => {
      let data;
      if (tempWorkorders !== null) {
        data = tempWorkorders;
      } else {
        data = {
          error: "An error has occured while recovering user's temporary workorders"
        };
      }
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log(
        "An error has occured while recovering user's temporary workorders " +
        err
      );
    });
};