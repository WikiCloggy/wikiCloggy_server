const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

/**
* @module user
* @description contain the details of user info
*/

const UserSchema = new Schema({
  user_code: { type: String, required: true },
  avatar_path: {type: String },
  name: { type: String },
  dogs: [{
    thick: { type: String},
    gender: { type: String},
    name: { type: String},
    age: { type: Number}
  }]
});

UserSchema.plugin(autoIncrement.plugin, 'user');

UserSchema.statics = {
  create(data, callback) {
    const user = new this(data);
    user.save(callback);
  },
};

const user = mongoose.model('user', UserSchema);

module.exports = {
  User: user,
};
