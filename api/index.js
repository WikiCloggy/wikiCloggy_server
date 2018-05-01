const router = require('express').Router();
const board = require('./board');
const log = require('./log');
const result = require('./result');
const user = require('./user');

router.use('/board', board);
router.use('/log', log);
// router.use('/result', result);
router.use('/login', user);

module.exports = router;
