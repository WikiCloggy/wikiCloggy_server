const router = require('express').Router();
const board = require('./board');
const query = require('./query');
const result = require('./result');
const user = require('./user');

router.use('/board', board);
router.use('/query', query);
router.use('/result', result);
router.use('/user', user);
module.exports = router;
