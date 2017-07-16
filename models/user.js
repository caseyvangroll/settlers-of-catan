const mongoose = require('mongoose');

const user = new mongoose.Schema({
  name: String,
  secret: String,
  admin: Boolean,
});

module.exports = mongoose.model('User', user);
