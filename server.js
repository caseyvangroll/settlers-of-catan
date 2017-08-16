// ==================== MODULES ==========================
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const serveIndex = require('serve-index');
const io = require('socket.io').listen(server);
const jwt = require('jsonwebtoken');
const fs = require('fs');
const winston = require('winston');
const Log = require('./logger');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// ================== CONFIGURATION =====================
const port = 3000;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== DATABASE ==========================
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoConfig = require('./mongoConfig.js');
const User = require('./models/user.js');

// ==================== STATIC FILES ==========================
app.use(express.static('public'));
app.use('/logs', express.static('logs'));
app.use('/logs', serveIndex('logs', { stylesheet: `${__dirname}/public/css/logs.css`, icons: true }));

// ==================== ROUTES ==========================

// Initial (Connect or Reconnect)
app.get(['/', '/enter.html'], (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const oldToken = req.cookies.superEvilVirus;
  if (oldToken) {
    // Reconnect - Use existing token
    User.findOne({ token: oldToken }, (err, found) => {
      if (found) {
        // Token found - update the existing user's state and ip
        found.ip = userIP;
        found.state = 'Connecting...';
        found.save();
        Log.server({ action: 'Reconnect', agent: found.nickname });
        res.redirect('game.html');
      }
      else {
        // Token not found - clear client's cookie and send to entry page
        Log.server("Couldn't find user", { action: 'Reconnect', agent: userIP });
        res.clearCookie('superEvilVirus');
        res.redirect('enter.html');
      }
    });
  }
  else {
    // Connect - Send entry page
    Log.server({ action: 'Connect', agent: userIP });
    res.redirect('enter.html');
  }
});

// Register New User
app.post('/enter.html', (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Create new token with ip & nickname, sign with secret
  jwt.sign({ nickname: req.body.nickname }, mongoConfig.prod.secret, (err, newToken) => {
    new User({
      ip: userIP,
      nickname: req.body.nickname,
      state: 'Connecting...',
      token: newToken,
    }).save();
    // Send token back in cookie
    res.cookie('superEvilVirus', newToken);
    res.redirect('game.html');
  });
});

// =================== SOCKET TRAFFIC =========================
io.on('connection', (socket) => {
  const ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
  Log.socket({ action: 'Open Socket', agent: ip });
  socket.nickname = ip;

  socket.on('bind user', (cookies) => {
    const signedToken = cookie.parse(cookies).superEvilVirus;
    const decodedToken = jwt.verify(signedToken, mongoConfig.prod.secret);
    // Find user with nickname and token, then bind socket to it
    User.findOneAndUpdate({ nickname: decodedToken.nickname, token: signedToken }, { state: 'Connected.' }, (err, found) => {
      socket.ip = found.ip;
      socket.nickname = found.nickname;
      socket.state = found.state;
      socket.token = found.token;
      Log.socket({ action: `Bind ${ip} => ${socket.nickname}` });
    });
  });

  socket.on('submit message', (msg) => {
    Log.chat(`  ${socket.nickname}: ${msg}`);
    io.emit('broadcast message', socket.nickname, msg);
  });

  socket.on('disconnect', () => {
    User.findOneAndUpdate({ token: socket.token }, { state: 'Disconnected.' }, () => {
      Log.socket({ action: 'Close Socket', agent: socket.nickname });
    });
  });
});

// ==================== START APP ========================
if (process.argv.length > 2) {
  if (process.argv.includes('test')) {
    Log.remove(winston.transports.Console); Log.remove(winston.transports.File);
    if (fs.existsSync('logs/Build-Unknown.log')) { fs.unlink('logs/Build-Unknown.log'); }
  }
  else if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
}

server.listen(port, () => {
  mongoose.connect(mongoConfig.prod.uri, { useMongoClient: true });
  Log.server({ action: 'Start', agent: `localhost:${port}` });
});
