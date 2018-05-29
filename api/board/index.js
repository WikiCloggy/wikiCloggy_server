const express = require('express');

const router = express.Router();
const boardCtrl = require('./board.controller');

// 선택 글 보기
router.get('details:/id',boardCtrl.getDetail);

// 유저 아이디로 보기
router.get('/log/:user', boardCtrl.getAll);

// post create edit delete
router.post('/', boardCtrl.create);
router.post('/files/:id', boardCtrl.uploadFile);
router.post('/:id',boardCtrl.updatePost);
router.delete('/delete/:id',boardCtrl.deletePost);

// comment create edit delete
router.post('/comments',boardCtrl.createComment);
router.post('/comments/:id',boardCtrl.updateComment);
router.delete('/delete/:id/:comment', boardCtrl.deleteComment);

module.exports = router;
