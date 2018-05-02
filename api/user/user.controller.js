const fs = require('fs');
const path = require('path');
const { User } = require('../../models/user');



// 회원 생성
exports.create = (req, res) => {
// user code가 이미 서버 디비에 존재하는지 확인 : 없다면 생성, 있다면 패스
  User.find({user_code :req.body.user_code}, function (err, user) {
    if(err) return res.status(500).send('User 조회 failed');
    console.log(user);
    if(user=='') {
      User.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      }); // 존재하지 않는 회원 id는 새로 생성.
    }
    else return res.status(500).json({ success : false , message : 'user already exist'});
  });
};

// 회원 프로필 관리
exports.getProfile = (req, res) => {
  User.find({user_code : req.params.id}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

exports.editProfile = (req, res) => {

};

exports.uploadImage = (req, res) => {

};
