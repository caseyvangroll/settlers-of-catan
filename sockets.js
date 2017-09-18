
// ==================== DEPENDENCIES ==========================

const cookie = require('cookie');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

module.exports = (server, db, Log, game) => {
  const io = socketio.listen(server);

  // ==================== GAME ==========================
  const enableGameEvents = (socket) => {
    socket.on('resource', (id) => {
      socket.emit('highlight vertex', game.resources[id].vertices);
    });

    socket.on('vertex', (id) => {
      socket.emit('highlight resource', game.vertices[id].resources);
      socket.emit('highlight vertex', game.vertices[id].vertices);
    });
  };

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

    socket.on('bind user', (cookies, mobile) => {
      const signedToken = cookie.parse(cookies).superEvilVirus;
      const decodedToken = jwt.verify(signedToken, db.config.secret);

      // Find user (created via POST @ enter.html) and bind to socket
      db.User.findOne({ nickname: decodedToken.nickname, token: signedToken }, (err, found) => {

        if (found) {
          // Use existing mode or assign new if fresh connect
          if (found.mode === 'unassigned') {
            if (game.players.length < game.MAX_PLAYERS && !mobile) {
              found.mode = 'player';
              game.addPlayer(found.nickname);
            }
            else {
              found.mode = 'spectator';
            }
          }
          found.state = 'Connected';

          // Bind user properties to socket for easy access
          socket.color = found.color;
          socket.ip = found.ip;
          socket.mode = found.mode;
          socket.nickname = found.nickname;
          socket.state = found.state;
          socket.token = found.token;
          Log.game(found.nickname, { action: 'bind', agent: ip, mode: found.mode });

          // Emit join message and pass gamestate -> if player enable server-side game event listeners
          if (found.mode === 'player') { enableGameEvents(socket); }
          io.emit('chat action', found.nickname, `joined as ${found.mode}`);
          socket.emit('gamestate', game.viewOf(found.nickname));

          // Update Database
          found.save();
          new db.ChatEvent({
            body: `joined as ${found.mode}`,
            nickname: found.nickname,
            type: 'action',
          }).save();
        }
        else {
          Log.error({
            action: 'error',
            agent: ip,
            message: `Couldn't find user in database...  ${JSON.stringify({ nickname: decodedToken.nickname, token: signedToken })}`,
          });
          io.emit('chat action', socket.nickname, 'joined');
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
      Log.game({ action: 'disconnect', agent: socket.nickname });

      // If no one else is in room -> clear messages
      if (io.engine.clientsCount === 0) {
        db.ChatEvent.remove({}, () => {
          Log.chat('Cleared chat history');
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
  });
};
