const express = require('express');

const router = express.Router();
const logCtrl = require('./log.controller');

// add user history or delete
router.post('/', logCtrl.create);
router.post('/files', logCtrl.uploadFile);
router.delete('/:id', logCtrl.delete);

// fetch log, get log info from server
router.get('list', logCtrl.getAll);
router.get('/list/:page', logStrl.getMore);
router.get('details/:id', logCtrl.get);

module.exports = router;