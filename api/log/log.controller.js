const fs = require('fs');
const path = require('path');
const { Log } = require('../../models/log');
const upload = require('../../middlewares/uploadLog');

// 로그 생성
// /api/log/
exports.create = (req, res) => {
  Log.create(req.body, (err, result) => {
    if(!err) {
      return res.json(result);
    }
  });
};

// 요청되었던 사진 정보 업로드
// /api/log/file/:id
exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      Log.where({_id : req.params.id})
      .update({ $set : {avatar_path: `${req.files.logFile[0].destination.match(/[^/]+/g).pop()}/${req.files.logFile[0].filename}` } }).exec()
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
  Log.findOneAndDelete({_id: req.params.id});
};

// 로그 받아오기
// /api/log/list/
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
