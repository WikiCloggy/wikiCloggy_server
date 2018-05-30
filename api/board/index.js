const express = require('express');

const router = express.Router();
const boardCtrl = require('./board.controller');

// 선택 글 보기, 게시글의 id
router.get('details/:id',boardCtrl.getDetail);

// 유저 아이디로 보기, User_code
router.get('/log/:user_code', boardCtrl.getLog);

// post create edit delete
router.post('/', boardCtrl.create);
router.post('/files/:id', boardCtrl.uploadFile);
router.post('/edit/:id',boardCtrl.updatePost);
router.delete('/delete/:id',boardCtrl.deletePost);

// comment create edit delete
router.post('/comments/:id',boardCtrl.createComment); // 게시글 id
router.post('/comments/:id/:comment',boardCtrl.updateComment);
router.delete('/delete/:id/:comment', boardCtrl.deleteComment);

// for admin

router.get('/log/admin/show', boardCrtl.getAll);

module.exports = router;
