"use strict";

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
// create user Schema
const UserSchema = mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        bcrypt: true,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "active"
    },
    imgPath: {
        type: String,
        required: true,
        default: "noImg.jpg"
    }
});
// export User constructor
const User = (module.exports = mongoose.model("user", UserSchema));

// user login
module.exports.userLogin = function(email, password, callback) {
  // find out if that email exists
  User.findOne({
    email: email
  })
    .then(user => {
      let data;
      if (user === null) {
        // email address not found in database
        data = {
          error: "no email"
        };
        callback(data);
      } else {
        // email address found  compare password to the hashed user.password database
        bcryptjs.compare(password, user.password, function(err, result) {
          if (err) throw err;
          if (result === true) {
            data = user;
          } else {
            data = {
              error: "bad password"
            };
          }
          callback(data);
        });
      }
    })
    .catch(err => {
      console.log("Error occured while searching for user : " + err);
    });
};

// admin gets all users
module.exports.getAllUsers = function(res, callback) {
  User.find({})
    .then(users => {
      let data;
      if (users !== null) {
        data = users;
      } else {
        data = {
          error: "Could not get users"
        };
      }
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log("Error while getting users : " + err);
    });
};
// admin gets a single user
module.exports.getSingleUser = function(_id, callback) {
  User.findById(_id)
    .then(user => {
      let data;
      if (user !== null) {
        data = user;
      } else {
        data = {
          error: "No user with that id exists"
        };
      }
      callback(data);
    })
    .catch(err => {
      console.log("Error while getting specific user : " + err);
    });
};

// admin creates a new user
module.exports.createUser = function(user, res, callback) {
  // check if email already exists
  User.findOne({
    email: user.email
  })
    .then(userData => {
      if (userData !== null) {
        let data = {
          error: "That email already exists"
        };
        data = JSON.stringify(data);
        callback(res, data);
      } else {
        // generate salt async
        bcryptjs.genSalt(10, function(err, salt) {
          if (err) throw err;
          else {
            // hash user password async
            bcryptjs.hash(user.password, salt, function(err, hash) {
              if (err) throw err;
              else {
                // everything ok, replace passowrd with hash
                user.password = hash;
                const NewUser = User(user);
                NewUser.save()
                  .then(user => {
                    let data;
                    if (user !== null) {
                      data = {
                        success: "Ok"
                      };
                    } else {
                      data = {
                        error: "Unsuccessfull attempt to insert a new user"
                      };
                    }
                    data = JSON.stringify(data);
                    callback(res, data);
                  })
                  .catch(err => {
                    console.log(
                      "An error occured while trying to register a new user, during insertion into database " +
                        err
                    );
                  });
              }
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(
        "An error occured while trying to register a new user during check if email exists " + err
      );
    });
};

// admin deletes an existing user
module.exports.deleteUser = function(_id, res, callback) {
  User.findOneAndRemove({
    _id: mongoose.Types.ObjectId(_id)
  })
    .then(result => {
      let data;
      if (result !== null) {
        data = {
          success: "Ok"
        };
      } else {
        data = {
          error: "An error occured while trying to delete an user"
        };
      }
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log("An error occured while deleting specific user : " + err);
    });
};

// admin edits existing user
module.exports.editUser = function(updatedUser, res, callback) {

  let editedUser;
  if (updatedUser.imgPath !== null) {
    editedUser = updatedUser;
  } else {
    editedUser = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      emailPassword: updatedUser.emailPassword,
      region: updatedUser.region,
      status: updatedUser.status,
    };
  }
  User.findByIdAndUpdate(
    editedUser._id,
    {
      $set: editedUser
    },
    {
      new: true
    }
  )
  .then(user => {
      
    let data;
    if (user !== null) {
      data = {
        success: "Ok"
      };
    } else {
      data = {
        error: "An error occured while updating a user"
      };
    }
    console.log(user);
    data = JSON.stringify(data);
    callback(res, data);
  })
  .catch(err => {
    console.log("An error occured while updating a user " + err);
  });
};

// add relevant user to each workorder send to front
module.exports.addUserToWorkorder = function(workorders, res, callback) {
  User.find({})
    .then(users => {
      let data;
      if (users !== null && users.length !== 0) {
        let updatedWorkorders = [];
        for (let i = 0; i < workorders.length; i++) {
          let workorderUser;
          let workorderUserId = workorders[i].userId.toString();
          for (let j = 0; j < users.length; j++) {
            let id = users[j]._id.toString();
            if (workorderUserId == id) {
              workorderUser = users[j];
            }
          }
          updatedWorkorders.push({
            _id: workorders[i]._id,
            buildingNumber: workorders[i].buildingNumber,
            apartmentNumber: workorders[i].apartmentNumber,
            status: workorders[i].status,
            loginTime: workorders[i].loginTime,
            completedTime: workorders[i].completedTime,
            sendTime: workorders[i].sendTime,
            comment: workorders[i].comment,
            adress: workorders[i].adress,
            totalPrice: workorders[i].totalPrice,
            user: workorderUser
          });
        }
        data = updatedWorkorders;
      } else {
        data = {
          workorders: workorders,
          error: "An error occured trying to get users data"
        };
      }
      data = JSON.stringify(data);
      callback(res, data);
    })
    .catch(err => {
      console.log("An error occured while adding user ");
    });
};

// send user photo to the frontend
module.exports.getPhoto = function(userId, res, callback, fileCallback) {

  User.findById(userId)
  .then(user => {
    
    let data;
    if (user !== null) {
      const imgPath = user.imgPath;
      fileCallback(res, imgPath);
    } else {
      data = {
        error: "An error occured while attempting to get a user's photo"
      };
      data = JSON.stringify(data);
      callback(res, data);
    }
  })
  .catch(err => {

    console.log("An error occured while attempting to get a user's photo " + err);
  });
};