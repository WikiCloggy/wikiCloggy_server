const fs = require('fs');
const path = require('path');
const Board = require('../../models/board');

// 게시글 검색 정보 찾아오기
exports.getByValue = (req, res) => {
  // 수정 필요 찾으려고 하는 지표 설정
  // get post by id
  Board.getByvalue({_id: req.params.id}, (err, board)=> {
    if (err) return res.status(500).send(err); // 500 error
    const result = board.toJSON();

    return res.json(result);
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

}

// 게시글 수정하기
exports.update = (req, res) => {

}

// 게시글 지우기
exports.delete = (req, res) => {

}


//commnet create edit delete

// 댓글 생성하기
exports.createCommnet = (req, res) => {

}

// 댓글 수정하기
exports.updateCommnet = (req, res) => {

}

// 댓글 삭제하기
exports.deleteCommnet = (req, res) => {

}
