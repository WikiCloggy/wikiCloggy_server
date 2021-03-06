const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const  Schema  = mongoose.Schema;

/**
* @module log
* @description make the log data from user history
*/

const LogSchema = new Schema({
  user_code: { type: String, required: true},
  img_path: {type: String},
  createdAt: {type: Date, default: Date.now},
  result_id : {type : String, ref: 'Result'},
  analysis : [{
      keyword: {type: String},
      probability:{type:String}
    }]
});


LogSchema.plugin(autoIncrement.plugin, 'log');

LogSchema.statics = {
  create(data, callback) {
    const log = new this(data);
    log.save(callback);
  },

};

const model = mongoose.model('log', LogSchema);

module.exports = model;
