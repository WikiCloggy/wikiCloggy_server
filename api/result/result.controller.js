const fs = require('fs');
const path = require('path');
const Result = require('../../models/result');
const Board = require('../../models/board');
const upload = require('../../middlewares/uploadKeyword');
const config = require('../../config/server.config');
const exec = require('child_process').exec;
const PythonShell = require('python-shell');

exports.create = (req, res) => {
  Result.find({keyword : req.body.keyword}, function (err, keyword) {
    if(err) return res. json({result : "wrong query"});
    else if(keyword == '') {
      Result.create(req.body, (err, result) => {
        if(!err) {
          return res.json(result);
        }
      }); // 존재하지 않는 keyword 생성.
    }
    else {
      return res.json(keyword);
    } // 존재 하는 keyword에 query 이미지 추가
  });
};

exports.uploadFile = (req, res) => {
  upload(req, res)
    .then((files) => {
      Result.findOneAndUpdate({ _id : req.params.id } ,{ $push : {img_paths :{img_path: `${config.serverUrl()}files/${req.files.queryFile[0].destination.match(/[^/]+/g).pop()}/${req.files.queryFile[0].filename}`}}},
      (err, result) => {
        if(!err) {
          return res.json(result);
        }
        else return res.json({result : "fail"});
      });
      })
    .catch((err) => {
      res.status(500).send('Upload middlewares error');
    });
};

exports.delete = (req, res) => {
  Result.findOneAndRemove({_id : req.params.id}, (err, result) => {
    if(!err) {
      return res.json({result : "ok"});
    }
    return res.json({result : "fail"});
  })
};


exports.getDetail = (req, res) => {
  Result.find({keyword : req.body.keyword}, (err, result) => {
    if(!err) {
      return res.json(result);
    }
    return res.json({result : "fail"});
  })
};


exports.showAll = (req, res) => {
  Result.find({}, (err, result) => {
    if(!err) {
      return res.json(result);
    }
    return res.json({result :"fail"});
  })
};


exports.editKeyword = (req, res) => {
  Result.findOneAndUpdate(
    { _id : req.params.id}, {$set:req.body}, (err, result) => {
      if(!err) {
        return res.json(result);
      }
      else return res.json({result : "fail"});
    }
  )
}

function copyImage(img_path, callback) {


  var new_img_path = `/files/result/${filename}`
  callback(new_img_path);
}

exports.addKeyword = (req, res) => {
  Board.findOneAndUpdate({_id : req.body._id}, {adminChecked : true}, (err, board) => {
    Result.find({eng_keyword : req.body.eng_keyword}, function (err, result) {
      if(err) res.json({result : "fail"});
      else {
        var splitPath = req.body.img_path.split("/");
        var nArLength = splitPath.length;
        var filename = splitPath[nArLength-1];
        var relativePath = splitPath[nArLength-3] +'/'+splitPath[nArLength-2] +'/'+splitPath[nArLength-1];
        exec(`cp ./${relativePath} ./files/result/${filename}`, function(err, stdout, stderr) {
          if(req.body.flip == "left")
            req.body.flip = "False";
          else req.body.flip ="True";
          console.log("cp ok");
          if( result == '') { // 키워드가 존재하지 않을 때 생성함
            console.log('result not exist');
            Result.create(req.body, (err, create) => {
              if(!err) {
                // python run label
                console.log('create no error');
                var new_image_path = `files/result/${filename}`;
                console.log('create' + create);
                Result.findOneAndUpdate({_id : create[0]._id},{ $push : {img_paths :{img_path: `${config.serverUrl()}/${new_image_path}`}}},function(err, update) {
                  if(!err) {
                    // python run label
                    console.log('update' + update);
                    PythonShell.run("label_maker.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',
                    args:["-add",req.body.eng_keyword]},function (err, results) {
                      console.log("pythonShell labeling start");
                      PythonShell.run("add_data.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',
                      args:[new_image_path ,"-flip", req.body.flip, "-keyword", req.body.eng_keyword]},function (err, results) {
                        console.log("pythonShell make training dataset");
                        return res.json(update);
                      });
                    });
                  }
                  else return res.json({result : "fail"});
                });
              }
              else return res.status(500).send(err);
            }); // 존재하지 않는 keyword 생성.
          }
          else { // 키워드가 존재함. 복사된 이미지 경로로 path push해주기
            Result.findOneAndUpdate({_id : result[0]._id},{ $push : {img_paths :{img_path: `${config.serverUrl()}/${new_image_path}`}}},function(err, update) {
              if(!err) {
                // python run label
                PythonShell.run("label_maker.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',
                args:["-add",req.body.eng_keyword]},function (err, results) {
                  console.log("pythonShell labeling start");
                  PythonShell.run("add_data.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/',
                  args:[new_image_path ,"-flip", req.body.flip, "-keyword", req.body.eng_keyword]},function (err, results) {
                    console.log("pythonShell make training dataset");
                    return res.json(update);
                  });
                });
              }
              else return res.json({result : "fail"});
            });
          }
        });
      }
    });
  });
}

exports.training = (req, res) => {
  PythonShell.run("cloggyNet_trainer.py",{mode :'text', pythonOptions:['-u'],pythonPath: 'python3',scriptPath:'../wikiCloggy_cloggy_state_estimator/'},function (err, results) {
    console.log("pythonShell training start");
  });
}

exports.getEngKeyword = (req, res) => {
  Result.find({},{"eng_keyword":true}, function (err, result) {
    return res.json(result);
  });
}
