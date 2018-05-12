const fs = require('fs');
const path = require('path');
const { Log } = require('../../models/log');
const { User } = require('../../models/user');
const upload = require('../../middlewares/uploadLog');

// 로그 생성
// /api/log/
exports.create = (req, res) => {
  User.find({user_code : req.body.user_code}, function (err, user) {
    if(err) return res.status(404).send('finding query failed');
    else if(user == '') {
        return res.status(404).send('user code not exist');
      }
    else {
      Log.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      });
    }
  });
};

// test for web
exports.showAll = (req, res) => {
  Log.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
}

// 요청되었던 사진 정보 업로드
// /api/log/file/:id
exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      Log.where({_id : req.params.id})
      .update({ $set : {img_path: `${req.files.logFile[0].destination.match(/[^/]+/g).pop()}/${req.files.logFile[0].filename}` } }).exec()
      .then(() => {
        res.json(files);
      })
      .catch((err) => {
        res.status(500).json({err : err, message : 'the data not exist'});
      });
    })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
};

// 로그 삭제
// /api/log/:id
exports.delete = (req, res) => {
  Log.findOneAndDelete({_id: req.params.id}, (err, result) => {
    if(!err && result) { fs.unlink(path.join(__dirname, `../../files/${result.img_path}`), (fsErr) => {
      if (fsErr) console.warn({ err: 'not removed on Server' });
    }); // db에 저장된 img_path와 함께 해당 파일 삭제
    return res.json(result);
  };
  return res.status(404).send({ message: 'No data found to delete' });
  });
};

// 로그 받아오기
// /api/log/list/:user
exports.get = (req, res) => {
  Log.find({user_code : req.params.user}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
};

// 로그 자세히 보기
// /api/log/details/:id
exports.getDetail = (req, res) => {
  Log.find({_id : req.params.id}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};
