
// ==================== MODELS ==========================
const user = require('../models/user.js');
const mongoConfig = require('../../mongoConfig.js');

module.exports = {
  models: {
    User: user,
  },
  mongo: {
    secret: mongoConfig.secret,
    uri: mongoConfig.uri,
  },
};
