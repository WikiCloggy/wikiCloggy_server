const express = require('express');

const router = express.Router();
const resultCtrl = require('./result.controller');
const fs = require ('fs');

// add keyword and information
router.post('/', resultCtrl.create);
router.post('/files/:id', resultCtrl.uploadFile);

// get informaion & images in that keyword
router.get('/details', resultCtrl.getDetail);

// for admin.
router.get('/admin/show', resultCtrl.showAll);
router.post('/admin/edit/:id', resultCtrl.editKeyword);
router.delete('/admin/delete/:id', resultCtrl.delete);
//add keyword & information
router.get('/admin/upload', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('testKeyword.html', null, function(error, data) {
    if(error) {
      res.writeHead(404);
      res.write('File not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
});

module.exports = router;
