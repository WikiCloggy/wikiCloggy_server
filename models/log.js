const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;

/**
* @module log
* @description make the log data from user history
*/

const LogSchema = new Schema({
  user_code: { type: String, required: true},
  img_path: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  keyword: { type: String},
});


LogSchema.plugin(autoIncrement.plugin, 'log');

LogSchema.statics = {
  create(data, callback) {
    const writing = new this(data);
    writing.save(callback);
  }
}

const log = mongoose.model('log', LogSchema);

// ?? why use
module.exports = {
  Log: log,
};