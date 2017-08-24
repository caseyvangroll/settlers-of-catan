// ==================== MODULES ==========================
const express = require('express');
const app = express();
const geoip = require('geoip-lite');
const countrynames = require('countrynames');
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
// temporarily assign arbitrary colors to users
let colors = ['#40A346', '#406CA3', '#C75FC2', '#D10F0F'];
const chosenColors = [];
const randomColor = () => {
  if (colors.length === 0) { colors = chosenColors.slice(); } // clone
  const color = colors.splice(Math.floor(Math.random() * colors.length), 1); // remove random color
  chosenColors.push(color); // push into chosen
  return color;
};

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

// Retrieves origin of an IP
const lookup = (ip) => {
  const result = geoip.lookup(ip);
  return result ?
    `${result.city}, ${result.region}, ${countrynames.getName(result.country)}`
    : 'Unknown';
};

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
    Log.server(`Origin: ${lookup(userIP)}`, { action: 'Connect', agent: userIP });
    res.redirect('enter.html');
  }
});

// Register New User
app.post('/enter.html', (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Create new token with ip & nickname, sign with secret
  jwt.sign({ nickname: req.body.nickname }, mongoConfig.prod.secret, { expiresIn: '8h' }, (err, newToken) => {
    new User({
      color: randomColor(),
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
      socket.color = found.color;
      socket.ip = found.ip;
      socket.nickname = found.nickname;
      socket.state = found.state;
      socket.token = found.token;
      Log.socket({ action: `Bind ${ip} => ${socket.nickname}` });
      io.emit('chat action', socket.nickname, 'joined');
    });
  });

  socket.on('submit message', (msg) => {
    Log.chat(`  ${socket.nickname}: ${msg}`);
    io.emit('broadcast message', socket.nickname, socket.color, msg);
  });

  socket.on('disconnect', () => {
    io.emit('chat action', socket.nickname, 'left');
    User.findOneAndUpdate({ token: socket.token }, { state: 'Disconnected.' }, () => {
      Log.socket({ action: 'Close Socket', agent: socket.nickname });
    });
  });
});

// ==================== START APP ========================
if (process.argv.length > 2) {
  if (process.argv.includes('test')) {
    mongoose.connect(mongoConfig.test.uri, { useMongoClient: true });
    Log.remove(winston.transports.Console); Log.remove(winston.transports.File);
    if (fs.existsSync('logs/Build-Unknown.log')) { fs.unlink('logs/Build-Unknown.log'); }
  }
  else {
    mongoose.connect(mongoConfig.prod.uri, { useMongoClient: true });
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
  }
}

server.listen(port, () => {
  Log.server({ action: 'Start', agent: `localhost:${port}` });
});
