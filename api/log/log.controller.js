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
        PythonShell.run("start_estimate.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',args:[ `files/${req.files.logFile[0].destination.match(/[^/]+/g).pop()}/${req.files.logFile[0].filename}`, '-flip', 'False']}, function (err, results) {
         if(err) console.log("err msg :"+ err);
          var filename = `${req.files.logFile[0].filename.split('.')[0]}` +'.json';
          var content = fs.readFileSync('../data/result/'+filename);
          console.log("content = " +content);
          var jsonContent = JSON.parse(content);
          var resultKeyword = '0';

          if (jsonContent[0].keyword == "head_not_found"){
            console.log("head not found");
            return res.json({result : "fail", reason : "head_not_found"});
          }
          // head not found
          else if (jsonContent[0].keyword == "cloggy_not_found"){
            console.log("cloggy not found");
            return res.json({result : "fail", reason : "cloggy_not_found"});
          }

          for(var i=0; i<jsonContent.length; i++)
          {

            Result.find({eng_keyword : jsonContent[i].keyword}, (err, keyword) => {
              console.log("i : " + i + "keyword" + keyword);
              if (err) res.status(500).send(err); // jsonContent에 있는 영어 keyword 검색
              else if(keyword == '') // 키워드 검색했을 때 그 값이 존재하지 않을 때
              {
                console.log("no result exist");
                return res.json({result : "fail", reason : "no_result"});
                // cloggy not found
              }// 결과 값을 찾지 못했을 때
              else if(i == 0) {
                if(jsonContent[i].probability < 0.4){ // 결과값 부정확 ㅡ 지식견
                  console.log("it is not correct");
                  return res.json({result : "fail", reason : "not_correct"});
                }
                else
                {
                  resultKeyword = keyword[0]._id;
                }
              }// 키워드가 존재 할 때 제일 첫번째 대표 키워드 값에 대한 setting.
              else if(i==jsonContent.length-1)
              {
                // query log에 들어있는 값 업데이트.
                // 필수 과정
              Log.findOneAndUpdate({_id : req.params.id}, { $set : {result_id : resultKeyword}, $push: { analysis : jsonContent}}, (err, result) => {
                if(!err) {
                  return res.json({result : "success", percentage : jsonContent, path : result.img_paths, state : result.analysis});
                }
              })
            }
              else {
                // eng keyword -> korean keyword
                jsonContent[i].keyword = keyword[0].keyword;
              }
          });
        }
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
