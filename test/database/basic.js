/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions, no-confusing-arrow, no-underscore-dangle */

// ==================== SETUP ==========================
const expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoConfig = require('../../mongoConfig.js');
const mongoUri = mongoConfig.test.uri;
const User = mongoConfig.models.User;

const compare = require('../modelComparator.js');

// ==================== TEST DATA ==========================

// TODO: update to reflect new user keys

const initialUser = new User({
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
  describe('Standalone', () => {

    // Connect to db if not connected
    before(done => mongoose.connect(mongoUri, { useMongoClient: true }, done()));

    // Create Initial User
    it('Create', (done) => {
      initialUser.save(done);
    });

    // Retrieve Initial User
    it('Retrieve', (done) => {
      User.findOne({ nickname: 'Initial User' }, (error, foundUser) => {
        compare(foundUser, initialUser, true);
        done();
      });
    });

    // Update Initial User to Updated User
    it('Update', (done) => {
      User.updateOne({ nickname: 'Initial User' }, updates, () => {
        User.findOne({ nickname: 'Updated User' }, (err1, foundUser) => {
          compare(foundUser, new User(updates), false);
          User.findOne({ nickname: 'Initial User' }, (err2, notFoundUser) => {
            expect(notFoundUser).to.be.null;
            done();
          });
        });
      });
    });

    it('Delete', (done) => {
      User.deleteOne({ nickname: 'Updated User' }, () => {
        User.findOne({ nickname: 'Updated User' }, (error, notFoundUser) => {
          expect(notFoundUser).to.be.null;
          done(error);
        });
      });
    });

    // Clear the collection
    after(done => User.delete({}, done()));
  });
});
