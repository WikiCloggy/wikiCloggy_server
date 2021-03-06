const fs = require('fs');
const path = require('path');
const Log  = require('../../models/log');
const  User  = require('../../models/user');
const Result = require('../../models/result');
const upload = require('../../middlewares/uploadLog');
const config = require('../../config/server.config');
const PythonShell = require('python-shell');

const npage = 5;

// 로그 생성
// /api/log/
exports.create = (req, res) => {
  console.log("start!");
  User.find({user_code : req.body.user_code}, function (err, user) {
    if(err) return res.status(404).send('finding query failed');
    else if(user == '') {
        return res.status(404).send('user code not exist');
      }
    else {
      Log.create(req.body, (err, result) => {
        if(!err) {
          console.log("create");
          return res.json(result);
        }
      });
    }
  });
};

// test for web
exports.showAll = (req, res) => {
  Log.find({}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
};

function settingPythonShell (img_path,type ,callback) {
  var splitPath = img_path.split("/");
  var nArLength = splitPath.length;
  var filename = splitPath[nArLength-1].split('.')[0]+'.json';
  var relativePath = splitPath[nArLength-3] +'/'+splitPath[nArLength-2] +'/'+splitPath[nArLength-1];
  var flip;
  if(type == "left")
    flip="False";
  else flip="True";
  console.log("setting"+relativePath+flip);
  callback(relativePath,flip, filename);
}

// 요청했던 사진에 머리를 찾을 수 없어 머리의 위치를 받아와 유저에게 결과값 전송
exports.getDirection = (req, res) => {
  Log.find({_id : req.params.id}, function (err, result){
      if(!err) {
        settingPythonShell(result[0].img_path,req.params.type, function(relativePath,flip,filename){
          console.log("start" + relativePath +flip);
          PythonShell.run("start_estimate.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',
          args:[relativePath,"-flip",flip]},
           function (err, results) {
             console.log("pythonShell start");
           if(err) {console.log("err msg :"+ err);}
            var content = fs.readFileSync('../data/result/'+filename);
            console.log("content = " +content);
            var jsonContent = JSON.parse(content);
            if(jsonContent[0].probability < 0.4){ // 결과값 부정확 ㅡ 지식견
              console.log("it is not correct");
              return res.json({result : "fail", reason : "not_correct"});
            }
            //promise 로 수정 예정!
            Result.find({eng_keyword : jsonContent[0].keyword}, (err,keyword1) => {
              jsonContent[0].keyword = keyword1[0].keyword;
              Result.find({eng_keyword : jsonContent[1].keyword}, (err, keyword2) => {
                jsonContent[1].keyword = keyword2[0].keyword;
                Result.find({eng_keyword : jsonContent[2].keyword}, (err, keyword3) => {
                  jsonContent[2].keyword = keyword3[0].keyword;
                  Log.findOneAndUpdate({_id : req.params.id}, { $set : {result_id : keyword1[0]._id}, $push: { analysis : jsonContent}}, (err, result) => {
                    if(!err) {
                      console.log("result = " + jsonContent);
                      return res.json({result : "success", percentage : jsonContent, path : keyword1[0].img_paths, state : keyword1[0].analysis});
                    }
                  });
                });
              });
            });
        });
      });
    }
  })
};

// 요청되었던 사진 정보 업로드
// /api/log/file/:id
exports.uploadFile = (req, res) => {
  console.log("file");
  upload(req, res)
    .then((files) => {
      console.log("here?"+req.params.id);
      Log.where({_id : req.params.id})
      .update({ $set : {img_path: `${config.serverUrl()}files/${req.files.logFile[0].destination.match(/[^/]+/g).pop()}/${req.files.logFile[0].filename}` } }).exec()
      .then(() => {
        // 기술에서 keyword json array 형식으로 받아와서 jsonarrya 에 0 번째 있는 keyword 값을 넣어줌.
        console.log("ready");
        PythonShell.run("start_estimate.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',args:[ `files/${req.files.logFile[0].destination.match(/[^/]+/g).pop()}/${req.files.logFile[0].filename}`]},
         function (err, results) {
         if(err) console.log("err msg :"+ err);
          var filename = `${req.files.logFile[0].filename.split('.')[0]}` +'.json';
          var content = fs.readFileSync('../data/result/'+filename);
          console.log("content = " +content);
          var jsonContent = JSON.parse(content);

          if (jsonContent[0].keyword == "head_not_found"){
            console.log("head not found");
            return res.json({result : "fail", reason : "head_not_found", _id : req.params.id});
          }
          // head not found
          else if (jsonContent[0].keyword == "cloggy_not_found"){
            console.log("cloggy not found");
            return res.json({result : "fail", reason : "cloggy_not_found"});
          }
          else if(jsonContent[0].probability < 0.4){ // 결과값 부정확 ㅡ 지식견
            console.log("it is not correct");
            return res.json({result : "fail", reason : "not_correct"});
          }
          //promise 로 수정 예정!
          Result.find({eng_keyword : jsonContent[0].keyword}, (err,keyword1) => {
            jsonContent[0].keyword = keyword1[0].keyword;
            Result.find({eng_keyword : jsonContent[1].keyword}, (err, keyword2) => {
              jsonContent[1].keyword = keyword2[0].keyword;
              Result.find({eng_keyword : jsonContent[2].keyword}, (err, keyword3) => {
                jsonContent[2].keyword = keyword3[0].keyword;
                Log.findOneAndUpdate({_id : req.params.id}, { $set : {result_id : keyword1[0]._id}, $push: { analysis : jsonContent}}, (err, result) => {
                  if(!err) {
                    console.log("result = " + jsonContent);
                    return res.json({result : "success", percentage : jsonContent, path : keyword1[0].img_paths, state : keyword1[0].analysis});
                  }
                });
              });
            });
          });
      });
    })
      .catch((err) => {
        res.status(500).json({err : err, message : 'the data not exist'});
      });
    })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
};

// 로그 삭제
// /api/log/:id
exports.delete = (req, res) => {
  Log.findOneAndRemove({_id: req.params.id}, (err, result) => {
    if(!err && result) { fs.unlink(path.join(__dirname, `../../files/${result.img_path}`), (fsErr) => {
      if (fsErr) console.warn({ err: 'not removed on Server' });
    }); // db에 저장된 img_path와 함께 해당 파일 삭제
    return res.json(result);
  };
  return res.status(404).send({ message: 'No data found to delete' });
  });
};

// 로그 받아오기
// /api/log/list/:user
exports.getAll = (req, res) => {
  Log.find({user_code : req.params.user_code}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  });
};

// 한 페이지당 5개의 log 정보를 불러와서 return. sort 는 id 순으로.
exports.getMore = (req, res) => {
  page = req.params.page;
  Log.find({user_code: req.params.user_code}, function (err, result) {
    if(!err) {
      return res.json(result);
    }
    return res.status(500).send(err);
  }).sort({_id: -1 }).skip((page)*npage).limit(npage);
};

// 로그 자세히 보기
// /api/log/details/:id
exports.getDetail = (req, res) => {
  Log.find({_id : req.params.id}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};
