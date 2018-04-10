// https://javafa.gitbooks.io/nodejs_server_basic/content/chapter13.html -node js/ mongodb
// https://gist.github.com/companje/b95e735650f1cd2e2a41 - socket io
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var fs = require('fs');
var io = require(socket.io)(http);

//socket io
io.on('connection', function(socket){
  fs.readFile('image.png', function(err, data){
    socket.emit('imageConversionByClient', { image: true, buffer: data });
    socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
  });
});

//open server
http.listen(3000, function(){
  console.log('listening on *:3000');
});


// Database - mongodb
mongoose.connect('mongodb://localhost:27017/testDB');

var db = mongoose.connection;

db.on('error',fuction(){
  console.log('Connection Failed!');
});

db.once('open', function() {
  console.log('Connected!');
});

app.get('/', function(req, res) {
  res.send('Hello World');
});

var student = mongoose.Schema({
  name : 'string',
  address : 'string',
  age : 'number'
});

var newStudent = new Student({name : 'Hong Gil Dong', address : '서울시 강남구 논현동', age:'22'});

newStudent.save(function(error, data){
  if(error){
    console.log(error);
  } else {
    console.log('Saved!')
  }
});

// Student.find(function(error, students){
//   console.log('--Read all --');
//   if(error){
//     console.log(error);
//   } else {
//     console.log(students);
//   }
// })
//
// Student.findOne({_id:'585b777f7e2315063457e4ac'}, function(error,student){
//     console.log('--- Read one ---');
//     if(error){
//         console.log(error);
//     }else{
//         console.log(student);
//     }
// });
//
// // 12. 특정아이디 수정하기
// Student.findById({_id:'585b777f7e2315063457e4ac'}, function(error,student){
//     console.log('--- Update(PUT) ---');
//     if(error){
//         console.log(error);
//     }else{
//         student.name = '--modified--';
//         student.save(function(error,modified_student){
//             if(error){
//                 console.log(error);
//             }else{
//                 console.log(modified_student);
//             }
//         });
//     }
// });
//
// // 13. 삭제
// Student.remove({_id:'585b7c4371110029b0f584a2'}, function(error,output){
//     console.log('--- Delete ---');
//     if(error){
//         console.log(error);
//     }
//
//     /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
//         어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
//         이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
//         */
//     console.log('--- deleted ---');
// });
