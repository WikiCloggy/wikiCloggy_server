const fs = require('fs');
const path = require('path');
const { User } = require('../../models/user');



// 회원 생성
exports.create = (req, res) => {
  User.create(req.body, (err, result) => {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
};

// 회원 프로필 관리
exports.getProfile = (req, res) => {
  User.findOne({user_code : req.params.id}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

exports.editProfile = (req, res) => {

};

exports.uploadImage = (req, res) => {

};
