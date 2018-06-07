const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const  Schema   = mongoose.Schema;

/**
* @module board
* @description contain the board info and comment
*/

const BoardSchema = new Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  img_path: { type: String},
  author: { type: String},
  author_name : {type: String, ref:'user'},
  adminChecked :{type : Boolean, default :false},
  createdAt: { type: String},
  comments: [{
    commenter: {type: String}, // commenter_user_code
    name:{type: String},
    body: {type: String},
    adopted: {type: Boolean},
    keyword: {type: String},
    createdAt : {type: String}
  }]
});

BoardSchema.plugin(autoIncrement.plugin, 'board');

BoardSchema.statics = {
  create(data, callback) {
    const board = new this(data);
    board.save(callback);
  },
  getByValue(query, callback) {
    this.fineOne(query, callback);
  },
};

// DEFINE MODEL
const model = mongoose.model('board', BoardSchema);

module.exports = model;
