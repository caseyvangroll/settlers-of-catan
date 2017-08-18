const mongoose = require('mongoose');

const user = new mongoose.Schema({
  color: String,
  ip: String,
  nickname: String,
  state: String,
  token: String,
});

module.exports = mongoose.model('User', user);
