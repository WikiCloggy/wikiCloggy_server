const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;

/**
* @module user
* @description contain the details of user info
*/

const UserSchema = new Schema({
  user_code: { type: String, required: true },
  img_path: {type: String },
  name: { type: String, required: true},
  dogs: [{
    thick: { type: String},
    gender: { type: String},
    name: { type: String},
    age: { type: Number}
  }],
});


UserSchema.plugin(autoIncrement.plugin, 'user');

UserSchema.statics = {
  create(data, callback) {
    const making = new this(data);
    making.save(callback);
  }
}

const user = mongoose.model('user', UserSchema);

// ?? why use
module.exports = {
  User: user,
};