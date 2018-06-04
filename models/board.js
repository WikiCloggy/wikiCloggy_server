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
  img_path: { type: String, required: true},
  author: { type: String },
  createdAt: { type: String},
  comments: [{
    commenter: {type: String, required: true},
    body: {type: String, required: true},
    adopted: {type: Boolean},
    keyword: {type: String, required: true},
    createdAt : {type: String}
  }]
});

BoardSchema.plugin(autoIncrement.plugin, 'board');

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
const model = mongoose.model('board', BoardSchema);

module.exports = model;
