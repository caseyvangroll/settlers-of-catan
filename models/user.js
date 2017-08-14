const mongoose = require('mongoose');

const user = new mongoose.Schema({
  ip: String,
  nickname: String,
  state: String,
  token: String,
});

module.exports = mongoose.model('User', user);
