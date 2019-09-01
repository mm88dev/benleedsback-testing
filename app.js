'use strict';
// enviorenment variables
require('dotenv').config();
// dependencies
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const logger = require('morgan');
// db connection
require('./db/connection');
// express
const app = express();

// MIDDLEWARES

// multer
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({

  destination: function(req, file, cb) {

    // check if extension be correct
    req.isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'data/api/img');
  },
  filename: function(req, file, cb) {
  
    const name = file.originalname
                .toLowerCase()
                .split(' ')
                .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + '-' + name);
  }
});
const upload = multer({
  storage: storage
});
// logger
app.use(logger('dev'));
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/data/api/img', express.static(path.join('data/api/img')));
// validate front-end data before reaching the endpoint
// app.use((req, res, next) => {

//   const errors = require("./middlewares/validation").validateFrontData(req);
//   console.log(errors);
//   if (errors) {

//   } else {
//     next();
//   }
// });
// allow requests from cross-origin servers
app.use(cors());

// ROUTES

// send all buildings when app initializes
app.get('/', require('./routes/index').getOperationalData);
// login
app.post('/login', require('./routes/index').login);
// send user photo
// app.get('/avatar/:userId', require('./routes/index').userPhoto);

// user gets one instance of data
app.get('/user/rooms/:name', require('./routes/user').singleRoom);
app.get('/user/buildings/:number', require('./routes/user').singleBuilding);
app.get('/user/getAllTempWorkorders/:userId', require('./routes/user').getAllTempWorkorders);
app.get('/user/allUserWorkorders/:userId', require('./routes/user').getAllUserWorkorders);
// user gets entire set of data
app.get('/user/allItems', require('./routes/user').getAllItems);
app.get('/user/allWorkorders', require('./routes/user').getAllWorkorders);
// user autosaves workorder
app.post('/user/newTempWorkorder', require('./routes/user').newTempWorkorder);
// user gets his/hers latest autosaved workorder
app.post('/user/getTempWorkorder', require('./routes/user').getTempWorkorder);
// user creates a new instance of a workorder with multiple jobs created and temporary workorder deleted
app.post('/user/newWorkorder', require('./routes/user').createWorkorder);

// admin gets entire set of data
app.get('/admin', require('./routes/admin').allWorkorders);
app.get('/admin/vendors', require('./routes/admin').allVendors);
app.get('/admin/jobs', require('./routes/admin').allJobs);
app.get('/admin/users', require('./routes/admin').allUsers);
app.get('/admin/extraItems', require('./routes/admin').allExtraItems);
app.get('/admin/newItem', require('./routes/admin').allRooms);
// admin gets one instance of data
app.get('/admin/workorders/:id', require('./routes/admin').singleWorkorder);
app.get('/admin/vendors/:id', require('./routes/admin').singleVendor);
app.get('/admin/jobs/:id', require('./routes/admin').singleJob);
app.get('/admin/users/:id', require('./routes/admin').singleUser);
app.get('/admin/rooms/:name', require('./routes/admin').singleRoom);
// admin creates a new instance of vendor/user/item
app.post('/admin/newVendor', require('./routes/admin').createVendor);
app.post('/admin/newUser', upload.single('image'), require('./routes/admin').createUser);
app.post('/admin/newItem', require('./routes/admin').createItem);
// admin edits one instance of data
app.post('/admin/editWorkorder/:id', require('./routes/admin').editWorkorder);
app.post('/admin/editVendor/:id', require('./routes/admin').editVendor);
app.post('/admin/editUser', upload.single('image'), require('./routes/admin').editUser);
app.post('/admin/editItem', require('./routes/admin').editItem);
// admin assigns job / declares it finished , editing job, vendor and optionally also workorder
app.post('/admin/assignJob/:id', require('./routes/admin').assignJob);
app.post('/admin/finishJob/:id', require('./routes/admin').finishJob);
// admin deletes one instance of data
app.post('/admin/vendors/:id', require('./routes/admin').deleteVendor);
app.post('/admin/users/:id', require('./routes/admin').deleteUser);
app.post('/admin/deleteItem', require('./routes/admin').deleteItem);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('Something went wrong : ', err);
  next();
});

// export app
module.exports = app;
