const fs = require('fs');
const path = require('path');
const { Board } = require('../../models/board');
const config = require('../../config/server.config');
const upload = require('../../middlewares/uploadPost');
// 게시글 검색 정보 찾아오기
exports.getDetail = (req, res) => {
  // 수정 필요 찾으려고 하는 지표 설정
  // get post by id
  Board.getByvalue({_id: req.params.id}, (err, board)=> {
    if (err) return res.status(500).send(err); // 500 error
    return res.json(board);
  });
};

exports.getLog = (req, res) => {
  Board.find({author : req.body.user_code}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.json({result : "fail"});
  });
};

exports.getAll = (req, res) => {
  Board.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.json({result : "fail"});
  });
};

//post create edit delete

// 게시글 생성하기
exports.create = (req, res) => {

  Board.create(req.body, (err, result) => {
    if (!err) {
      return res.json(result);
    }
    return res.status(500).send(err); // 500 error
  });

}

// 게시글에 딸린 사진 저장하기
exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      User.where({user_code : req.params.id})
      .update({ $set : {img_path: `${config.serverUrl()}files/${req.files.postFile[0].destination.match(/[^/]+/g).pop()}/${req.files.postFile[0].filename}` }}).exec()
      .then(() => {
        return res.json({result : "ok"});
      })
      .catch((err) => {
        return res.json({result : "fail"});
      });
    })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
}

// 게시글 수정하기
exports.updatePost = (req, res) => {
  Board.findOneAndUpdate(
    {_id: req.params.id}, { $set:req.body }, (err, result) => {
      if(!err) {
        return res.json({result : "ok"});
      }
      else return res.json({ result : "fail"});
    });
}

// 게시글 지우기
exports.deletePost = (req, res) => {
  Board.findOneAndDelete({_id: req.params.id}, (err, result) => {
    if(!err && result) { fs.unlink(path.join(__dirname, `../../files/${result.img_path}`), (fsErr) => {
      if (fsErr) console.warn({ err: 'not removed on Server' });
    }); // db에 저장된 img_path와 함께 해당 파일 삭제
    return res.json(result);
  };
  return res.status(404).send({ message: 'No data found to delete' });
  });
}


//comment create edit delete

// 댓글 생성하기
exports.createComment = (req, res) => {
  Board.findOneAndUpdate({ _id : req.params.id } ,{ $push : {comments :{commenter:req.body.user_code , body : req.body.body,
  adopted : req.body.adopted, keywords: req.body.keywords}}},
  (err, result) => {
    if(!err) {
      return res.json({result : "ok"});
    }
    else return res.json({result : "fail"});
  });
}

// 댓글 수정하기
exports.updateComment = (req, res) => {

}

// 댓글 삭제하기
exports.deleteComment = (req, res) => {

}
