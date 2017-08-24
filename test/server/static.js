/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
// ==================== SETUP ==========================

// Modules
const request = require('supertest');
const expect = require('chai').expect;
const cookie = require('cookie');

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
      it(`GET [localhost:3000${path}]`, (done) => {
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
        .field('nickname', 'Test User')
        .end((err, res) => {
          const cookies = cookie.parse(res.header['set-cookie'][0]);
          expect(cookies.superEvilVirus).to.exist;
          done();
        });
    });
  });
});
