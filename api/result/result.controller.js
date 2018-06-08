const fs = require('fs');
const path = require('path');
const Result = require('../../models/result');
const upload = require('../../middlewares/uploadKeyword');
const config = require('../../config/server.config');


exports.create = (req, res) => {
  Result.find({keyword : req.body.keyword}, function (err, keyword) {
    if(err) return res. json({result : "wrong query"});
    else if(keyword == '') {
      Result.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      }); // 존재하지 않는 keyword 생성.
    }
    else {
      return res.json(keyword);
    } // 존재 하는 keyword에 query 이미지 추가
  });
};

exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      Result.findOneAndUpdate({ _id : req.params.id } ,{ $push : {img_paths :{img_path: `${config.serverUrl()}files/${req.files.queryFile[0].destination.match(/[^/]+/g).pop()}/${req.files.queryFile[0].filename}`}}},
      (err, result) => {
        if(!err) {
          return res.json(result);
        }
        else return res.json({result : "fail"});
      });
      })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
};

exports.delete = (req, res) => {
  Result.findOneAndRemove({_id : req.params.id}, (err, result) => {
    if(!err) {
      return res.json({result : "ok"});
    }
    return res.json({result : "fail"});
  })
};


exports.getDetail = (req, res) => {
  Result.find({keyword : req.body.keyword}, (err, result) => {
    if(!err) {
      return res.json(result);
    }
    return res.json({result : "fail"});
  })
};


exports.showAll = (req, res) => {
  Result.find({}, (err, result) => {
    if(!err) {
      return res.json(result);
    }
    return res.json({result :"fail"});
  })
};


exports.editKeyword = (req, res) => {
  Result.findOneAndUpdate(
    { _id : req.params.id}, {$set:req.body}, (err, result) => {
      if(!err) {
        return res.json(result);
      }
      else return res.json({result : "fail"});
    }
  )
}
