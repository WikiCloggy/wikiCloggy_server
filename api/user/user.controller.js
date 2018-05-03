const fs = require('fs');
const path = require('path');
const { User } = require('../../models/user');
const upload = require('../../middlewares/uploadAvatar');


// 회원 생성
exports.create = (req, res) => {
// user code가 이미 서버 디비에 존재하는지 확인 : 없다면 생성, 있다면 패스
  User.find({user_code : req.body.user_code}, function (err, user) {
    if(err) return res.status(500).send('User query failed');
    else if(user == '') {
      console.log('here create user ', user, req.body); // erase it
      User.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      }); // 존재하지 않는 회원 id는 새로 생성.
    }
    else {
      console.log('user exist', user);// erase it
      // return 회원 정보??
      return res.status(200).json({ success : false , message : 'user already exist'});
    }
  });
};

// 회원 프로필 관리

// 모든 회원 정보 가져오기, 확인을 위한 함수, 필요 없음
exports.showAll = (req, res) => {
  User.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
}

// 해당 user_code를 조회하여 회원 정보 가져오기
exports.getProfile = (req, res) => {
  User.find({user_code : req.params.id}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

// user_code를 조회하여 해당 회원 프로필 변경하기
exports.editProfile = (req, res) => {
  User.findOneAndUpdate(
    {user_code: req.params.id}, { $set:req.body }, (err, result) => {
      if(!err) {
        return res.json(result);
      }
    });
};

// user_code를 조회하여 해당 회원 프로필 사진 path 변경해주기
exports.uploadAvatar = (req, res) => {
  upload(req, res)
    .then((files) => {
      User.find({user_code : req.params.id})
        .then(()=> {
          User.update({user_code:req.params.id},
            {$set:{avatar_path:`${req.files.avatarFile[0].destination.match(/[^/]+/g).pop()}/${req.files.avatarFile[0].filename}` }},
          (err, result) => {
            if(!err){
              return res.json(result);
            }
          }
        )})
    })
    .then(() => {
      if(req.user.avatar_path) {
        fs.unlink(path.join(__dirname,'../../files/avatar/$files.prevAvatarPic'), (fsErr)=> {
          if(fsErr) console.warn({ err : 'avatar did not removed correctly on Server'});
        });
      }
      res.json(files);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
