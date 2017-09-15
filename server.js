
// ==================== DEPENDENCIES ==========================
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const serveIndex = require('serve-index');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Game object
const game = require('./game/game.js');

// Logging
const Log = require('./logger')(process.argv);

// Connect to database
const db = require('./database.js')(process.argv);

// Launch sockets code
require('./sockets.js')(server, db, Log, game);

// ================== CONFIGURATION =====================
const port = 3000;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//  ------------REMOVE THIS-------------
// temporarily assign arbitrary colors to users
let colors = ['#40A346', '#406CA3', '#C75FC2', '#D10F0F'];
const chosenColors = [];
const randomColor = () => {
  if (colors.length === 0) { colors = chosenColors.slice(); } // clone
  const color = colors.splice(Math.floor(Math.random() * colors.length), 1); // remove random color
  chosenColors.push(color); // push into chosen
  return color;
};
//  -------------------------------------

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
    db.User.findOne({ token: oldToken }, (err, found) => {
      if (found) {
        // Token found - update the existing user's state and ip
        found.ip = userIP;
        found.state = 'Connecting...';
        found.save();
        Log.server({ action: 'reconnect', agent: found.nickname });
        res.redirect('game.html');
      }
      else {
        // Token not found - clear client's cookie and send to entry page
        Log.server("Couldn't find user", { action: 'reconnect', agent: userIP });
        res.clearCookie('superEvilVirus');
        res.redirect('enter.html');
      }
    });
  }
  else {
    // Connect - Send entry page
    Log.server({ action: 'connect', agent: userIP });
    res.redirect('enter.html');
  }
});

// Register New User
app.post('/enter.html', (req, res) => {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Create new token with ip & nickname, sign with secret
  jwt.sign({ nickname: req.body.nickname }, db.config.secret, { expiresIn: '8h' }, (err, newToken) => {
    new db.User({
      color: randomColor(),
      ip: userIP,
      mode: (game.players.length < game.MAX_PLAYERS) ? 'player' : 'spectator',
      nickname: req.body.nickname,
      state: 'Connecting...',
      token: newToken,
    }).save();
    // Send token back in cookie
    res.cookie('superEvilVirus', newToken);
    res.redirect('game.html');
  });
});

// ==================== START APP ========================

server.listen(port, () => {
  Log.server({ action: 'start' });
});
