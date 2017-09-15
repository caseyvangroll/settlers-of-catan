
// ==================== DEPENDENCIES ==========================
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoConfig = require('./mongoConfig.js');

// ==================== MODELS ==========================
const user = new mongoose.Schema({
  color: String,
  createdAt: { type: Date, expires: 28800, default: Date.now },
  ip: String,
  mode: String,
  nickname: String,
  state: String,
  token: String,
});

const chatEvent = new mongoose.Schema({
  body: String,
  color: String,
  nickname: String,
  type: String, // action or message
});

// ==================== EXPORT ==========================

module.exports = (args) => {
  // Create connection
  const config = args.includes('test') ? mongoConfig.test : mongoConfig.prod;
  mongoose.connect(config.uri, { useMongoClient: true });

  // Return config and model references
  return Object.create({
    config: args.includes('test') ? mongoConfig.test : mongoConfig.prod,
    ChatEvent: mongoose.model('ChatEvent', chatEvent),
    User: mongoose.model('User', user),
  });
};
