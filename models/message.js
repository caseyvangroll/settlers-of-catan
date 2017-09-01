const mongoose = require('mongoose');

const message = new mongoose.Schema({
  body: String,
  color: String,
  nickname: String,
});

module.exports = mongoose.model('Message', message);
