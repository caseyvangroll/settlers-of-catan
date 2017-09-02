/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions, no-confusing-arrow, no-underscore-dangle */

// ==================== SETUP ==========================
const expect = require('chai').expect;
const db = require('../../database.js')(['test']);
const compare = require('../modelComparator.js');

// ==================== TEST DATA ==========================

const initialUser = new db.User({
  color: '#330000',
  ip: '127.0.0.1',
  nickname: 'Initial User',
  state: 'Connecting...',
  token: 'ethaseiuath98q3h489qthgiu4wagsejkgkaesjtjab4owtoaenszgtnsesaset',
});
const updates = {
  color: '#330001',
  ip: '127.0.0.5',
  nickname: 'Updated User',
  state: 'Disconnected.',
  token: 'ethaseiuath98q3h489qthgiu4wagsejkgkaesjtjab4owtoaenszgtnsesaset',
};

// ==================== TESTS ==========================

describe('Database', () => {
  describe('User', () => {

    // Create Initial User
    it('Create', (done) => {
      initialUser.save(done);
    });

    // Retrieve Initial User
    it('Retrieve', (done) => {
      db.User.findOne({ nickname: 'Initial User' }, (error, foundUser) => {
        compare(foundUser, initialUser, ['createdAt']);
        done();
      });
    });

    // Update Initial User to Updated User
    it('Update', (done) => {
      db.User.updateOne({ nickname: 'Initial User' }, updates, () => {
        db.User.findOne({ nickname: 'Updated User' }, (err1, foundUser) => {
          compare(foundUser, new db.User(updates), ['createdAt', '_id']);
          db.User.findOne({ nickname: 'Initial User' }, (err2, notFoundUser) => {
            expect(notFoundUser).to.be.null;
            done();
          });
        });
      });
    });

    it('Delete', (done) => {
      db.User.deleteOne({ nickname: 'Updated User' }, () => {
        db.User.findOne({ nickname: 'Updated User' }, (error, notFoundUser) => {
          expect(notFoundUser).to.be.null;
          done(error);
        });
      });
    });
  });
});
