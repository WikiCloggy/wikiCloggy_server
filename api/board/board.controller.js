const fs = require('fs');
const path = require('path');
const Board  = require('../../models/board');
const User = require('../../models/user');
const config = require('../../config/server.config');
const upload = require('../../middlewares/uploadPost');

const npage = 5 ; // 페이지당 5개 게시글 불러오기

// 게시글 상세보기
exports.getPost = (req, res) => {
  Board.find({_id: req.params.id}, (err, board) => {
    if (err) return res.status(500).send(err); // 500 error
      return res.json(board);
  });
};

// populate : https://m.blog.naver.com/PostView.nhn?blogId=azure0777&logNo=220606306753&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F
exports.getLog = (req, res) => {
  var page = req.params.page;
  Board.find({author : req.params.user_code}, function (err, result) {
    if(err)  return res.json({result : "fail"});
    return res.json(result);
  }).sort({_id: -1 }).skip((page)*npage).limit(npage);
};

// 한 페이지당 5개의 log 정보를 불러와서 return. sort 는 id 순으로.
exports.getMore = (req, res) => {
  var page = req.params.page;
  Board.find({}, function (err, result) {
    if(err)  return res.json({result : "fail"});
    return res.json(result);
  }).sort({_id: -1 }).skip((page)*npage).limit(npage);
};

//post create edit delete
// 게시글 생성하기
exports.create = (req, res) => {
  User.find({user_code : req.body.author}, (err, user) =>{
    if(err) return res.status(500).send(err); // 500 error
    Board.create({title:req.body.title, content : req.body.content, author : req.body.author,createdAt : req.body.createdAt, author_name : user[0].name}, (err, result) => {
      if (err) return res.status(500).send(err); // 500 error
      return res.json({ "_id" : result._id});
  });

  });

};

// 게시글에 딸린 사진 저장하기
exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      Board.where({_id : req.params.id})
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
};

// 게시글 수정하기
exports.updatePost = (req, res) => {
  Board.findOneAndUpdate(
    {_id: req.params.id}, { $set:req.body }, (err, result) => {
      if(!err) {
        return res.json({result : "ok"});
      }
      else return res.json({ result : "fail"});
    });
};

// 게시글 지우기
exports.deletePost = (req, res) => {
  Board.findOneAndRemove({_id: req.params.id}, (err, result) => {
    if(!err && result) { fs.unlink(path.join(__dirname, `../../files/${result.img_path}`), (fsErr) => {
      if (fsErr) console.warn({ err: 'not removed on Server' });
    }); // db에 저장된 img_path와 함께 해당 파일 삭제
    return res.json(result);
  };
  return res.status(404).send({ message: 'No data found to delete' });
  });
};


exports.searchPost = (req, res) => {
  var type = req.params.type;
  switch(type)
  {
    case "0" : // 전체
      Board.find({$or : [{"title" : req.body.query}, {"author_name" :req.body.query}]}, (err,result) => {
        if(err) return res.json({ result : "fail"});
        else return res.json(result);
      });
      break;

    case "1" : // author name
      Board.find({author_name : req.body.query}, (err, result) => {
        if(err) return res.json({ result : "fail"});
        else return res.json(result);
      });
      break;

    case "2" : // title
    Board.find({title : req.body.query}, (err, result) => {
      if(err) return res.json({ result : "fail"});
      else return res.json(result);
    });
      break;

    default : // error
      return res.json({ result : "fail"});
      break;
  }
};



// for admin
exports.getAll = (req, res) => {
  Board.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.json({result : "fail"});
  });
};

exports.getKeywords = (req, res) => {
  Board.find({$and : [{comments : {$size : {$gt : 5}}}, {adminChecked : false}]}, function (err, result) {
      if(err) return res.json({result : "fail"});
      else return res.json(result);
  });
};

//comment create edit delete
// 댓글 생성하기
exports.createComment = (req, res) => {
  Board.findOneAndUpdate({ _id : req.params.id } ,{ $push : {comments :{commenter:req.body.user_code , name : req.body.name, body : req.body.body,
  adopted : req.body.adopted, keyword: req.body.keyword , createdAt: req.body.createdAt}}},
  (err, result) => {
    if(!err) {
      return res.json({result : "ok"});
    }
    else return res.json({result : "fail"});
  });
};

// 댓글 수정하기
exports.updateComment = (req, res) => {
  Board.findOneAndUpdate({_id: req.params.id, comments : {_id : req.params.comment}}, {$set : {comments : {req.body}}},(err, result) => {
    if(!err) {
      return res.json({result : "ok"});
    }
    else return res.json({result : "fail"});
  });
};

// 댓글 삭제하기
exports.deleteComment = (req, res) => {
    Board.findOneAndUpdate({_id: req.params.id}, {$pull : {comments : {_id : req.params.comment}}}, (err, result) => {
      if(!err) {
        return res.json({result : "ok"});
      }
      else return res.json({result : "fail"});
    });
};
