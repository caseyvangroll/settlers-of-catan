// ==================== MODULES ==========================
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const serveIndex = require('serve-index');
const io = require('socket.io').listen(server);
const fs = require('fs');
const winston = require('winston');
const Log = require('./logger');

// ================== CONFIGURATION =====================
const port = 3000;

// ==================== STATIC ==========================
app.use(express.static('public'));
app.use('/logs', express.static('logs'));
app.use('/logs', serveIndex('logs', { stylesheet: `${__dirname}/public/css/logs.css`, icons: true }));

// ==================== AUTHENTICATE ==========================
app.get('/setup', (req, res) => {
  const nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true,
  });

  // save the sample user
  nick.save((err) => {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// =================== SOCKET.IO =========================
io.on('connection', (socket) => {
  const ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
  Log.server({ action: 'Connect', agent: ip });

  socket.on('submit message', (msg) => {
    Log.chat(`${msg}`, { action: 'Message', agent: ip });
    io.emit('broadcast message', msg);
  });

  socket.on('disconnect', () => {
    Log.server({ action: 'Disconnect', agent: ip });
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
  Log.server({ action: 'Start', agent: `localhost:${port}` });
});

// ==================== EXPORTS ==========================
module.exports = {
  closeServer: () => { server.close(); },
};

// ==================== GAMESERVER ==========================
/*
function GameServer() {
  this.players = [];
  this.vertices = [];
  this.resources = [];
}

GameServer.prototype = {
  addTank(tank) {
    this.tanks.push(tank);
  },
};
const game = new GameServer();

io.on('connection', (client) => {
  console.log('User connected');

  client.on('joinGame', (tank) => {
    console.log(`${tank.id} joined the game`);
    const initX = getRandomInt(40, 900);
    const initY = getRandomInt(40, 500);
    client.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
    client.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP });
    game.addTank({ id: tank.id, type: tank.type, hp: TANK_INIT_HP });
  });

  client.on('sync', (data) => {
    // Receive data from clients
    if (data.tank != undefined) {
      game.syncTank(data.tank);
    }
    // update ball positions
    game.syncBalls();
    // Broadcast data to clients
    client.emit('sync', game.getData());
    client.broadcast.emit('sync', game.getData());

    // I do the cleanup after sending data, so the clients know
    // when the tank dies and when the balls explode
    game.cleanDeadTanks();
    game.cleanDeadBalls();
    counter++;
  });

  client.on('shoot', (ball) => {
    var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y);
    game.addBall(ball);
  });

  client.on('leaveGame', (tankId) => {
    console.log(`${tankId} has left the game`);
    game.removeTank(tankId);
    client.broadcast.emit('removeTank', tankId);
  });
});
*/
