//https://wayhome25.github.io/nodejs/2017/02/21/nodejs-15-file-upload/

const multer = require('multer');

function uploadAvatar(req, res) {
  const storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (request, file, cb) {
      cb(null, './files/avatar/');
    },
    // 서버에 저장할 파일 명
    filename: function (request, file, cb) {
      const uploadedFile = {
        name: file.originalname.split('.')[0],
        ext: file.originalname.split('.').pop(),
      };
      // cb(null, `${uploadedFile.name}-${Date.now()}.${uploadedFile.ext}`);
      cb(null, `${uploadedFile.name}-avatar.${uploadedFile.ext}`);
    },
  });
  const upload = multer({ storage : storage }).fields([{ name: 'avatarFile' }]);
  const promise = new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else {
        resolve({
          ok: 'ok',
          // prevAvatarPic: req.user.common.avatar_path,
        });
      }
    });
  });
  return promise;
}

module.exports = uploadAvatar;
