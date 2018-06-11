//https://wayhome25.github.io/nodejs/2017/02/21/nodejs-15-file-upload/

const multer = require('multer');

function uploadLog(req, res) {
  const storage = multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null, './files/log/');
    },
    filename: function (request, file, cb) {
      const uploadedFile = {
        name: file.originalname.split('.')[0],
        ext: file.originalname.split('.').pop(),
      };
      cb(null, `${Date.now()}.${uploadedFile.ext}`);
    },
  });
  const upload = multer({ storage : storage }).fields([{ name: 'logFile' }]);
  const promise = new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else {
        resolve({
          ok: 'ok',
        });
      }
    });
  });
  return promise;
}

module.exports = uploadLog;
