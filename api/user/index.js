const express = require('express');

const router = express.Router();
const userCtrl = require('./user.controller');
const User = require('../../models/user');
// create user
router.post('/',userCtrl.create);

// make & edit profile by user code
router.get('/details/:id', userCtrl.getProfile);
router.post('/profile/:id', userCtrl.editProfile);
router.post('/profile/files/:id',userCtrl.uploadImage); // profile photo

module.exports = router;
