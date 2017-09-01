/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
// ==================== SETUP ==========================

// Modules
const request = require('supertest');
const io = require('socket.io-client');
const expect = require('chai').expect;
const cookie = require('cookie');

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

  describe('Chat', () => {

    it('Join/Leave', (done) => {

      // Post to get cookie to allow binding Client 1 to usernmame
      request(baseUrl)
        .post('/enter.html')
        .send({ nickname: 'Test User' })
        .end((err, res) => {
          const cookies = res.header['set-cookie'][0];

          const client1 = io.connect(baseUrl, options);
          const client2 = io.connect(baseUrl, options);
    
          // Client 2 observes Client 1 joining and leaving game
          client2.on('chat action', (nickname, action) => {
            if (action === 'joined') {
              expect(nickname, '[ Join message broadcasted ]').to.equal('Test User');
              client1.disconnect();
            }
            else if (nickname === 'Test User' && action === 'left') {
              expect(action, '[ Leave message broadcasted ]').to.equal('left');
              done();
            }
            else {
              expect(true, `Unknown chat action: ${action}`).to.be.false;
            }
          });

          client1.emit('bind user', cookies);
        });
    });

    // Messages submitted are broadcast to all users
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


  
  




});
