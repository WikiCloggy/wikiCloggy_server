// /api/user/

const express = require('express');
const router = express.Router();
const userCtrl = require('./user.controller');
const User = require('../../models/user');
const fs = require ('fs');

// create user
router.post('/',userCtrl.create);

// get user info
router.get('/details/:id',userCtrl.getUser);

// make & edit profile by user code
router.post('/profile/:id', userCtrl.editProfile);
router.post('/profile/files/:id', userCtrl.uploadAvatar); // profile photo



// This command is for admin*************************************

// delete user
router.delete('admin/delete/:id', userCtrl.delete);

// Get All User
router.get('/admin/show',userCtrl.showAll);

// upload profile image in web
router.get('/admin/upload', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('testProfile.html', null, function(error, data) {
    if(error) {
      res.writeHead(404);
      res.write('File not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
});

module.exports = router;
