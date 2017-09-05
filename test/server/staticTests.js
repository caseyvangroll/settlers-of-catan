/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
// ==================== SETUP ==========================

// Modules
const request = require('supertest');
const expect = require('chai').expect;
const cookie = require('cookie');
const db = require('../../database.js')(['test']);

// Fields
const baseUrl = 'http://localhost:3000';
const paths = [{ path: '/', result: 302 },
               { path: '/game.html', result: 200 },
               { path: '/enter.html', result: 200 },
               { path: '/logs/', result: 200 }];


// ==================== TESTS ==========================

describe('Static', () => {
  describe('Paths', () => {
    paths.forEach((path) => {
      it(`GET [localhost:3000${path.path}]`, (done) => {
        request(baseUrl)
          .get(path.path)
          .expect(path.result, done);
      });
    });
  });
  describe('Cookie', () => {
    it('POST [localhost:3000/enter.html]', (done) => {
      request(baseUrl)
        .post('/enter.html')
        .send({ nickname: 'staticTests' })
        .end((err, res) => {
          const cookies = cookie.parse(res.header['set-cookie'][0]);
          expect(cookies.superEvilVirus).to.exist;
          done();
        });
    });
  });

   // Clear the test data from db
  after((done) => {
    db.User.remove({ nickname: 'staticTests' }, () => {
      done();
    });
  });
});
