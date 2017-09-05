
// ==================== DEPENDENCIES ==========================

const cookie = require('cookie');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

module.exports = (server, db, Log, game) => {
  const io = socketio.listen(server);
  io.on('connection', (socket) => {

// ==================== SETUP ==========================

    const ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    socket.nickname = ip;

    // Echo all existing messages to user
    db.ChatEvent.find({}, (err, found) => {
      found.forEach((event) => {
        switch (event.type) {
          case 'action': socket.emit('chat action', event.nickname, event.body);
            break;
          default: socket.emit('broadcast message', event.nickname, event.color, event.body);
            break;
        }
      });
    });

// ==================== BIND USER ==========================

    socket.on('bind user', (cookies) => {
      const signedToken = cookie.parse(cookies).superEvilVirus;
      const decodedToken = jwt.verify(signedToken, db.config.secret);

      // Find user (created via POST @ enter.html) and bind to socket
      db.User.findOneAndUpdate({ nickname: decodedToken.nickname, token: signedToken }, { state: 'Connected.' }, (err, found) => {
        if (found) {
          socket.color = found.color;
          socket.ip = found.ip;
          socket.nickname = found.nickname;
          socket.state = found.state;
          socket.token = found.token;

          Log.server(socket.nickname, { action: 'bind', agent: ip });
          io.emit('chat action', socket.nickname, 'joined');
          new db.ChatEvent({
            body: 'joined',
            nickname: socket.nickname,
            type: 'action',
          }).save();

        }
        else {
          io.emit('chat action', socket.nickname, 'joined');
          Log.error({
            action: 'error',
            agent: ip,
            message: `Couldn't find user in database...  ${JSON.stringify({ nickname: decodedToken.nickname, token: signedToken })}`,
          });
        }
      });
    });

// ==================== MESSAGES ==========================

    socket.on('submit message', (msg) => {
      Log.chat(`${socket.nickname}: ${msg}`);
      io.emit('broadcast message', socket.nickname, socket.color, msg);

      new db.ChatEvent({
        body: msg,
        color: socket.color,
        nickname: socket.nickname,
        type: 'message',
      }).save();
    });

// ==================== DISCONNECT ==========================

    socket.on('disconnect', () => {
      Log.server({ action: 'disconnect', agent: socket.nickname });

      // If no one else is in room -> clear messages
      if (io.engine.clientsCount === 0) {
        db.ChatEvent.remove({}, () => {
          Log.server('Cleared chat history');
        });
      }
      // Otherwise broadcast and save leave action
      else {
        io.emit('chat action', socket.nickname, 'left');
        new db.ChatEvent({
          body: 'left',
          nickname: socket.nickname,
          type: 'action',
        }).save();
      }

      // Update user in db
      db.User.findOneAndUpdate({ token: socket.token }, { state: 'Disconnected.' });
    });

    // ==================== GAME ==========================

    socket.on('request game', () => {
      socket.send('send game', game);
    });
  });
};