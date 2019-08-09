// user.js
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