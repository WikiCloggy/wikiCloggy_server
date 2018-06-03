const mongoose = require('mongoose');
// const autoIncrement = require('mongoose-auto-increment');

const  Schema   = mongoose;

/**
* @module board
* @description contain the board info and comment
*/

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  img_path: { type: String, required: true},
  comments: [{
    commenter: {type: String, required: true},
    body: {type: String, required: true},
    adopted: {type: Boolean},
    keyword: {type: String, required: true},
    createdAt : {type: Date, default: Date.now}
  }],
  author: { type: String },
  createdAt: { type: Date, default: Date.now}
});


BoardSchema.statics = {
  create(data, callback) {
    const writing = new this(data);
    writing.save(callback);
  },
  getByValue(query, callback) {
    this.fineOne(query, callback);
  }
}

// DEFINE MODEL
const board = mongoose.model('board', BoardSchema);

module.exports = {
  Board: board,
};
