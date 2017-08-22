/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
// ==================== SETUP ==========================

// Modules
const io = require('socket.io-client');
const expect = require('chai').expect;

// Fields
const baseUrl = 'http://localhost:3000';
const options = { transports: ['websocket'], 'force new connection': true };


// ==================== TESTS ==========================

describe('Socket', () => {
  it('Connect', (done) => {
    const client = io.connect(baseUrl, options);
    client.on('connect', () => {
      expect(client.connected, '[ Socket accepts connection ]').to.be.true;
      client.disconnect();
      done();
    });
  });
  it('Message', (done) => {
    let received = 0;
    const client1 = io.connect(baseUrl, options);

    const check = (client) => {
      client.on('broadcast message', (nickname, color, msg) => {
        expect(msg, '[ Message is broadcasted back to all users. ]').to.equal('Testing...');
        client.disconnect();
        if (++received === 3) { done(); }
      });
    };

    client1.on('connect', () => {
      check(client1);
      const client2 = io.connect(baseUrl, options);
      client2.on('connect', () => {
        check(client2);
        const client3 = io.connect(baseUrl, options);
        check(client3);
        client3.on('connect', () => {
          client3.emit('submit message', 'Testing...');
        });
      });
    });
  });
});
