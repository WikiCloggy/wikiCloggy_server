const fs = require('fs');
const path = require('path');
const { User } = require('../../models/user');
const upload = require('../../middlewares/uploadAvatar');


// 회원 생성
// /api/user/
exports.create = (req, res) => {
// user code가 이미 서버 디비에 존재하는지 확인 : 없다면 생성, 있다면 패스
  User.find({user_code : req.body.user_code}, function (err, user) {
    if(err) return res.json({});
    else if(user == '') {
      User.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      }); // 존재하지 않는 회원 id는 새로 생성.
    }
    else {
      return res.json(user);
    }
  });
};

// 회원 프로필 관리

// 모든 회원 정보 가져오기, 확인을 위한 함수, 필요 없음
//api/user/show
exports.showAll = (req, res) => {
  User.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.json({});
  });
}

// 해당 user_code를 조회하여 회원 정보 가져오기
//api/user/details/id
exports.getProfile = (req, res) => {
  User.find({user_code : req.params.id}, (err, result) => {
    if (err) return res.json({});
    return res.json(result);
  });
};

// user_code를 조회하여 해당 회원 프로필 변경하기
//api/user/profile/id
exports.editProfile = (req, res) => {
  User.findOneAndUpdate(
    {user_code: req.params.id}, { $set:req.body }, (err, result) => {
      if(!err) {
        return res.json(result);
      }
      else return res.json({});
    });
};

// user_code를 조회하여 해당 회원 프로필 사진 path 변경해주기
//api/user/profile/files/id
exports.uploadAvatar = (req, res) => {
  upload(req, res)
    .then((files) => {
      User.where({user_code : req.params.id})
      .update({ $set : {avatar_path: `${req.files.avatarFile[0].destination.match(/[^/]+/g).pop()}/${req.files.avatarFile[0].filename}` } }).exec()
      .then(() => {
        res.json(files);
      })
      .catch((err) => {
        return res.json({});
      });
    })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
};
