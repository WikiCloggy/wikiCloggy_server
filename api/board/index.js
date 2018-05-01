const express = require('express');

const router = express.Router();
const boardCtrl = require('./board.controller');

// 검색어로 찾기
router.get('details:/id',boardCtrl.getByValue);
// 게시글 목록 불러오기
// router.get('/list', boardCtrl.getAll);
// router.get('/list/:page',boardCtrl.getMore);


// post create edit delete
router.post('/', boardCtrl.create);
router.post('/file', boardCtrl.uploadFile);
router.patch('/:id',boardCtrl.update);
router.delete('/delete/:id',boardCtrl.delete);

// comment create edit delete
// router.post('/comments',boardCtrl.createComment);
// router.patch('/comments/:id',boardCtrl.updateComment);
// router.delete('/delete/:id/:comment', boardCtrl.deleteComment);

module.exports = router;
