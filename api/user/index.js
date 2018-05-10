// /api/user/

const express = require('express');
const router = express.Router();
const userCtrl = require('./user.controller');
const User = require('../../models/user');
const fs = require ('fs');

// create user
router.post('/',userCtrl.create);

// make & edit profile by user code
router.get('/show',userCtrl.showAll);
router.get('/details/:id', userCtrl.getProfile);
router.post('/profile/:id', userCtrl.editProfile);
router.post('/profile/files/:id', userCtrl.uploadAvatar); // profile photo

// for test in web
router.get('/upload', function(req, res) {
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
