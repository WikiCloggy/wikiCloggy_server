const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema  = mongoose.Schema;

/**
* @module result
* @description contain the result of analysis data
*/

const ResultSchema = new Schema({
  keyword: { type: String, required: true},
  eng_keyword : {type: String},
  analysis: { type: String},
  img_paths: [{
    img_path: { type: String}
  }]
});


ResultSchema.plugin(autoIncrement.plugin, 'result');

ResultSchema.statics = {
  create(data, callback) {
    const writing = new this(data);
    writing.save(callback);
  }
}

const model = mongoose.model('result', ResultSchema);


module.exports = model;
