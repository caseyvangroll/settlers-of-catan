const mongoose = require('mongoose');

const user = new mongoose.Schema({
  color: String,
  createdAt: { type: Date, expires: 28800, default: Date.now },
  ip: String,
  nickname: String,
  state: String,
  token: String,
});

module.exports = mongoose.model('User', user);
