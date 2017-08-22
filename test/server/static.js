/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
// ==================== SETUP ==========================

// Modules
const request = require('supertest');

// Fields
const baseUrl = 'http://localhost:3000';
const paths = [{ path: '/', result: 302 },
               { path: '/game.html', result: 200 },
               { path: '/enter.html', result: 200 },
               { path: '/logs/', result: 200 }];


// ==================== TESTS ==========================

describe('Static', () => {
  paths.forEach((path) => {
    it(`GET [localhost:3000${path}]`, (done) => {
      request(baseUrl)
        .get(path.path)
        .expect(path.result, done);
    });
  });
});
