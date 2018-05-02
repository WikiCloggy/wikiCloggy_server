const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;

/**
* @module result
* @description contain the result of analysis data
*/

const ResultSchema = new Schema({
  keyword: { type: String, required: true},
  ref: [{
    img_path: { type: String, required: true},
    result: { type: String, required: true},
  }],
});


ResultSchema.plugin(autoIncrement.plugin, 'result');

ResultSchema.statics = {
  create(data, callback) {
    const writing = new this(data);
    writing.save(callback);
  }
}

const result = mongoose.model('result', ResultSchema);


module.exports = {
  Result: result,
};
