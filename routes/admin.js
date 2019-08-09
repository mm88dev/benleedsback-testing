'use strict';
require('dotenv').config();
// transfer data or success/fail message to frontend after query into database
function callback(res, data) {

  res.send(data);
}

// get all workorders/vendor/jobs/users/items data at once
exports.allWorkorders = function(req, res) {
  
  const Workorder = require('../db/models/workorder');
  // callback
  Workorder.getAllWorkorders(allUsers);

  function allUsers(data) {
  
    if (data.error === undefined) {
      const User = require('../db/models/user');
      // second callback
      User.addUserToWorkorder(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
exports.allVendors = function(req, res) {
  
  const Vendor = require('../db/models/vendor');
  Vendor.getAllVendors(res, callback);
};
exports.allJobs = function(req, res) {
  
  const Job = require('../db/models/job');
  Job.getAllJobs(res, callback);
};
exports.allUsers = function(req, res) {
  
  const User = require('../db/models/user');
  User.getAllUsers(res, callback);
};
exports.allRooms = function(req, res) {
  
  const Room = require('../db/models/room');
  Room.getAllRooms(res, callback);
};
exports.allExtraItems = function(req, res) {
  const Item = require('../db/models/item');
  Item.getAllExtraItems(res, callback);
};

// get one instance of a workorder/vendor/job/user/room/item
exports.singleWorkorder = function(req, res) {
  
  const _id = req.params.id;
  const Workorder = require('../db/models/workorder');
  // callback
  Workorder.getSingleWorkorder(_id, getJobs);

  function getJobs(data) {
  
    if (data.error === undefined) {
      const Job = require('../db/models/job');
      // second callback
      Job.getWorkorderJobs(data, res, callback, false);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
exports.singleVendor = function(req, res) {
  
  const _id = req.params.id;
  const Vendor = require('../db/models/vendor');
  Vendor.getSingleVendor(_id, res, callback);
};
exports.singleJob = function(req, res) {
  
  const _id = req.params.id;
  const Job = require('../db/models/job');
  Job.getSingleJob(_id, res, callback);
};
exports.singleUser = function(req, res) {
  
  const _id = req.params.id;
  const User = require('../db/models/user');
  // callback
  User.getSingleUser(_id, getUserWorkorders);

  function getUserWorkorders(data) {
  
    if (data.error === undefined) {
      const Workorder = require('../db/models/workorder');
      // second callback
      Workorder.getUserWorkorders(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
exports.singleRoom = function(req, res) {
  
  const name = req.params.name;
  const Room = require('../db/models/room');
  // callback
  Room.getSingleRoom(name, getRoomItems);

  function getRoomItems(data) {
  
    if (data.error === undefined) {
      const Item = require('../db/models/item');
      // second callback
      Item.getRoomItems(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
exports.singleItem = function(req, res) {
  
  const _id = req.params.id;
  const Item = require('../db/models/item');
  Item.getSingleItem(_id, res, callback);
};

// create new vendor/user/item
exports.createVendor = function(req, res) {
  
  const createdVendor = {
    name: req.body.name,
    email: req.body.email,
    profession: req.body.profession,
    phone: req.body.phone
  };
  let Vendor = require('../db/models/vendor');
  Vendor.createVendor(createdVendor, res, callback);
};
exports.createUser = function(req, res) {
  
  const createdUser = {
    email: req.body.email,
    password: req.body.password,
    emailPassword: req.body.emailPassword,
    name: req.body.name,
    region: req.body.region
  };
  if (req.file !== undefined) {
    const url = req.protocol + '://' + req.get('host');

    createdUser.imgPath = url + '/data/api/img/' + req.file.filename;
  } else {
    const url = req.protocol + '://' + req.get('host');
    const imgPath = 'noImg.jpg';
    createdUser.imgPath = url + '/data/api/img/' + imgPath;
  }
  const User = require('../db/models/user');
  User.createUser(createdUser, res, callback);
};
exports.createItem = function(req, res) {
  
  const createdItem = {
    name: req.body.name,
    subCategory: req.body.subCategory,
    room: req.body.room,
    price: req.body.price,
    link: req.body.link,
    status: req.body.status
  };
  const Item = require('../db/models/item');
  Item.createItem(createdItem, res, callback);
};

// edit existing workorder/vendor/job/user/item
exports.editWorkorder = function(req, res) {
  
  const editedWorkorder = {
    _id: req.params.id,
    buildingNumber: req.body.buildingNumber,
    apartmentNumber: req.body.apartmentNumber,
    loginTime: req.body.loginTime,
    sendTime: req.body.sendTime,
    completedTime: req.body.completedTime,
    userId: req.body.userId,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    adress: req.body.adress
  };
  const Workorder = require('../db/models/workorder');
  Workorder.editWorkorder(editedWorkorder, res, callback);
};
exports.editVendor = function(req, res) {
  
  const editedVendor = {
    _id: req.params.id,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    profession: req.body.profession,
    status: req.body.status
  };
  const Vendor = require('../db/models/vendor');
  Vendor.editVendor(editedVendor, res, callback);
};
exports.editUser = function(req, res) {
  
  const editedUser = {
    _id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    emailPassword: req.body.emailPassword,
    region: req.body.region,
    status: req.body.status
  };
  let imgPath;
  if (req.file !== undefined) {
    imgPath = process.env.IMG_PATH + Date.now() + '-' + req.file.originalname;
  } else {
    imgPath = null;
  }
  editedUser.imgPath = imgPath;
  const User = require('../db/models/user');
  User.editUser(editedUser, res, callback);
};
exports.editItem = function(req, res) {
  
  let editedItem;
  for (let prop in req.body) {
    editedItem = JSON.parse(prop);
  }
  const Item = require('../db/models/item');
  Item.editItem(editedItem, res, callback);
};

// assign job to vendor, optionally change that workorder status
exports.assignJob = function(req, res) {

  let jobData;
  for (let prop in req.body) {
    jobData = JSON.parse(prop);
  }
  const Job = require('../db/models/job');
  // callback
  Job.assignJob(jobData, assignVendor);

  function assignVendor(data) {
    
    if (data.error === undefined) {
      const Vendor = require('../db/models/vendor');
      // second callback
      Vendor.assignVendor(data, mailVendor);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function mailVendor(data) {
    
    if (data.error === undefined) {
      const MailTask = require('../tasks/mail');
      // third callback
      MailTask.adminSendMail(data, editWorkorder);
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }

  function editWorkorder(data) {
    
    if (data.error === undefined) {
      if (data.workorder.status !== 'sent') {
        // workorder holds current status
        let data = {
          success: 'Ok'
        };
        data = JSON.stringify(data);
        callback(res, data);
      } else {
        // workorder status has changed
        let Workorder = require('../db/models/workorder');
        // thrid callback
        Workorder.editWorkorder(data, res, callback);
      }
    } else {
      data = JSON.stringify(data);
      callback(res, data);
    }
  }
};
// set job status to finished
exports.finishJob = function(req, res) {
  
  const jobData = {
    _id: req.params.id,
    status: req.body.status,
    endDate: req.body.endDate
  };
  const Job = require('../db/models/job');
  Job.finishJob(jobData, res, callback);
};

// delete existing vendor/user/item
exports.deleteVendor = function(req, res) {
  
  const _id = req.params.id;
  const Vendor = require('../db/models/vendor');
  Vendor.deleteVendor(_id, res, callback);
};
exports.deleteUser = function(req, res) {
  
  const _id = req.params.id;
  const User = require('../db/models/user');
  User.deleteUser(_id, res, callback);
};
exports.deleteItem = function(req, res) {
  
  const deletedItem = {
    _id: req.body._id,
    name: req.body.name,
    subCategory: req.body.subCategory,
    room: req.body.room,
    price: req.body.price,
    link: req.body.link,
    status: req.body.status
  };
  const Item = require('../db/models/item');
  Item.deleteItem(deletedItem, res, callback);
};
